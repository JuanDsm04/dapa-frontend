<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getOrders } from '@/services/orderService'
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

const emit = defineEmits(['order-selected'])

const orders = ref([])
const filter = ref(null)
const showFilters = ref(false)
const loading = ref(false)
const selectedOrderId = ref(null)

function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

function setFilter(option) {
  filter.value = option
  showFilters.value = false
}

const handleOrderClick = (order) => {
  selectedOrderId.value = order.id
  emit('order-selected', order)
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

// Obtener ordenes
const getOrdersData = async () => {
  loading.value = true
  try {
    const data = await getOrders()
    orders.value = data
  } catch (error) {
    console.error("Error obteniendo órdenes:", error)
    toast.error("Error al cargar órdenes")
  } finally {
    loading.value = false
  }
}

// Obtener ordenes al montar el componente
onMounted(() => {
  getOrdersData()
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

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div v-else class="card-list">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        :isSelected="selectedOrderId === order.id"
        @click="handleOrderClick(order)"
      />
      <p v-if="!loading && filteredOrders.length === 0">No hay órdenes disponibles</p>
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
  border-radius: 10px;
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