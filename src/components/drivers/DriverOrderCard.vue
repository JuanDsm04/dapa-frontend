<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({ id: '', name: '', date: '', status: '' })
  },
  status: {
    type: String,
    default: 'available', // 'available' | 'locked' | 'censored'
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  hasActiveOrder: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'start-order', order: any): void
}>()

// Traducción de los tipos de ordenes
const orderTypeMap = {
  move: 'Mudanza',
  cargo: 'Flete', 
  corporate: 'Empresarial'
}

// Función para obtener el tipo de servicio en español
type OrderType = 'move' | 'cargo' | 'corporate';

const getOrderTypeInSpanish = (type: OrderType) => {
  return orderTypeMap[type] || '----';
}

// Formatear fecha para mostrar
const formattedDate = computed(() => {
  if (!props.order.date) return '----'
  
  const date = new Date(props.order.date)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Determinar el estado visual de la card
const cardStatus = computed(() => {
  // Si el conductor tiene una orden activa y esta no es esa orden, mostrar como locked
  if (props.hasActiveOrder && !['pickup', 'collected'].includes(props.order.status)) {
    return 'locked'
  }
  
  // Si la orden está asignada pero no iniciada, mostrar censurada
  if (props.order.status === 'assigned') {
    return 'censored'
  }
  
  // Si la orden está en pickup o collected, mostrar disponible
  return 'available'
})

// Manejar click para iniciar orden
const handleStartOrder = () => {
  emit('start-order', props.order)
}

const getStatusColor = computed(() => {
  const status = props.order.status
  switch (status) {
    case 'pickup':
      return 'status-pickup'
    case 'collected':
      return 'status-collected'
    case 'assigned':
      return 'status-assigned'
    default:
      return 'status-default'
  }
})
</script>

<template>
  <div 
    class="driver-order-card" 
    :class="{ 
      'selected': isSelected,
      'locked': cardStatus === 'locked',
      'censored': cardStatus === 'censored'
    }"
    style="cursor: pointer;"
  >

    <!-- Información del servicio -->
    <div class="card-content">
      <div class="info">
        <div class="field">
          <label>Número de servicio</label>
          <p>#{{ order.id }}</p>
        </div>
        <div class="field">
          <label>Tipo</label>
          <p v-if="cardStatus === 'censored'">---</p>
          <p v-else>{{ getOrderTypeInSpanish(order.type) }}</p>
        </div>
        <div class="field">
          <label>Fecha de cotización</label>
          <p v-if="cardStatus === 'censored'">---</p>
          <p v-else>{{ formattedDate }}</p>
        </div>
      </div>

      <div class="image-container" v-if="cardStatus !== 'locked'">
        <img src="../../assets/images/truck.png" alt="Servicio" />
      </div>
    </div>

    <!-- Overlay según el estado -->
    <div v-if="cardStatus === 'locked'" class="overlay locked-overlay">
      <div class="lock-content">
        <div class="lock-icon">
          <span class="material-symbols-outlined">lock</span>
        </div>
        <p class="lock-text">Completa tu servicio actual para acceder</p>
      </div>
    </div>

    <!-- Botón de iniciar orden solo para órdenes censuradas y seleccionadas -->
    <div v-if="cardStatus === 'censored' && isSelected" class="start-order-section">
      <button class="start-order-btn" @click.stop="handleStartOrder">
        <span class="material-symbols-outlined">play_arrow</span>
        Aceptar e iniciar servicio
      </button>
    </div>

  </div>
</template>

<style scoped>
.driver-order-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--neutral-gray-300);
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: var(--neutral-white);
  max-width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 120px;
}

.driver-order-card:hover:not(.locked) {
  background-color: var(--neutral-gray-50);
}

.driver-order-card.selected {
  border-color: var(--principal-primary);
  background-color: var(--principal-primary-25);
}

.driver-order-card.locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.driver-order-card.censored .info p {
  color: var(--neutral-gray-400);
  font-style: italic;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.info {
  flex: 1;
}

.field {
  margin-bottom: 0.5rem;
}

label {
  font-size: clamp(0.85rem, 1.5vw, 0.9rem);
  color: var(--neutral-gray-600);
}

p {
  margin: 0;
  font-size: clamp(0.95rem, 1.5vw, 1rem);
  color: var(--neutral-black);
}

.image-container {
  display: block;
  flex-shrink: 0;
  margin-left: 1rem;
  align-self: center;
}

.image-container img {
  width: 8rem;
  object-fit: contain;
}

/* Overlay para órdenes bloqueadas */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.locked-overlay {
  background-color: var(--shadow-darker);
  border-radius: 10px;
}

.lock-content {
  text-align: center;
  color: var(--neutral-white);
}

.lock-icon .material-symbols-outlined {
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin-bottom: 0.5rem;
}

.lock-text {
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  margin: 0;
}

/* Sección de botón para iniciar orden */
.start-order-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: center;
}

.start-order-btn {
  background-color: var(--status-success);
  color: var(--neutral-white);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.start-order-btn:hover {
  background-color: var(--status-success-hover);
  transform: translateY(-1px);
}

.start-order-btn .material-symbols-outlined {
  font-size: 1.2rem;
}

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}

@media (max-width: 770px) {
  .driver-order-card {
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

  .start-order-btn {
    padding: 0.6rem 1.2rem;
    font-size: clamp(0.85rem, 1.8vw, 0.9rem);
  }
}
</style>