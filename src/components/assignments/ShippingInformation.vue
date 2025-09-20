<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { updateOrder } from '@/services/orderService'
import { getUsers } from '@/services/userService'
import { getVehicles } from '@/services/vehicleService'
import OrderForm from './OrderForm.vue'
import type { Order, UpdateOrderPayload } from '@/types/order'
import type { User } from '@/types/user'
import type { Vehicle } from '@/types/vehicle'

const props = defineProps<{
  editable?: boolean
  orderData?: Partial<Order>
  mode?: 'assignment' | 'tracking'
}>()

// Emit para comunicar cambios al componente padre
const emit = defineEmits(['orderUpdated'])
const showModal = ref(false)
const localOrderData = ref<Partial<Order> | null>(null)

// Estados para conductores y vehículos
const users = ref<User[]>([])
const vehicles = ref<Vehicle[]>([])
const loadingUserData = ref(false)

// Watch para actualizar localOrderData cuando cambie orderData
watch(() => props.orderData, (newOrderData) => {
  if (newOrderData) {
    localOrderData.value = { ...newOrderData }
  } else {
    localOrderData.value = null
  }
}, { immediate: true, deep: true })

// Cargar usuarios y vehículos
const loadUsersAndVehicles = async () => {
  if (props.mode === 'assignment') return // No cargar en modo asignación

  loadingUserData.value = true
  try {
    const [usersData, vehiclesData] = await Promise.all([
      getUsers(),
      getVehicles()
    ])
    users.value = usersData
    vehicles.value = vehiclesData
  } catch (error) {
    console.error('Error cargando usuarios y vehículos:', error)
  } finally {
    loadingUserData.value = false
  }
}

// Computed para obtener información del conductor
const driverInfo = computed(() => {
  if (!currentOrderData.value?.userId || !users.value.length) {
    return 'No especificado'
  }
  
  const driver = users.value.find(user => user.id === currentOrderData.value?.userId)
  return driver ? `${driver.name} ${driver.lastName}` : 'No encontrado'
})

// Computed para obtener información del vehículo
const vehicleInfo = computed(() => {
  if (!currentOrderData.value?.vehicleId || !vehicles.value.length) {
    return 'No especificado'
  }
  
  const vehicle = vehicles.value.find(v => v.id === currentOrderData.value?.vehicleId)
  return vehicle ? `${vehicle.brand} - ${vehicle.licensePlate}` : 'No encontrado'
})

// Modals
const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Función para manejar la actualización de la orden
const handleOrderSubmit = async (payload: UpdateOrderPayload) => {
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
const cargoTypeMap: Record<string, string> = {
  move: 'Mudanza',
  cargo: 'Flete',
  corporate: 'Empresarial'
}

// Función para obtener el tipo de carga en español
const getCargoTypeInSpanish = (type: string) => {
  return cargoTypeMap[type] || 'No especificado'
}

// Función para formatear el precio
const formatPrice = (amount: any) => {
  if (!amount) return 'Q 0.00'
  return `Q ${parseFloat(amount).toFixed(2)}`
}

// Obtener los datos de la orden por ID
const currentOrderData = computed(() => localOrderData.value)

// Determinar si debe mostrar información de conductor y vehículo
const showDriverAndVehicleInfo = computed(() => props.mode === 'tracking')

// Cargar datos al montar el componente
onMounted(() => {
  if (props.mode === 'tracking') {
    loadUsersAndVehicles()
  }
})
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
        <!-- Información de conductor y vehículo - Solo en modo tracking -->
        <template v-if="showDriverAndVehicleInfo">
          <div class="info-item">
            <label>Conductor</label>
            <p v-if="loadingUserData">Cargando...</p>
            <p v-else>{{ driverInfo }}</p>
          </div>
          <div class="info-item">
            <label>Vehículo</label>
            <p v-if="loadingUserData">Cargando...</p>
            <p v-else><strong>{{ vehicleInfo }}</strong></p>
          </div>
        </template>

        <!-- Información común para ambos modos -->
        <div class="info-item">
          <label>Precio</label>
          <p>{{ formatPrice(currentOrderData.totalAmount) }}</p>
        </div>
        <div class="info-item">
          <label>Tipo de servicio</label>
          <p><strong>{{ getCargoTypeInSpanish(currentOrderData.type) }}</strong></p>
        </div>
        <div class="info-item">
          <label>De aquí</label>
          <p><strong>{{ currentOrderData.origin || 'No especificado' }}</strong></p>
        </div>
        <div class="info-item">
          <label>Para allá</label>
          <p><strong>{{ currentOrderData.destination || 'No especificado' }}</strong></p>
        </div>
        <div class="info-item full-width">
          <label>Observaciones</label>
          <p><strong>{{ currentOrderData.details || 'Sin observaciones adicionales' }}</strong></p>
        </div>
      </template>
    </div>
  </section>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article class="modal-content">
      <header class="modal-header">
        <h3>Editar Orden</h3>
        <button class="close-btn" @click="closeModal">
          <span class="material-symbols-outlined md-icon">close</span>
        </button>
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
  border: 1px solid var(--border-base);
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
  color: var(--neutral-gray-600);
  padding: 2rem;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
}

.info-item label {
  font-size: clamp(0.8rem, 1.6vw, 0.9rem);
  color: var(--neutral-gray-600);
}

.info-item p {
  margin: 0;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
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
  font-size: clamp(1.1rem, 2vw, 1.2rem);
}

.info-action:hover {
  color: var(--principal-primary-hover);
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
  background: var(--neutral-white);
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
  border-bottom: 1px solid var(--border-light);
}

article header h3 {
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
}

.close-btn {
  background: none;
  border: none;
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  color: var(--close-btn);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--close-btn-hover);
}
</style>