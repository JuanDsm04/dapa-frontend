<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getSubmissionById } from '@/services/submissionService'
import FormPreview from '../form/FormPreview.vue'
import type { Submission } from '@/types/form'

const props = defineProps<{
  show: boolean
  submissionId?: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Estado para el modal de respuestas
const submission = ref<Submission | null>(null)
const submissionLoading = ref(false)
const submissionError = ref<string | null>(null)

// Formatear fecha para mostrar en el modal
const formattedDate = computed(() => {
  if (!submission.value?.submittedAt) return '----'
  
  const date = new Date(submission.value.submittedAt)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Función para obtener la submission
const fetchSubmission = async (id: number) => {
  submissionLoading.value = true
  submissionError.value = null
  submission.value = null
  
  try {
    submission.value = await getSubmissionById(id)
  } catch (err) {
    console.error('Error obteniendo submission:', err)
    submissionError.value = 'Error al cargar las respuestas del formulario'
    toast.error('Error al cargar las respuestas del formulario')
  } finally {
    submissionLoading.value = false
  }
}

// Función para cerrar el modal
const closeModal = () => {
  submission.value = null
  submissionError.value = null
  emit('close')
}

// Función para abrir el modal y cargar los datos
const openModal = async (submissionId: number) => {
  if (submissionId) {
    await fetchSubmission(submissionId)
  } else {
    toast.error("Esta orden no tiene un formulario asociado")
  }
}

// Exponer la función para que el componente padre pueda llamarla
defineExpose({
  openModal
})
</script>

<template>
  <!-- Modal de respuestas del formulario -->
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <h3>Respuestas del formulario</h3>
        <div class="header-actions">
          <div v-if="submission" class="submission-info">
            <span class="submission-id">#{{ submission.id }}</span>
            <span class="submission-date">{{ formattedDate }}</span>
          </div>
          <button class="close-btn" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Contenido del modal -->
      <div class="modal-body">
        <div v-if="submissionLoading" class="loading-state-modal">
          <div class="spinner"></div>
          <p>Cargando respuestas del formulario...</p>
        </div>
        
        <div v-else-if="submissionError" class="error-state">
          <span class="material-symbols-outlined">error</span>
          <p>{{ submissionError }}</p>
        </div>
        
        <div v-else-if="submission && submission.answers.length > 0">
          <FormPreview
            :questions="submission.answers.map(a => a.question)" 
            :answers="submission.answers"
            :isPreview="true"
          />
        </div>
        
        <div v-else class="no-answers">
          <span class="material-symbols-outlined">help_outline</span>
          <p>No hay respuestas disponibles para este formulario</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--neutral-white);
  border-radius: 12px;
  width: 100%;
  max-width: 50rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-gray-200);
  position: relative;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-gray-900);
}

.submission-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
  font-size: 0.875rem;
}

.submission-id {
  font-weight: 600;
  color: var(--neutral-gray-900);
}

.submission-date {
  color: var(--neutral-gray-600);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-gray-500);
}

.close-btn:hover {
  color: var(--neutral-gray-700);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  min-height: 0;
}

.loading-state-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid var(--neutral-gray-200);
  border-top: 0.25rem solid var(--principal-primary);
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

.error-state,
.no-answers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  text-align: center;
  color: var(--neutral-gray-600);
}

.error-state .material-symbols-outlined,
.no-answers .material-symbols-outlined {
  font-size: 3rem;
  opacity: 0.5;
}

.error-state {
  color: var(--principal-error-600);
}

@media (max-width: 770px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .submission-info {
    align-items: flex-start;
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
}
</style>