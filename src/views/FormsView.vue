<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import QuestionCard from '@/components/form/QuestionCard.vue'
import QuestionForm from '@/components/form/QuestionForm.vue'
import FormPreview from '@/components/form/FormPreview.vue'

import { type QuestionType, type Question } from '@/types/form'
import { createQuestion, getActiveQuestions, getQuestions, updateQuestion, deleteQuestion, getQuestionTypes } from '@/services/formService'

const questions = ref<Question[]>([])
const activeQuestions = ref<Question[]>([])
const questionTypes = ref<QuestionType[]>([])
const loading = ref(false)
const activeTab = ref('left')
const questionSelected = ref<Question | undefined>(undefined)
const showModal = ref(false)

const sortableContainer = ref<HTMLElement>()
let sortableInstance: Sortable | null = null

const activeQuestionsCount = computed(() => questions.value.filter(q => q.isActive).length)
const totalQuestions = computed(() => questions.value.length)

onMounted(async () => {
  await loadQuestions()
  initSortable()
})

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})

const initSortable = () => {
  if (!sortableContainer.value) return
  sortableInstance = Sortable.create(sortableContainer.value, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    handle: '.drag-handle',
    forceFallback: false,
    fallbackOnBody: true,
    swapThreshold: 0.65,
  })
}

const loadQuestions = async () => {
  loading.value = true
  try {
    questions.value = await getQuestions()
    activeQuestions.value = await getActiveQuestions()
    questionTypes.value = await getQuestionTypes()
  } catch (err) {
    const error = err as Error
    console.error('Error cargando preguntas:', error)
    toast.error(`Error al cargar preguntas: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  questionSelected.value = undefined
  showModal.value = true
}

const editQuestion = (index: number) => {
  if (questions.value[index]) {
    questionSelected.value = {
      ...questions.value[index],
      options: questions.value[index].options ? [...questions.value[index].options] : undefined
    }
    showModal.value = true
  }
}

const closeModal = () => {
  questionSelected.value = undefined
  showModal.value = false
}

const handleAddOrEditQuestion = async (payload: Partial<Question>) => {
  loading.value = true
  try {
    if (payload.id) {
      toast.info('Pregunta modificada exitosamente')
      payload.options = payload.options?.map(opt => ({
        id: opt.id,
        option: opt.option,
        questionId: payload.id
      }))
      console.log("data enviada: "+JSON.stringify(payload))
      const response = await updateQuestion(payload.id, payload)
      console.log("respuesta: "+JSON.stringify(response))
    } else {
      const response = await createQuestion(payload)
      toast.success('Pregunta agregada correctamente')
    }
    await loadQuestions()
    closeModal()
  } catch (err) {
    const error = err as Error
    console.error('Error al guardar pregunta:', error)
    toast.error(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const handleDeleteQuestion = async (index: number) => {
  if (!questions.value[index]) return

  const question = questions.value[index]
  if (!confirm(`¿Estás seguro de que deseas eliminar la pregunta: "${question.question}"?`)) {
    return
  }

  loading.value = true
  try {
    await deleteQuestion(question.id!)
    await loadQuestions()
    toast.warning('Pregunta eliminada')
  } catch (err) {
    const error = err as Error
    console.error('Error eliminando pregunta:', error)
    toast.error(`Error eliminando pregunta: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const toggleQuestion = async (index: number) => {
  if (!questions.value[index]) return

  const question = questions.value[index]
  const updatedQuestion = { ...question, isActive: !question.isActive }

  try {
    await updateQuestion(question.id!, updatedQuestion)
    await loadQuestions()
    toast.info(`Pregunta ${updatedQuestion.isActive ? 'activada' : 'desactivada'}`)
  } catch (err) {
    const error = err as Error
    console.error('Error actualizando pregunta:', error)
    toast.error(`Error: ${error.message}`)
  }
}

const clearAllQuestions = () => {
  if (questions.value.length > 0) {
    if (confirm('¿Estás seguro de que deseas eliminar todas las preguntas? Esta acción no se puede deshacer.')) {
      questions.value = []
      toast.warning('Todas las preguntas han sido eliminadas')
    }
  }
}
</script>

<template>
  <div class="form-builder">
    <header class="header">
      <div class="header-content">
        <h1>Administrador de formulario</h1>
        <p class="subtitle">Crea y personaliza el formulario arrastrando y configurando preguntas</p>

        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalQuestions }}</span>
            <span class="stat-label">Total preguntas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ activeQuestionsCount }}</span>
            <span class="stat-label">Activas</span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <button @click="openModal" class="btn-primary" :disabled="loading">
          {{ loading ? 'Cargando...' : '+ Agregar Pregunta' }}
        </button>
        <button @click="clearAllQuestions" class="btn-secondary" :disabled="questions.length === 0 || loading">
          Limpiar Todo
        </button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
        <div class="toggle-indicator"></div>
        <div class="toggle-button" @click="activeTab = 'left'">Editor</div>
        <div class="toggle-button" @click="activeTab = 'right'">Preview</div>
      </div>

      <section v-if="activeTab === 'left'" class="column">
        <div class="column-header">
          <h2 class="title">Preguntas del formulario</h2>
          <span class="count">{{ questions.length }} pregunta{{ questions.length !== 1 ? 's' : '' }}</span>
        </div>

        <div class="draggable-container">
          <div ref="sortableContainer" class="draggable-list">
            <div v-for="(question, index) in questions" :key="`question-${question.id}`" class="sortable-item"
              :data-id="question.id">
              <QuestionCard :question="question" :question_types="questionTypes" @edit="editQuestion(index)"
                @delete="handleDeleteQuestion(index)" @toggle="toggleQuestion(index)" />
            </div>
          </div>

          <div v-if="questions.length === 0" class="empty-state">
            <p>No hay preguntas creadas</p>
            <p class="empty-subtitle">Agrega tu primera pregunta para comenzar</p>
          </div>
        </div>
      </section>

      <section v-else class="preview">
        <div class="preview-header">
          <h2 class="title">Preview del formulario</h2>
        </div>
        <FormPreview :questions="questions" />
      </section>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <article>
        <header>
          <h3>{{ questionSelected ? 'Editar Pregunta' : 'Agregar Pregunta' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </header>

        <section>
          <QuestionForm :initialData="questionSelected" :question-types="questionTypes"
            @submit="handleAddOrEditQuestion" :updating="!!questionSelected" :loading="loading" />
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped>
.form-builder {
  min-height: 100vh;
  background: var(--bg-general);
  padding: 2rem;
}

.header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 1rem;
}

.stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--add-btn);
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--add-btn);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--add-btn-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--on-delete-btn);
  color: var(--on-delete-btn);
  background: #fafafa;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--add-btn);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.column {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 2px solid #e9ecef;
}

.title {
  font-weight: 600;
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.count {
  background-color: #6c757d;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.draggable-container {
  min-height: 200px;
}

.draggable-list {
  min-height: 100px;
}

.sortable-item {
  position: relative;
  margin-bottom: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.toggle-wrapper {
  display: flex;
  background-color: #EAEEF4;
  border-radius: 10px;
  position: relative;
  width: 300px;
  height: 60px;
  padding: 6px;
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 0.6rem;
}

.toggle-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background-color: white;
  border-radius: 10px;
  transition: all 0.3s ease;
  z-index: 1;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
}

.active-left .toggle-indicator {
  left: 6px;
}

.active-right .toggle-indicator {
  left: 50%;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--modal-bg, white);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input, #e0e0e0);
}

article header h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--close-btn, #666);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: var(--close-btn-hover, #333);
  background-color: rgba(0, 0, 0, 0.1);
}

/* Estilos para el drag and drop con sortablejs */
:deep(.sortable-ghost) {
  opacity: 0.4;
  background: #c1e5f5;
  transform: scale(1.01);
  border: 2px dashed #177fd4;
}

:deep(.sortable-chosen) {
  opacity: 0.8;
  background: #e3f2fd;
}

:deep(.sortable-drag) {
  opacity: 0.9;
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  transform: rotate(1deg);
  border: 2px solid #177fd4;
  z-index: 1000;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-builder {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .header-content {
    margin-bottom: 1rem;
  }

  .stats {
    justify-content: center;
  }

  .header-actions {
    justify-content: center;
  }

  .toggle-wrapper {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 1.5rem;
  }

  .stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .header-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .column-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .toggle-wrapper {
    width: 200px;
  }

  article {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 480px) {
  .form-builder {
    padding: 0.5rem;
  }

  .header {
    padding: 1rem;
  }

  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>