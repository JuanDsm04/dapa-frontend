<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Sortable from 'sortablejs'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import QuestionCard from '@/components/form/QuestionCard.vue'
import QuestionForm from '@/components/form/QuestionForm.vue'
import FormPreview from '@/components/form/FormPreview.vue'

import { type QuestionType, type Question } from '@/types/form'
import { 
  createQuestion, 
  getQuestions, 
  updateQuestion, 
  deleteQuestion, 
  getQuestionTypes, 
  toggleActiveQuestion, 
  reorderQuestions 
} from '@/services/formService'

/* Estados reactivos */
const questions = ref<Question[]>([])            // Todas las preguntas
const activeQuestions = ref<Question[]>([])      // Solo las activas
const questionTypes = ref<QuestionType[]>([])    // Tipos de preguntas disponibles
const loading = ref(false)                       // Estado de carga general
const activeTab = ref<'left' | 'right'>('left')  // Pestaña activa (editor o preview)
const questionSelected = ref<Question | undefined>(undefined) // Pregunta en edición
const showModal = ref(false)                     // Estado modal de pregunta

/* SortableJS */
const sortableContainer = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

/* Propiedades computadas */
const activeQuestionsCount = computed(() => questions.value.filter(q => q.isActive).length)
const totalQuestions = computed(() => questions.value.length)

/* Ciclo de vida */
onMounted(async () => {
  await loadQuestions()
  initSortable()
})

onUnmounted(() => {
  sortableInstance?.destroy()
  sortableInstance = null
})

/* Inicializar SortableJS */
const initSortable = () => {
  if (!sortableContainer.value) return

  sortableInstance = Sortable.create(sortableContainer.value, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    handle: '.drag-handle',
    fallbackOnBody: true,
    swapThreshold: 0.65,

    // Cuando el drag termina -> actualizar orden
    onEnd: async ({ oldIndex, newIndex }: any) => {
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

      const source = questions.value[oldIndex]
      const target = questions.value[newIndex]

      try {
        await reorderQuestions(source.id, target.id)
        await loadQuestions()
      } catch (err) {
        const error = err as Error
        console.error('Error al reordenar preguntas:', error)
        toast.error(`Error al reordenar preguntas: ${error.message}`)

        // Restaurar orden en caso de error
        sortableInstance?.sort(questions.value.map((q) => q.id.toString()))
      }
    }
  })
}

/* Watchers */
// Reinicia SortableJS al volver al editor
watch(activeTab, async (newTab) => {
  if (newTab === 'left') {
    await nextTick()
    sortableInstance?.destroy()
    sortableInstance = null
    initSortable()
  }
})

/* CRUD: Preguntas */
const loadQuestions = async () => {
  loading.value = true
  try {
    // Se cargan todas las entidades necesarias en paralelo
    const [all, types] = await Promise.all([
      getQuestions(),
      getQuestionTypes()
    ])
    questions.value = all
    activeQuestions.value = all.filter(q => q.isActive)
    questionTypes.value = types
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
  const q = questions.value[index]
  if (!q) return

  // Copia profunda de la pregunta (para no mutar el estado original)
  questionSelected.value = {
    ...q,
    options: q.options ? [...q.options] : undefined
  }
  showModal.value = true
}

const closeModal = () => {
  questionSelected.value = undefined
  showModal.value = false
}

const handleAddOrEditQuestion = async (payload: Partial<Question>) => {
  loading.value = true
  try {
    if (payload.id) {
      // Si ya existe → actualizar
      payload.options = payload.options?.map(opt => ({
        id: opt.id,
        option: opt.option,
        questionId: payload.id
      }))
      await updateQuestion(payload.id, payload)
      toast.info('Pregunta modificada exitosamente')
    } else {
      // Si no existe → crear
      await createQuestion(payload)
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
  const q = questions.value[index]
  if (!q) return

  if (!confirm(`¿Eliminar la pregunta: "${q.question}"?`)) return

  loading.value = true
  try {
    await deleteQuestion(q.id!)
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
  const q = questions.value[index]
  if (!q) return

  try {
    await toggleActiveQuestion(q.id!)
    await loadQuestions()
    toast.info(`Pregunta ${!q.isActive ? 'activada' : 'desactivada'}`)
  } catch (err) {
    const error = err as Error
    console.error('Error actualizando pregunta:', error)
    toast.error(`Error: ${error.message}`)
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
        <FormPreview :questions="activeQuestions" :is-preview="false"/>
      </section>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <article>
        <header>
          <h3>{{ questionSelected ? 'Editar Pregunta' : 'Agregar Pregunta' }}</h3>
          <button class="close-btn" @click="closeModal">
            <span class="material-symbols-outlined md-icon">close</span>
          </button>
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
  background: var(--neutral-white);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  color: var(--neutral-gray-900);
  font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
  font-weight: 600;
}

.subtitle {
  margin: 0 0 1.5rem 0;
  color: var(--neutral-gray-600);
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
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
  font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
  font-weight: 700;
  color: var(--principal-primary-800);
  line-height: 1;
}

.stat-label {
  font-size: clamp(0.75rem, 0.4vw + 0.5rem, 0.85rem);
  color: var(--neutral-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--principal-primary);
  color: var(--neutral-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-0.125rem);
  background: var(--add-btn-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--neutral-white);
  color: var(--neutral-gray-600);
  border: 0.125rem solid var(--border-light);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--principal-error);
  color: var(--principal-error);
  background: var(--principal-error-25);
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
  background-color: var(--neutral-gray-50);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 2.5rem; /* 40px → rem */
  height: 2.5rem;
  border: 0.25rem solid var(--border-light);
  border-top: 0.25rem solid var(--principal-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.column {
  width: 100%;
  max-width: 50rem; /* 800px → rem */
  padding: 2rem;
  background-color: var(--neutral-white);
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 0.125rem solid var(--border-light);
}

.preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 50rem;
  background-color: var(--neutral-white);
  border-radius: 8px;
  margin: 1rem 0;
  padding: 2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 0.125rem solid var(--border-light);
}

.title {
  font-weight: 600;
  margin: 0;
  color: var(--neutral-gray-900);
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.5rem);
}

.count {
  background-color: var(--neutral-gray-600);
  color: var(--neutral-white);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: clamp(0.75rem, 0.4vw + 0.5rem, 0.85rem);
  font-weight: 500;
}

.draggable-container {
  min-height: 12.5rem; /* 200px → rem */
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 6.25rem; /* 100px → rem */
}

.sortable-item {
  position: relative;
  margin-bottom: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--neutral-gray-500);
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-subtitle {
  font-size: clamp(0.75rem, 0.4vw + 0.5rem, 0.9rem);
  opacity: 0.8;
}

/* Toggle Styles */
.toggle-wrapper {
  display: flex;
  background-color: var(--neutral-gray-200);
  border-radius: 10px;
  position: relative;
  width: 18.75rem; /* 300px → rem */
  height: 3.75rem; /* 60px → rem */
  padding: 0.375rem; /* 6px → rem */
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 0.375rem; /* 6px → rem */
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-indicator {
  position: absolute;
  top: 0.375rem;
  left: 0.375rem;
  width: calc(50% - 0.375rem);
  height: calc(100% - 0.75rem);
  background-color: var(--neutral-white);
  border-radius: 10px;
  transition: all 0.3s ease;
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 3rem; /* 48px → rem */
  cursor: pointer;
  z-index: 2;
  user-select: none;
}

.active-left .toggle-indicator { left: 0.375rem; }
.active-right .toggle-indicator { left: 50%; }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--neutral-white);
  border-radius: 10px;
  max-width: 37.5rem; /* 600px → rem */
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0.25rem 1.25rem rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

article header h3 {
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.5rem);
  font-weight: 500;
  margin: 0;
}

article section { padding: 1.5rem; }

.close-btn {
  background: none;
  border: none;
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.5rem);
  color: var(--neutral-gray-500);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: var(--close-btn-hover, var(--neutral-gray-700));
}

/* Drag & Drop Styles (sortablejs) */
:deep(.sortable-ghost) { 
  opacity: 0.4; 
  background: var(--principal-primary-50); 
  transform: scale(1.05);
  border-radius: 16px;
  padding: 0.25rem;
  border: 2px dashed var(--principal-primary-500); 
}
:deep(.sortable-chosen) {
  border-radius: 16px;
  opacity: 0.8; 
  background: var(--principal-primary-50); 
}
:deep(.sortable-drag) { 
  opacity: 0.9; 
  background: var(--neutral-gray-100); 
  box-shadow: 0 0.5rem 1.5625rem rgba(0,0,0,0.25); 
  transform: rotate(1deg); border: 2px solid var(--principal-primary-100); 
  z-index: 1000; 
}

/* Responsive Design */
@media (max-width: 1024px) { /* 1024px → rem */
  .form-builder { padding: 1rem; }
  .header { flex-direction: column; align-items: stretch; text-align: center; }
  .header-content { margin-bottom: 1rem; }
  .stats { justify-content: center; }
  .header-actions { justify-content: center; }
  .toggle-wrapper { width: 15.625rem; } /* 250px → rem */
}

@media (max-width: 770px) { /* 768px → rem */
  .header-content h1 { font-size: 1.5rem; }
  .stats { gap: 1rem; }
  .stat-number { font-size: 1.5rem; }
  .header-actions { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .column-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
  .toggle-wrapper { width: 12.5rem; } /* 200px → rem */
  article { margin: 1rem; max-width: calc(100% - 2rem); }
}

@media (max-width: 30rem) { /* 480px → rem */
  .form-builder { padding: 0.5rem; }
  .header { padding: 1rem; }
  .stats { flex-direction: column; gap: 0.5rem; }
}
</style>
