<script setup>
import { ref, computed } from 'vue'
import OrderCard from './OrderCard.vue'

const props = defineProps({
  title: String,
  defaultStatuses: {
    type: Array,
    required: true
  },
  availableFilters: {
    type: Array,
    required: true
  }
})

const orders = ref([
  { id: '123456', name: 'Armando', date: '2025-04-16', status: 'pending' }, // Pendientes: Las cotizaciones que si aceptaron
  { id: '789012', name: 'Lucía', date: '2025-05-01', status: 'assigned' }, // Asignados: Chofer, pero no necesariamente ya empezó (todavia puede cambiar la persona y vehiculo asignado)
  { id: '345678', name: 'Carlos', date: '2025-05-10', status: 'pickup' }, // Aceptado - En camino a recoger
  { id: '901234', name: 'Laura', date: '2025-05-15', status: 'collected' }, // Carga recogida
  { id: '432109', name: 'Ana', date: '2025-06-10', status: 'delivered' } // Completado - Entregado
])

const filter = ref(null)
const showFilters = ref(false)

function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

function setFilter(option) {
  filter.value = option
  showFilters.value = false
}

const filteredOrders = computed(() => {
  const sorted = orders.value.filter(order =>
    props.defaultStatuses.includes(order.status)
  )

  switch (filter.value) {
    case 'recent':
      return [...sorted].sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'oldest':
      return [...sorted].sort((a, b) => new Date(a.date) - new Date(b.date))
    case 'pending':
      return sorted.filter(order => order.status === 'pending')
    case 'assigned':
      return sorted.filter(order => order.status === 'assigned')
    case 'in_progress':
      return sorted.filter(order => ['pickup', 'collected', 'transporting'].includes(order.status))
    case 'delivered':
      return sorted.filter(order => order.status === 'delivered')
    default:
      return sorted
  }
})
</script>

<template>
  <section class="order-list">
    <header>
      <h2>{{ title }}</h2>
      <div class="filter-wrapper">
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
      />
    </div>
  </section>
</template>

<style scoped>
.order-list {
  padding: 1.5rem;
  height: 100%;
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
}

.filter-wrapper {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
}

.filter-btn:hover {
  background-color: #f5f5f5;
}

.filter-options {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
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
}

.filter-options button:hover {
  background-color: #f0f0f0;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 20px;
}
</style>