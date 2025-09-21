<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DriverOrderCard from '@/components/drivers/DriverOrderCard.vue'
import DriverShippingInformation from '@/components/drivers/DriverShippingInformation.vue'
import FormResponseModal from '@/components/assignments/FormResponseModal.vue'
import { getOrders, updateOrder } from '@/services/orderService'
import type { Order } from '@/types/order'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Estados principales
const orders = ref<Order[]>([])
const loading = ref(false)
const selectedOrder = ref<Order | null>(null)
const showDetailView = ref(false)

// Estados para el modal de respuestas del formulario
const showFormResponsesModal = ref(false)
const formResponseModal = ref<InstanceType<typeof FormResponseModal> | null>(null)

// Computed para órdenes por completar (pickup, collected)
const ordersToComplete = computed(() => {
  return orders.value.filter(order => 
    ['pickup', 'collected'].includes(order.status)
  )
})

// Computed para otras órdenes asignadas (assigned)
const assignedOrders = computed(() => {
  return orders.value.filter(order => order.status === 'assigned')
})

// Verificar si el conductor tiene una orden activa
const hasActiveOrder = computed(() => {
  return orders.value.some(order => ['pickup', 'collected'].includes(order.status))
})

// Datos de prueba para desarrollo - REMOVER en producción
const getMockOrders = (): Order[] => {
  return [
    {
      id: 1001,
      type: 'cargo',
      status: 'assigned',
      date: '2024-01-15T10:30:00Z',
      origin: 'Zona 1, Guatemala',
      destination: 'Zona 10, Guatemala',
      totalAmount: 150.00,
      details: 'Entrega de muebles de oficina',
      submissionId: 101
    },
    {
      id: 1002,
      type: 'move',
      status: 'pickup',
      date: '2024-01-14T14:15:00Z',
      origin: 'Mixco, Guatemala',
      destination: 'Villa Nueva, Guatemala',
      totalAmount: 350.00,
      details: 'Mudanza completa de casa',
      submissionId: 102
    },
    {
      id: 1003,
      type: 'corporate',
      status: 'collected',
      date: '2024-01-16T08:45:00Z',
      origin: 'Zona 4, Guatemala',
      destination: 'Carretera a El Salvador',
      totalAmount: 500.00,
      details: 'Transporte de equipo empresarial'
      // Sin submissionId para probar el caso sin formulario
    }
  ] as Order[]
}

// Cargar todas las órdenes del conductor
const loadOrders = async () => {
  loading.value = true
  try {
    // OPCIÓN 1: Usar datos mock para desarrollo
    const allOrders = getMockOrders()
    
    // OPCIÓN 2: Usar la API real - comentado por ahora
    // const allOrders = await getOrders()
    
    // Verificar si allOrders es un array válido
    if (!Array.isArray(allOrders)) {
      console.error('getOrders() no devolvió un array:', allOrders)
      toast.error('Error: Los datos recibidos no tienen el formato correcto')
      orders.value = []
      return
    }
    
    // Filtrar solo las órdenes asignadas al conductor actual
    orders.value = allOrders.filter(order => 
      ['assigned', 'pickup', 'collected', 'delivered'].includes(order.status)
    )
    
  } catch (err) {
    const error = err as Error
    console.error('Error completo:', err)
    console.error('Error cargando órdenes:', error.message)
    
    // Fallback a datos mock en caso de error
    orders.value = getMockOrders()
    toast.warning('Usando datos de prueba')
    
  } finally {
    loading.value = false
  }
}

// Manejar selección de orden
const handleOrderSelected = (order: Order) => {
  selectedOrder.value = order
  showDetailView.value = true
}

// Manejar deselección de orden
const handleOrderDeselected = () => {
  selectedOrder.value = null
  showDetailView.value = false
}

// Manejar actualización de estado de la orden
const handleUpdateStatus = async (payload: { orderId: number, newStatus: string }) => {
  try {
    // Actualizar el estado de la orden
    await updateOrder(payload.orderId, { status: payload.newStatus })
    
    // Actualizar la orden en la lista local
    const orderIndex = orders.value.findIndex(o => o.id === payload.orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex] = { ...orders.value[orderIndex], status: payload.newStatus }
      
      // Actualizar también selectedOrder si es la misma
      if (selectedOrder.value && selectedOrder.value.id === payload.orderId) {
        selectedOrder.value = { ...selectedOrder.value, status: payload.newStatus }
      }
    }

    // Mostrar mensaje según el estado
    if (payload.newStatus === 'collected') {
      toast.success('¡Carga recogida correctamente!')
    } else if (payload.newStatus === 'delivered') {
      toast.success('¡Servicio completado exitosamente!')
      // Regresar a la lista después de completar
      setTimeout(() => {
        handleBackToList()
      }, 1500)
    }
    
  } catch (error) {
    const err = error as Error
    console.error('Error al actualizar estado:', err)
    toast.error(`Error al actualizar el estado: ${err.message}`)
  }
}

// Función para mostrar las respuestas del formulario
const handleShowFormResponses = async () => {
  if (selectedOrder.value?.submissionId) {
    showFormResponsesModal.value = true
    await formResponseModal.value?.openModal(selectedOrder.value.submissionId)
  } else {
    toast.error("Esta orden no tiene un formulario asociado")
  }
}

// Función para cerrar el modal
const closeFormResponsesModal = () => {
  showFormResponsesModal.value = false
}

// Manejar regreso a la lista
const handleBackToList = () => {
  showDetailView.value = false
  selectedOrder.value = null
}

// Manejar inicio de orden
const handleStartOrder = async (order: Order) => {
  try {
    // Verificar que no tenga otra orden activa
    if (hasActiveOrder.value) {
      toast.warning('Ya tienes una orden en progreso. Complétala antes de iniciar otra.')
      return
    }

    // Actualizar el estado de la orden a 'pickup'
    await updateOrder(order.id, { status: 'pickup' })
    
    // Actualizar la orden en la lista local
    const orderIndex = orders.value.findIndex(o => o.id === order.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex] = { ...orders.value[orderIndex], status: 'pickup' }
    }

    toast.success('¡Orden iniciada correctamente! Ahora puedes ver toda la información.')
    
    // Seleccionar automáticamente la orden iniciada
    selectedOrder.value = { ...order, status: 'pickup' }
    showDetailView.value = true
    
  } catch (error) {
    const err = error as Error
    console.error('Error al iniciar orden:', err)
    toast.error(`Error al iniciar la orden: ${err.message}`)
  }
}

// Cargar órdenes al montar
onMounted(async () => {
  await loadOrders()
})
</script>

<template>
  <main>
    <header>
      <h1 class="text-title">Servicios</h1>
    </header>

    <!-- Loading global -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <section v-else class="orders-section">
      <!-- Vista de lista (cuando no hay orden seleccionada) -->
      <div v-if="!showDetailView" class="orders-list-view">
        <!-- Servicios por completar -->
        <section>
          <h2>Servicios por completar</h2>
          
          <div v-if="ordersToComplete.length === 0" class="no-selection">
            <div class="no-selection-content">
              <span class="material-symbols-outlined md-icon">task_alt</span>
              <p>No tienes servicios por completar en este momento.</p>
            </div>
          </div>

          <div v-else class="order-cards-list">
            <DriverOrderCard
              v-for="order in ordersToComplete"
              :key="order.id"
              :order="order"
              :isSelected="false"
              :hasActiveOrder="false"
              @click="handleOrderSelected(order)"
              @start-order="handleStartOrder"
            />
          </div>
        </section>

        <!-- Otros servicios asignados -->
        <section>
          <h2>Otros servicios asignados</h2>
          
          <div v-if="assignedOrders.length === 0" class="no-selection">
            <div class="no-selection-content">
              <span class="material-symbols-outlined md-icon">assignment</span>
              <p>Por el momento no tienes servicios asignados.</p>
            </div>
          </div>

          <div v-else class="order-cards-list">
            <DriverOrderCard
              v-for="order in assignedOrders"
              :key="order.id"
              :order="order"
              :isSelected="false"
              :hasActiveOrder="hasActiveOrder"
              @click="handleOrderSelected(order)"
              @start-order="handleStartOrder"
            />
          </div>
        </section>
      </div>

      <!-- Vista de detalles (pantalla completa cuando se selecciona una orden) -->
      <div v-else class="order-detail-view">
        <DriverShippingInformation 
          :orderData="selectedOrder"
          :mode="selectedOrder?.status === 'assigned' ? 'censored' : 'visible'"
          @start-order="handleStartOrder"
          @back-to-list="handleBackToList"
          @update-status="handleUpdateStatus"
          @show-form-responses="handleShowFormResponses"
        />
      </div>
    </section>

    <!-- Modal de respuestas del formulario -->
    <FormResponseModal
      ref="formResponseModal"
      :show="showFormResponsesModal"
      @close="closeFormResponsesModal"
    />
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

h2 {
  font-weight: 600;
  font-size: clamp(1.1rem, 2.2vw, 1.3rem);
  margin-bottom: 1rem;
}

.orders-section {
  background-color: var(--neutral-white);
  width: 100%;
  padding: 2rem;
  border-radius: 10px;
  min-height: calc(100vh - 12rem);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Vista de lista de órdenes */
.orders-list-view {
  width: 100%;
}

.orders-list-view section:not(:first-child) {
  margin-top: 3rem;
}

/* Vista de detalles en pantalla completa */
.order-detail-view {
  width: 100%;
  height: 100%;
}

/* Estilos para estado sin selección */
.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-gray-300);
  border-radius: 10px;
  padding: 3rem 1rem;
  margin: 0.5rem 0;
  background-color: var(--neutral-white);
  min-height: 8rem;
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

.no-selection-content p {
  margin: 0;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
}

/* Lista de cards de órdenes */
.order-cards-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Loading */
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

@media (max-width: 770px) {
  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }

  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .orders-section {
    padding: 1.5rem;
  }

  .orders-list-view section:not(:first-child) {
    margin-top: 2rem;
  }

  .text-title {
    margin-left: 3.125rem; /* 50px → rem */
    font-size: 1.5rem;
  }
}
</style>