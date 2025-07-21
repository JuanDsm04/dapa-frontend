<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { v4 as uuid } from 'uuid'
import Sortable from 'sortablejs'
import QuestionCard from '@/components/form/QuestionCard.vue'
import QuestionForm from '@/components/form/QuestionForm.vue'
import { type Question } from '@/types/form'

//Preguntas de prueba
const questions = ref<Question[]>([
  {
    id: uuid(),
    text: '¿Cuál es tu nombre completo?',
    type: 'text',
    active: true,
  },
  {
    id: uuid(),
    text: '¿Cuál es tu color favorito?',
    type: 'multiple',
    options: ['Rojo', 'Verde', 'Azul', 'Amarillo'],
    active: true,
  },
  {
    id: uuid(),
    text: '¿En qué ciudad vives?',
    type: 'dropdown',
    options: ['Ciudad de Guatemala', 'Quetzaltenango', 'Escuintla', 'Otra'],
    active: false,
  }
])

const questionSelected = ref<Question | null>(null)
const editIndex = ref<number | null>(null)

const sortableContainer = ref<HTMLElement>()
let sortableInstance: Sortable | null = null

const activeQuestionsCount = computed(() => 
  questions.value.filter(q => q.active).length
)

const totalQuestions = computed(() => questions.value.length)

onMounted(() => {
    if(!sortableContainer.value){
        return
    }
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
})

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})

const addQuestion = () => {
  questionSelected.value = {
    id: uuid(),
    text: '',
    type: 'text',
    active: true
  }
  editIndex.value = null
}

const editQuestion = (index: number) => {
  if (questions.value[index]) {
    questionSelected.value = {
      ...questions.value[index],
      options: questions.value[index].options ? [...questions.value[index].options] : undefined
    }
    editIndex.value = index
  }
}

const deleteQuestion = (index: number) => {
  if (questions.value[index]) {
    const question = questions.value[index]
    if (confirm(`¿Estás seguro de que deseas eliminar la pregunta: "${question.text}"?`)) {
      questions.value.splice(index, 1)
    }
  }
}

const toggleQuestion = (index: number) => {
  if (questions.value[index]) {
    questions.value[index].active = !questions.value[index].active
  }
}

const saveChanges = (question: Question) => {
  if (editIndex.value !== null && editIndex.value < questions.value.length) {
    questions.value[editIndex.value] = question
  } else {
    questions.value.push(question)
  }
  closeModal()
}

const closeModal = () => {
  questionSelected.value = null
  editIndex.value = null
}

const clearAllQuestions = () => {
  if (questions.value.length > 0) {
    if (confirm('¿Estás seguro de que deseas eliminar todas las preguntas? Esta acción no se puede deshacer.')) {
      questions.value = []
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
        <button @click="addQuestion" class="btn-primary">
          + Agregar Pregunta
        </button>
        <button 
          @click="clearAllQuestions" 
          class="btn-secondary"
          :disabled="questions.length === 0"
        >
          Limpiar Todo
        </button>
      </div>
    </header>

    <main class="main-content">
      <section class="column">
        <div class="column-header">
          <h2 class="title">Preguntas del formulario</h2>
          <span class="count">{{ questions.length }} pregunta{{ questions.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="draggable-container">
          <div 
            ref="sortableContainer" 
            class="draggable-list"
          >
            <div
              v-for="(question, index) in questions"
              :key="`question-${question.id}`"
              class="sortable-item"
              :data-id="question.id"
            >
              <QuestionCard
                :question="question"
                @edit="editQuestion(index)"
                @delete="deleteQuestion(index)"
                @toggle="toggleQuestion(index)"
              />
            </div>
          </div>
          
          <div v-if="questions.length === 0" class="empty-state">
            <p>No hay preguntas creadas</p>
            <p class="empty-subtitle">Agrega tu primera pregunta para comenzar</p>
          </div>
        </div>
      </section>
    </main>

    <QuestionForm 
      v-if="questionSelected" 
      :question="questionSelected" 
      @save="saveChanges" 
      @cancel="closeModal" 
    />
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

.btn-primary:hover {
  transform: translateY(-2px);
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
  border-color: #d32f2f;
  color: #d32f2f;
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
}

.column {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  background-color: var(--white);
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

.additional-actions {
  margin-top: 1rem;
  text-align: center;
}

.btn-link {
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  transition: opacity 0.2s ease;
}

.btn-link:hover {
  opacity: 0.8;
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
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .column-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
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