<script setup lang="ts">
import { ref, computed } from "vue";
import OrderForm from "@/components/assignments/OrderForm.vue";
import FormPreview from "../form/FormPreview.vue";
import { type Answer, type Submission } from '@/types/form';

const props = defineProps<{
  submission: Submission | undefined
}>();

const emit = defineEmits(['back-to-list'])

// Estado que indica si se está en modo formulario
const showOrderForm = ref(false);

const aceptar = () => {
    showOrderForm.value = true;
};

const volver = () => {
    showOrderForm.value = false;
};

const handleBackToList = () => {
  emit('back-to-list')
}

// Formatear fecha para mostrar
const formattedDate = computed(() => {
  if (!props.submission?.submittedAt) return '----'
  
  const date = new Date(props.submission.submittedAt)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
});

// Texto del estado en español
const statusText = computed(() => {
  if (!props.submission) return ''
  
  switch (props.submission.status) {
    case 'approved':
      return 'Aprobado'
    case 'cancelled':
      return 'Cancelado'
    case 'pending':
    default:
      return 'Pendiente'
  }
});

// Clase CSS para el estado
const statusClass = computed(() => {
  if (!props.submission) return ''
  
  switch (props.submission.status) {
    case 'approved':
      return 'status-approved'
    case 'cancelled':
      return 'status-cancelled'
    case 'pending':
    default:
      return 'status-pending'
  }
});

// Formatear respuesta según el tipo de pregunta
// const formatAnswer = (answer: Answer) => {
//   if (!answer.answer && (!answer.options || answer.options.length === 0)) {
//     return 'Sin respuesta'
//   }
  
//   // Si es una pregunta con opciones múltiples
//   if (answer.options && answer.options.length > 0) {
//     return answer.options.map(option => option.option).join(', ')
//   }
  
//   // Si es una respuesta de texto
//   return answer.answer || 'Sin respuesta'
// };
</script>

<template>
    <div class="information-quote">
        <!-- Encabezado -->
        <header>
            <!-- Botón de regresar solo en móvil -->
            <button class="back-btn mobile-only" @click="handleBackToList">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            
            <div v-if="!showOrderForm" class="header-content">
                <h2>Respuestas del formulario</h2>
                <div v-if="submission" class="submission-info">
                    <span class="submission-id">#{{ submission.id }}</span>
                    <span class="submission-date">{{ formattedDate }}</span>
                    <span class="submission-status" :class="statusClass">{{ statusText }}</span>
                </div>
            </div>
            <h2 v-else class="header-content">Ingresar información</h2>
        </header>

        <!-- Mensaje cuando no hay submission seleccionada -->
        <section v-if="!submission && !showOrderForm" class="no-selection">
            <div class="no-selection-content">
                <span class="material-symbols-outlined">description</span>
                <p>Selecciona un formulario para ver sus respuestas</p>
            </div>
        </section>

        <!-- Respuestas del formulario -->
        <section v-else-if="!showOrderForm && submission" >
            <FormPreview
                :questions="submission.answers.map(a => a.question)" 
                :answers="submission.answers"
                :isPreview="true"
            />

            <!-- Mensaje cuando no hay respuestas -->
            <div v-if="submission.answers.length === 0" class="no-answers">
                <span class="material-symbols-outlined">help_outline</span>
                <p>Este formulario no tiene respuestas registradas</p>
            </div>
        </section>

        <!-- Formulario de información -->
        <section v-else-if="showOrderForm" class="order-form-container">
            <OrderForm :isEdit="false" @volver="volver" />
        </section>

        <!-- Botones -->
        <section v-if="!showOrderForm && submission && submission.status === 'pending'" class="action-container">
            <button class="reject-btn">
                <span class="material-symbols-outlined">close</span>
                Rechazarla
            </button>
            <button class="accept-btn" @click="aceptar">
                <span class="material-symbols-outlined">check</span>
                Aceptarla
            </button>
        </section>

        <!-- Estado de la submission (si no es pendiente) -->
        <section v-else-if="!showOrderForm && submission && submission.status !== 'pending'" class="status-info">
            <div class="status-message" :class="statusClass">
                <span class="material-symbols-outlined">
                    {{ submission.status === 'approved' ? 'check_circle' : 'cancel' }}
                </span>
                <span>Esta submission ya ha sido {{ statusText.toLowerCase() }}</span>
            </div>
        </section>
    </div>
</template>

<style scoped>
.information-quote {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    border-radius: 10px;
    background-color: white;
    height: 100%;
    max-height: 100%;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    position: relative;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  display: none;
  padding: 0.5rem;
}

.back-btn:hover {
  color: #2f67f6;
}

.mobile-only {
  display: none;
}

.header-content {
    width: 100%;
}

header h2 {
    font-weight: 600;
    margin: 0;
    text-align: left;
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}

.submission-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
    font-size: clamp(0.75rem, 2vw, 0.9rem);
}

.submission-id {
    font-weight: 600;
    color: #374151;
}

.submission-date {
    color: #6b7280;
}

.submission-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: clamp(0.7rem, 2vw, 0.8rem);
}

.status-pending {
    color: #fef3c7;
    background-color: #f59e0b;
}

.no-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-selection-content {
    text-align: center;
    color: #6b7280;
}

.no-selection-content .material-symbols-outlined {
    font-size: clamp(2.5rem, 6vw, 3rem);
    margin-bottom: 1rem;
    opacity: 0.5;
}

.answer-container {
    border: 0.0625rem solid #ccc; /* 1px -> rem */
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    overflow-y: hidden;
    flex-grow: 2;
}

.order-form-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.action-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.action-container button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: white;
}

.reject-btn {
  background-color: #ff5a70;
}

.reject-btn:hover {
  background-color: #f0566a;
}

.accept-btn {
  background-color: #53d86c;
}

.accept-btn:hover {
  background-color: #53cd69;
}

.status-info {
    display: flex;
    justify-content: center;
}

.status-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    font-size: clamp(0.875rem, 2vw, 1rem);
}

.status-message.status-approved {
    background-color: #d1fae5;
    color: #065f46;
}

.status-message.status-cancelled {
    background-color: #fee2e2;
    color: #991b1b;
}

button span {
    margin-right: 0.5rem;
}

@media (max-width: 770px) {
    .information-quote {
        padding: 1rem;
    }
    
    header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .submission-info {
        align-items: flex-start;
    }
    
    .action-container {
        flex-direction: column;
        gap: 1rem;
    }

    .mobile-only {
        display: block;
    }

    .header-content h2 {
        display: none;
    }
}
</style>