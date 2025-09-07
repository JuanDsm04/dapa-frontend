<script setup lang="ts">
defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({ id: '', name: '', date: '' })
  },
  status: {
    type: String,
    default: 'default', // 'default' | 'available' | 'locked'
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

// Traducción de los tipos de ordenes
const orderTypeMap = {
  business: 'Negocio',
  personal: 'Personal',
  corporate: 'Corporativo'
}

// Función para obtener el tipo de servicio en español
const getOrderTypeInSpanish = (type: any) => {
  return orderTypeMap[type] || '----';
}

// Función para formatear la fecha
const formatDate = (value: string | Date): string => {
  const date = new Date(value)
  date.setDate(date.getDate() + 1)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
</script>

<template>
  <div 
    class="order-card" 
    :class="{ 'selected': isSelected }"
    style="cursor: pointer;"
  >

    <!-- Información del servicio -->
    <div class="info">
      <div class="field">
        <label>Número de servicio</label>
        <p>#{{ order.id }}</p>
      </div>
      <div class="field">
        <label>Tipo</label>
        <p>{{ getOrderTypeInSpanish(order.type) }}</p>
      </div>
      <div class="field">
        <label>Fecha</label>
        <p>{{ formatDate(order.date) || '----' }}</p>
      </div>
    </div>

    <div class="image-container">
      <img src="../../assets/images/truck.png" alt="Servicio" />
    </div>

    <!-- Overlay según el estado -->
    <div v-if="status !== 'default'" class="overlay">
      <template v-if="status === 'available'">
        <button class="view-btn">Ver</button>
      </template>
      <template v-else-if="status === 'locked'">
        <div class="lock-icon">
          <span class="material-symbols-outlined">lock</span>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
.order-card {
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
  transition: all 0.3s ease;
}

.order-card:hover {
  background-color: var(--neutral-gray-50);
}

.order-card.selected {
  border-color: var(--principal-primary);
  background-color: var(--principal-primary-25);
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
}

.image-container img {
  width: 200px;
  object-fit: contain;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--shadow-darker);
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-btn {
  background-color: var(--status-success);
  color: var(--neutral-white);
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: clamp(0.95rem, 1.5vw, 1rem);
  cursor: pointer;
}

.lock-icon .material-symbols-outlined {
  font-size: clamp(2.5rem, 5vw, 3rem);
  color: var(--neutral-white);
}

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}
</style>