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
        <label>Estado</label>
        <p class="status-text" :class="statusClass">{{ statusText }}</p>
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
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: white;
  max-width: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quote-card:hover {
  background-color: rgb(245, 245, 245);
}

.quote-card.selected {
  border-color: #2563eb;
  background-color: #f0f4ff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.status-pending {
  background-color: #f59e0b;
}

.status-approved {
  background-color: #10b981;
}

.status-cancelled {
  background-color: #ef4444;
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
  font-size: 0.9rem;
  color: #666;
  display: block;
  margin-bottom: 0.2rem;
}

p {
  margin: 0;
  font-size: 1rem;
  color: #000;
  font-weight: 500;
}

.status-text {
  font-weight: 600;
  display: inline-block;
  height: 25px;
  border-radius: 12px;
  padding: 0 1rem;
  text-align: center;
}

.status-text.status-pending {
  color: #fff;
}

.status-text.status-approved {
  color: #fff;
}

.status-text.status-cancelled {
  color: #fff;
}

.image-container {
  display: block;
  flex-shrink: 0;
  margin-left: 1rem;
}

.image-container img {
  width: 100px;
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
    font-size: 0.8rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}
</style>