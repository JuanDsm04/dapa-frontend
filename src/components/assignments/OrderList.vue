<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OrderCard from './OrderCard.vue'
import type { Order, orderFilter } from '@/types/order'

const props = defineProps<{
  title?: string
  orders: Order[]
  availableFilters: orderFilter[]
  selectedOrderId?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'order-selected', order: Order): void
}>()

// Estados internos
const filter = ref<string | null>(null)
const showFilters = ref(false)
const selectedOrderId = ref<number | string | null>(null)

// Referencia al wrapper del filtro
const filterWrapper = ref<HTMLElement | null>(null)

// Manejar selección de orden
const handleOrderClick = (order: Order) => {
  selectedOrderId.value = order.id
  emit('order-selected', order)
}

// Toggle de filtros
function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

// Selección de filtro
function setFilter(option: string) {
  filter.value = option
  showFilters.value = false
}

// Función para cerrar filtros al hacer clic fuera
const handleClickOutside = (event: Event) => {
  if (filterWrapper.value && !filterWrapper.value.contains(event.target as Node)) {
    showFilters.value = false
  }
}

const filteredOrders = computed(() => {
  let sorted = [...props.orders]

  switch (filter.value) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case 'pending':
      return sorted.filter(order => order.status === 'pending')
    case 'assigned':
      return sorted.filter(order => order.status === 'assigned')
    case 'pickup':
      return sorted.filter(order => order.status === 'pickup')
    case 'collected':
      return sorted.filter(order => order.status === 'collected')
    case 'delivered':
      return sorted.filter(order => order.status === 'delivered')
    default:
      return sorted
  }
})

// Montaje del componente
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Desmontaje del componente
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <section class="order-list">
    <header>
      <h2 class="text-subtitle">{{ title }}</h2>
      <div class="filter-wrapper" ref="filterWrapper">
        <button class="filter-btn" @click="toggleFilterOptions">
          <span class="material-symbols-outlined">tune</span>
        </button>
        <div v-if="showFilters" class="filter-options">
          <button
            v-for="option in props.availableFilters"
            :key="option.value"
            @click="setFilter(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </header>

    <div class="card-list">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        :isSelected="selectedOrderId === order.id"
        @click="handleOrderClick(order)"
      />
      <section v-if="filteredOrders.length === 0" class="no-selection">
        <div class="no-selection-content">
            <span class="material-symbols-outlined md-icon">description</span>
            <p>No hay ordenes disponibles</p>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.order-list {
  padding: 1.5rem;
  height: 100%;
  position: relative;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  font-weight: 600;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
}

.filter-wrapper {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  background-color: var(--neutral-white);
  font-size: clamp(0.9rem, 2vw, 1rem);
  cursor: pointer;
}

.filter-btn:hover {
  background-color: var(--neutral-gray-50);
}

.filter-options {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: var(--neutral-white);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
  min-width: 200px;
}

.filter-options button {
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.filter-options button:hover {
  background-color: var(--neutral-gray-100);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 20px;
}

.no-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-selection-content {
    text-align: center;
    color: var(--neutral-gray-600);
}

.no-selection-content .material-symbols-outlined {
    font-size: clamp(2.5rem, 6vw, 3rem);
    margin-bottom: 1rem;
    opacity: 0.5;
}

@media (max-width: 770px) {
  .text-subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  }
}
</style>