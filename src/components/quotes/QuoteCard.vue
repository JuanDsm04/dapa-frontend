<script setup>
import { computed } from 'vue'

const props = defineProps({
  quote: {
    type: Object,
    required: true,
    default: () => ({ id: '', submittedAt: '', status: 'pending', answers: [] })
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['quote-selected'])

const handleClick = () => {
  emit('quote-selected', props.quote)
}

// Formatear fecha para mostrar
const formattedDate = computed(() => {
  if (!props.quote.submittedAt) return '----'
  
  const date = new Date(props.quote.submittedAt)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Obtener clase CSS según el estado
const statusClass = computed(() => {
  switch (props.quote.status) {
    case 'approved':
      return 'status-approved'
    case 'cancelled':
      return 'status-cancelled'
    case 'pending':
    default:
      return 'status-pending'
  }
})

// Texto del estado en español
const statusText = computed(() => {
  switch (props.quote.status) {
    case 'approved':
      return 'Aprobado'
    case 'cancelled':
      return 'Cancelado'
    case 'pending':
    default:
      return 'Pendiente'
  }
})

// Contar respuestas completadas
const answersCount = computed(() => {
  return props.quote.answers?.length || 0
})
</script>

<template>
  <div 
    class="quote-card" 
    :class="{ 'selected': isSelected }"
    @click="handleClick"
  >
    <!-- Información de la submission -->
    <div class="info">
      <div class="field">
        <label>Número de formulario</label>
        <p>#{{ quote.id }}</p>
      </div>
      <div class="field">
        <label>Fecha de envío</label>
        <p>{{ formattedDate }}</p>
      </div>
      <div class="field">
        <label>Respuestas</label>
        <p>{{ answersCount }} respuesta{{ answersCount !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="image-container">
      <img src="../../assets/images/package.png" alt="Submission" />
    </div>
  </div>
</template>

<style scoped>
.quote-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--neutral-gray-300);
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: var(--neutral-white);
  max-width: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quote-card:hover {
  background-color: var(--neutral-gray-50);
}

.quote-card.selected {
  border-color: var(--principal-primary);
  background-color: var(--principal-primary-25);
}

.info {
  flex: 1;
  padding-left: 0.5rem;
}

.field {
  margin-bottom: 0.5rem;
}

.field:last-child {
  margin-bottom: 0;
}

label {
  font-size: clamp(0.75rem, 1.5vw, 0.9rem); /* responsive */
  color: var(--neutral-gray-600);
  display: block;
  margin-bottom: 0.2rem;
}

p {
  margin: 0;
  font-size: clamp(0.875rem, 1.8vw, 1rem); /* responsive */
  color: var(--neutral-gray-900);
  font-weight: 500;
}

.image-container {
  display: block;
  flex-shrink: 0;
  margin-left: 1rem;
}

.image-container img {
  width: 6.25rem; /* 100px -> rem */
  object-fit: contain;
  opacity: 0.8;
}

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}

@media (max-width: 770px) {
  .quote-card {
    padding: 0.8rem;
  }
  
  .field {
    margin-bottom: 0.4rem;
  }
  
  label {
    font-size: clamp(0.7rem, 2vw, 0.8rem);
  }
  
  p {
    font-size: clamp(0.75rem, 2vw, 0.9rem);
  }
}
</style>
