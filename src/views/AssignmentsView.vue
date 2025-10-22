<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import OrderList from '@/components/assignments/OrderList.vue';
import AssigmentForm from '@/components/assignments/AssigmentForm.vue';
import OrderTracking from '@/components/assignments/OrderTracking.vue';
import { getOrders } from '@/services/orderService';
import type { Order } from '@/types/order';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const activeTab = ref<'left' | 'right'>('left')
const selectedOrder = ref<Order | null>(null)
const showDetailView = ref(false)
const orders = ref<Order[]>([])
const loading = ref(false)

// Polling para actualizar la lista de órdenes
const POLLING_INTERVAL = 5000
let pollingTimer: NodeJS.Timeout | null = null
const isModalOpen = ref(false)
const isInteracting = ref(false)

// Computed para órdenes pendientes
const pendingOrders = computed(() => {
  return orders.value.filter(order => 
    ['pending', 'assigned'].includes(order.status)
  )
})

// Computed para órdenes en progreso
const inProgressOrders = computed(() => {
  return orders.value.filter(order => 
    ['pickup', 'collected', 'delivered'].includes(order.status)
  )
})

// Función para comparar y actualizar órdenes
const smartUpdateOrders = (newOrders: Order[]) => {
  if (orders.value.length === 0) {
    orders.value = newOrders
    return
  }

  const currentOrdersMap = new Map(orders.value.map(order => [order.id, order]))
  const newOrdersMap = new Map(newOrders.map(order => [order.id, order]))

  // Actualizar órdenes existentes y agregar nuevas
  const updatedOrders: Order[] = []

  orders.value.forEach(currentOrder => {
    const newOrder = newOrdersMap.get(currentOrder.id)
    if (newOrder) {
      if (selectedOrder.value?.id === currentOrder.id) {
        updatedOrders.push(currentOrder)

      } else {
        if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) {
          updatedOrders.push(newOrder)
        } else {
          updatedOrders.push(currentOrder)
        }
      }
    }
  })

  // Agregar nuevas órdenes que no existían antes
  newOrders.forEach(newOrder => {
    if (!currentOrdersMap.has(newOrder.id)) {
      updatedOrders.push(newOrder)
    }
  })

  orders.value = updatedOrders
}

// Cargar todas las órdenes
const loadOrders = async (showLoading = true, isPolling = false) => {
  // Si hay un modal abierto o el usuario está interactuando, no actualizar
  if (isPolling && (isModalOpen.value || isInteracting.value)) {
    return
  }

  if (showLoading) {
    loading.value = true;
  }
  
  try {
    const newOrders = await getOrders()
    if (isPolling) {
      smartUpdateOrders(newOrders)
      
      if (selectedOrder.value) {
        const updatedSelectedOrder = newOrders.find(o => o.id === selectedOrder.value!.id)
        if (updatedSelectedOrder && 
            JSON.stringify(selectedOrder.value) !== JSON.stringify(updatedSelectedOrder)) {
          selectedOrder.value = updatedSelectedOrder
        }
      }
    } else {
      orders.value = newOrders
    }
  } catch (err) {
    const error = err as Error
    console.error('Error cargando órdenes:', error)
    
    if (showLoading) {
      toast.error(`Error al cargar órdenes: ${error.message}`)
    }
  } finally {
    if (showLoading) {
      loading.value = false;
    }
  }
}

// Iniciar polling
const startPolling = () => {
  stopPolling() // Limpiar cualquier polling existente
  
  pollingTimer = setInterval(async () => {
    await loadOrders(false, true)
  }, POLLING_INTERVAL)
}

// Detener polling
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

const handleOrderSelected = (order: Order) => {
  selectedOrder.value = order
  showDetailView.value = true
}

const handleOrderDeselected = () => {
  selectedOrder.value = null
  showDetailView.value = false
}

const handleBackToList = () => {
  showDetailView.value = false
  selectedOrder.value = null
}

// Manejar actualización de orden (desde AssignmentForm)
const handleOrderUpdated = async () => {
  // Recargar inmediatamente después de una actualización manual
  await loadOrders(false, false)
}

// Detectar cuando se abre/cierra un modal
const handleModalStateChange = (isOpen: boolean) => {
  isModalOpen.value = isOpen
}

// Detectar cuando el usuario está interactuando con selects u otros inputs
const handleInteractionStateChange = (isActive: boolean) => {
  isInteracting.value = isActive
}

// Watch para detectar cambio de pestañas y limpiar selección
watch(activeTab, () => {
  showDetailView.value = false
  selectedOrder.value = null
})

// Cargar órdenes al montar e iniciar polling
onMounted(async () => {
  await loadOrders()
  startPolling()
})

// Limpiar polling al desmontar
onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <main>
    <header>
      <h1 class="text-title">Control de servicios y asignaciones</h1>
    </header>

    <!-- Switch para cambiar entre pestañas -->
    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Pendientes</div>
      <div class="toggle-button" @click="activeTab = 'right'">En progreso</div>
    </div>

    <!-- Loading global -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Servicios pendientes -->
    <section class="orders-section" v-else-if="activeTab === 'left'">
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="Pendientes"
              :orders="pendingOrders"
              :availableFilters="[
                { value: 'recent', label: 'Fecha más reciente' },
                { value: 'oldest', label: 'Fecha más antigua' },
                { value: 'pending', label: 'Pendiente de asignar'},
                { value: 'assigned', label: 'Asignado en espera' },
              ]"
              @order-selected="handleOrderSelected"
              @order-deselected="handleOrderDeselected"
            />
        </div>
        <!-- Detalles - se muestra en móvil cuando hay una orden seleccionada -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <AssigmentForm 
              :selectedOrder="selectedOrder" 
              @back-to-list="handleBackToList"
              @order-assigned="handleOrderUpdated"
              @modal-state-change="handleModalStateChange"
              @interaction-state-change="handleInteractionStateChange"
            />
        </div>
    </section>

    <!-- Servicios en progreso -->
    <section class="orders-section" v-else>
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="En progreso"
              :orders="inProgressOrders"
              :availableFilters="[
                { value: 'pickup', label: 'En camino a recoger' },
                { value: 'collected', label: 'Carga recogida' },
                { value: 'delivered', label: 'Completado' }
              ]"
              @order-selected="handleOrderSelected"
              @order-deselected="handleOrderDeselected"
            />
        </div>
        <!-- Detalles - se muestra en móvil cuando hay una orden seleccionada -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <OrderTracking 
              :selectedOrder="selectedOrder" 
              @back-to-list="handleBackToList"
              @modal-state-change="handleModalStateChange"
            />
        </div>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
  position: relative;
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
}

.toggle-wrapper {
  display: flex;
  background-color: var(--neutral-gray-200);
  border-radius: 10px;
  position: relative;
  width: 18.75rem;
  height: 3.75rem;
  padding: 0.375rem;
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-indicator {
  position: absolute;
  top: 0.375rem;
  left: 0.375rem;
  width: calc(50% - 0.375rem);
  height: calc(100% - 0.75rem);
  background-color: var(--neutral-white);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 3rem;
  cursor: pointer;
  z-index: 1;
  user-select: none;
}

.active-left .toggle-indicator {
  left: 0.375rem;
}

.active-right .toggle-indicator {
  left: 50%;
}

.orders-section {
  width: 100%;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  height: calc(100vh - 15.625rem);
  background-color: var(--neutral-white);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.orders-section .list {
  overflow-y: auto;
}

.orders-section .details {
  display: block;
  overflow-y: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-general);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid var(--border-light);
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

@media (max-width: 770px) {
  .orders-section {
    grid-template-columns: 1fr;
  }

  .orders-section .details {
    display: none;
  }

  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }
  
  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-content {
    text-align: center;
  }

  .text-title {
    margin-left: 3.125rem;
    font-size: 1.5rem;
  }

  .toggle-wrapper {
    width: 15.625rem;
    height: 3.125rem;
    font-size: 0.9rem;
    align-items: center;
  }

  .orders-section .list.mobile-hidden {
    display: none;
  }

  .orders-section .details.mobile-shown {
    display: block;
  }

  .orders-section .details {
    display: none;
  }
}
</style>