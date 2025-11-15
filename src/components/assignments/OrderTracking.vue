<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { changeOrderStatus, getOrderById, getOrderToken } from '@/services/orderService'
import OrderSteps from './OrderSteps.vue'
import ShippingInformation from './ShippingInformation.vue'
import FormResponseModal from './FormResponseModal.vue'
import type { Order } from '@/types/order'

const props = defineProps<{
  selectedOrder: Order | null
}>()

const emit = defineEmits<{
  (e: 'back-to-list'): void
  (e: 'modal-state-change', isOpen: boolean): void
}>()

// Estado de la orden
const orderDetails = ref<Order | null>(null)
const loading = ref(false)

// Estado para el modal de respuestas
const showFormResponsesModal = ref(false)
const formResponseModal = ref<InstanceType<typeof FormResponseModal> | null>(null)

// Obtener detalles de la orden por ID usando el servicio
const getOrderDetails = async (orderId: number) => {
  if (!orderId) return
  
  loading.value = true
  try {
    const data = await getOrderById(orderId)
    orderDetails.value = data
  } catch (error) {
    console.error("Error obteniendo detalles de la orden:", error)
    toast.error("Error al cargar detalles de la orden")
  } finally {
    loading.value = false
  }
}

// Función para copiar el link de tracking
const copyTrackingLink = async () => {
  if (!orderDetails.value) {
    toast.error("No hay orden seleccionada")
    return
  }

  if (!orderDetails.value || orderDetails.value.id === undefined) {
    toast.error("No hay orden seleccionada o el ID de la orden es inválido.")
    return
  }

  try {
    // Obtener el token y crear el link
    const token = await getOrderToken(orderDetails.value.id as number)
    const trackingUrl = `${window.location.origin}/tracking?token=${token}`
    
    // Copiar al portapapeles
    await navigator.clipboard.writeText(trackingUrl)
    
    toast.success("Link de rastreo copiado al portapapeles", {
      position: "top-right",
      autoClose: 3000
    })
  } catch (error) {
    console.error("Error copiando al portapapeles:", error)
    toast.error("Error al copiar el link")
  }
}

// Función para mostrar las respuestas del formulario
const showFormResponses = async () => {
  if (orderDetails.value?.submissionId) {
    showFormResponsesModal.value = true
    emit('modal-state-change', true)
    await formResponseModal.value?.openModal(orderDetails.value.submissionId)
  } else {
    toast.error("Esta orden no tiene un formulario asociado")
  }
}

// Función para cancelar orden en progreso
const cancelOrder = async () => {
  if (orderDetails.value?.id) {
    await changeOrderStatus(orderDetails.value.id, 'pending')
  } else {
    toast.error("No es posible cancelar esta orden")
  }
}

// Función para cerrar el modal
const closeFormResponsesModal = () => {
  showFormResponsesModal.value = false
  emit('modal-state-change', false)
}

// Manejar la actualización de la orden desde ShippingInformation
const handleOrderUpdated = (updatedOrder: Order) => {
  orderDetails.value = { ...updatedOrder }
}

// Manejar cambio de estado del modal desde ShippingInformation
const handleModalStateChange = (isOpen: boolean) => {
  emit('modal-state-change', isOpen)
}

// Watch para cambios en la orden seleccionada
watch(() => props.selectedOrder, (newOrder) => {
  if (newOrder && newOrder.id !== undefined) {
    getOrderDetails(newOrder.id)
  } else {
    orderDetails.value = null
  }
}, { immediate: true })

// Emitir regreso a la lista
const handleBackToList = () => {
  emit('back-to-list')
}
</script>

<template>
  <section class="tracking-container">
    <section v-if="!props.selectedOrder" class="no-selection">
      <div class="no-selection-content">
          <span class="material-symbols-outlined md-icon">description</span>
          <p>Selecciona una orden para ver estado y detalles</p>
      </div>
    </section>

    <div v-else-if="loading" class="loading-state">
      <p>Cargando detalles de la orden...</p>
    </div>

    <div v-else-if="orderDetails">
      <!-- Encabezado -->
      <header>
        <!-- Botón de regresar solo en móvil -->
        <button class="back-btn mobile-only" @click="handleBackToList">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="header-information">
          <h2>Estado actual</h2>
          <p class="steps-info">
            1 - En camino a recoger la carga<br />
            2 - Carga recogida<br />
            3 - Servicio completado
          </p>
        </div>

        <div class="header-buttons">
          <button class="action-btn" @click="cancelOrder" title="Cancelar orden en progreso">
            <span class="material-symbols-outlined">cancel</span>
          </button>
          <button class="action-btn" @click="copyTrackingLink" title="Copiar link de rastreo">
            <span class="material-symbols-outlined">link</span>
          </button>
          <button class="action-btn" @click="showFormResponses" title="Ver formulario">
            <span class="material-symbols-outlined">folder_eye</span>
          </button>
        </div>
      </header>

      <!-- Etapas del tracking -->
      <OrderSteps :orderStatus="orderDetails.status" />

      <!-- Información de envío -->
      <ShippingInformation 
        :orderData="orderDetails" 
        :editable="false" 
        mode="tracking"
        @orderUpdated="handleOrderUpdated"
        @modal-state-change="handleModalStateChange"
      />
      <br/>
    </div>

    <!-- Modal de respuestas del formulario -->
    <FormResponseModal
      ref="formResponseModal"
      :show="showFormResponsesModal"
      @close="closeFormResponsesModal"
    />
  </section>
</template>

<style scoped>
.tracking-container {
  padding: 2rem;
  background-color: var(--neutral-white);
  border-radius: 10px;
  height: 100%;
  position: relative;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--neutral-gray-600);
  font-size: clamp(0.9rem, 1.8vw, 1rem);
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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

header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.back-btn {
  position: absolute; 
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  display: none;
  z-index: 1;
  padding: 0rem;
}

.back-btn:hover {
  color: var(--principal-primary-hover);
}

.mobile-only {
  display: none;
}

.header-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.6rem;
  cursor: pointer;
  font-size: clamp(1.1rem, 2.2vw, 1.2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  width: 55px;
  color: var(--principal-primary);
  border: 1px solid var(--principal-primary);
  border-radius: 10px;
  background-color: var(--neutral-white);
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--principal-primary-50);
}

.action-btn:active {
  transform: scale(0.95);
}

header h2 {
  font-weight: 600;
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
}

.steps-info {
  font-size: clamp(0.8rem, 1.6vw, 0.9rem);
  color: var(--neutral-gray-600);
  margin-top: 0.5rem;
  line-height: 1.4;
}

@media (max-width: 770px) {
  .tracking-container {
    padding: 1.5rem;
    background-color: var(--neutral-white);
  }

  .mobile-only {
    display: block;
  }

  .header-information {
    margin-top: 2.5rem;
  }

  .header-buttons {
    flex-direction: column;
  }
}
</style>
