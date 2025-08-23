<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getOrderById } from '@/services/orderService'
import OrderSteps from './OrderSteps.vue'
import ShippingInformation from './ShippingInformation.vue'

const props = defineProps({
  selectedOrder: {
    type: Object,
    default: null
  }
})

const orderDetails = ref(null)
const loading = ref(false)

// Obtener detalles de la orden
const getOrderDetails = async (orderId) => {
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
const handleOrderUpdated = (updatedOrder) => {
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
</style>