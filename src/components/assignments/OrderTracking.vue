<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getOrderById } from '@/services/orderService'
import OrderSteps from './OrderSteps.vue'
import ShippingInformation from './ShippingInformation.vue'
import type { Order } from '@/types/order'

const props = defineProps<{
  selectedOrder: Order | null
}>()

const emit = defineEmits<{
  (e: 'back-to-list'): void
}>()

// Estado de la orden
const orderDetails = ref<Order | null>(null)
const loading = ref(false)

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

// Manejar la actualización de la orden desde ShippingInformation
const handleOrderUpdated = (updatedOrder: Order) => {
  orderDetails.value = { ...updatedOrder }
}

// Watch para cambios en la orden seleccionada
watch(() => props.selectedOrder, (newOrder) => {
  if (newOrder) {
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
    <div v-if="!props.selectedOrder" class="no-selection">
      <p>Selecciona una orden para ver el estado y detalles</p>
    </div>

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
            3 - Envío completado
          </p>
        </div>

        <div class="header-button">
           <button class="form-btn">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
        </div>
      </header>

      <!-- Etapas del tracking -->
      <OrderSteps :orderStatus="orderDetails.status" />

      <!-- Información de envío -->
      <ShippingInformation 
        :orderData="orderDetails" 
        :editable="false" 
        @orderUpdated="handleOrderUpdated"
      />
    </div>
  </section>
</template>

<style scoped>
.tracking-container {
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
}

.no-selection, .loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
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
  font-size: 1.5rem;
  display: none;
  z-index: 1;
  padding: 0rem;
}

.back-btn:hover {
  color: #235dda;
}

.mobile-only {
  display: none;
}

.form-btn {
  padding: 0.6rem;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  color: #235dda;
  border: 1px solid #235dda;
  border-radius: 10px;
  background-color: white;
}

.form-btn:hover {
  background-color: #f9f9fc;
}

header h2 {
  font-weight: 600;
}

.steps-info {
  font-size: 0.9rem;
  color: #444;
  margin-top: 0.5rem;
  line-height: 1.4;
}

@media (max-width: 770px) {
  .tracking-container {
    padding: 1.5rem;
    background-color: #fff;
  }

  .mobile-only {
    display: block;
  }

  .header-information {
    margin-top: 2.5rem;
  }
}
</style>