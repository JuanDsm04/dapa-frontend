<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { updateOrder } from '@/services/orderService'
import OrderForm from './OrderForm.vue'

const props = defineProps<{
  editable?: boolean
  orderData?: object | null
}>()

// Emit para comunicar cambios al componente padre
const emit = defineEmits(['orderUpdated'])
const showModal = ref(false)
const localOrderData = ref(null)

// Watch para actualizar localOrderData cuando cambie orderData
watch(() => props.orderData, (newOrderData) => {
  if (newOrderData) {
    localOrderData.value = { ...newOrderData }
  } else {
    localOrderData.value = null
  }
}, { immediate: true, deep: true })


// Modals
const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Función para manejar la actualización de la orden
const handleOrderSubmit = async (payload) => {
  try {
    if (!props.orderData?.id) {
      throw new Error("No se encontró el ID de la orden")
    }

    const data = await updateOrder(props.orderData.id, payload)

    const updatedOrderData = {
      ...localOrderData.value,
      ...payload,
      ...(data.id ? data : {})
    }

    // Actualizar los datos locales
    localOrderData.value = updatedOrderData
    
    toast.success("Orden actualizada correctamente")
    
    // Cerrar el modal
    closeModal()
    
    // Emitir evento al componente padre con los datos actualizados
    emit('orderUpdated', updatedOrderData)
    
  } catch (error) {
    const err = error as Error
    console.error('Error al actualizar orden:', err)
    toast.error(`Error: ${err.message}`)
  }
}

// Mapeo de tipos de carga
const cargoTypeMap = {
  business: 'Negocio',
  personal: 'Personal', 
  corporate: 'Empresarial'
}

// Función para obtener el tipo de carga en español
const getCargoTypeInSpanish = (type) => {
  return cargoTypeMap[type] || 'No especificado'
}

// Función para formatear el precio
const formatPrice = (amount) => {
  if (!amount) return 'Q 0.00'
  return `Q ${parseFloat(amount).toFixed(2)}`
}

// Obtener los datos de la orden por ID
const currentOrderData = computed(() => localOrderData.value)
</script>

<template>
  <section class="shipment-info">
    <div class="info-box">
      <!-- Botón de acción solo si es editable -->
      <button v-if="props.editable && currentOrderData" class="info-action" @click="openModal">
        <span class="material-symbols-outlined">edit</span>
      </button>

      <div v-if="!currentOrderData" class="no-data">
        <p>No hay información de orden disponible</p>
      </div>

      <template v-else>
        <div class="info-item">
          <label>Precio</label>
          <p>{{ formatPrice(currentOrderData.totalAmount) }}</p>
        </div>
        <div class="info-item">
          <label>Tipo de carga</label>
          <p><strong>{{ getCargoTypeInSpanish(currentOrderData.type) }}</strong></p>
        </div>
        <div class="info-item">
          <label>Origen</label>
          <p><strong>{{ currentOrderData.origin || 'No especificado' }}</strong></p>
        </div>
        <div class="info-item">
          <label>Destino</label>
          <p><strong>{{ currentOrderData.destination || 'No especificado' }}</strong></p>
        </div>
        <div class="info-item full-width">
          <label>Detalles</label>
          <p><strong>{{ currentOrderData.details || 'Sin detalles adicionales' }}</strong></p>
        </div>
      </template>
    </div>
  </section>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article class="modal-content">
      <header class="modal-header">
        <h3>Editar Orden</h3>
        <button class="close-btn" @click="closeModal">✕</button>
      </header>

      <section>
        <OrderForm 
          :isEdit="true" 
          :orderData="localOrderData" 
          @submit="handleOrderSubmit"
        />
      </section>
    </article>
  </div>
</template>

<style scoped>
.shipment-info {
  margin-bottom: 2rem;
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem 1.5rem;
  position: relative;
}

.no-data {
  grid-column: span 2;
  text-align: center;
  color: #666;
  padding: 2rem;
}

.info-item label {
  font-size: 0.9rem;
  color: #666;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-action {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.info-action:hover {
  color: #2f67f6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--modal-bg);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input);
}

article header h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--close-btn);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--close-btn-hover);
}
</style>