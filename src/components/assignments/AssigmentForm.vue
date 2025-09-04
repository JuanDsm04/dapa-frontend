<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getOrderById, assignOrder } from '@/services/orderService'
import { getUsers } from '@/services/userService'
import { getVehicles } from '@/services/vehicleService'
import type { User } from '@/types/user'
import type { Vehicle } from '@/types/vehicle'
import type { Order } from '@/types/order'
import ShippingInformation from '../assignments/ShippingInformation.vue'
import NotificationModal from '../NotificationModal.vue'

const props = defineProps<{
  selectedOrder: Order | null
}>()

// Emit para regresar a la lista
const emit = defineEmits<{
  (e: 'back-to-list'): void
}>()

// Estado interno
const selectedDriver = ref<string>('')
const selectedVehicle = ref<string>('')
const showModal = ref(false)
const orderDetails = ref<Order | null>(null)
const drivers = ref<User[]>([])
const vehicles = ref<Vehicle[]>([])
const loading = ref(false)

// Obtener detalles de la orden por ID usando el servicio
const getOrderDetails = async (orderId: number | undefined) => {
  if (!orderId) return

  loading.value = true
  try {
    const data = await getOrderById(orderId)
    orderDetails.value = data

    selectedDriver.value = data.userId ? String(data.userId) : ''
    selectedVehicle.value = data.vehicleId ? String(data.vehicleId) : ''

  } catch (error) {
    console.error("Error obteniendo detalles de la orden:", error)
    toast.error("Error al cargar detalles de la orden")
  } finally {
    loading.value = false
  }
}

// Obtener conductores disponibles
const getDrivers = async () => {
  try {
    const data = await getUsers()
    drivers.value = data.filter(user => user.role === 'driver')
  } catch (error) {
    console.error("Error obteniendo conductores:", error)
    toast.error("Error al cargar conductores")
  }
}

// Obtener vehículos
const getVehiclesData = async () => {
  try {
    const data = await getVehicles()
    vehicles.value = data
  } catch (error) {
    console.error("Error obteniendo vehículos:", error)
    toast.error("Error al cargar vehículos")
  }
}

// Asignar orden a conductor y vehículo
const assignOrderToDriver = async () => {
  if (!orderDetails.value || !selectedDriver.value || !selectedVehicle.value) {
    toast.error("Selecciona un conductor y un vehículo")
    return
  }

  try {
    await assignOrder(
      orderDetails.value.id,
      parseInt(selectedDriver.value),
      parseInt(selectedVehicle.value)
    )

    toast.success("Orden asignada exitosamente")
    showModal.value = false

  } catch (error) {
    console.error("Error asignando orden:", error)
    toast.error("Error al asignar la orden")
  }
}

const handleConfirm = () => {
  assignOrderToDriver()
}

const handleBackToList = () => {
  emit('back-to-list')
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

// Obtener datos al montar el componente
onMounted(() => {
  getDrivers()
  getVehiclesData()
})
</script>

<template>
  <div class="assignment-form">
    <!-- Encabezado -->
    <header>
      <!-- Botón de regresar solo en móvil -->
      <button class="back-btn mobile-only" @click="handleBackToList">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h2>Asignación</h2>
      <div class="header-actions" v-if="orderDetails">
        <button class="form-btn">
          <span class="material-symbols-outlined">attach_file</span>
        </button>
        <button 
          class="assign-btn" 
          @click="showModal = true"
          :disabled="!selectedDriver || !selectedVehicle"
        >
          <span class="material-symbols-outlined">check</span>
          Asignar
        </button>
      </div>
    </header>

    <div v-if="!props.selectedOrder" class="no-selection">
      <p>Selecciona una orden para ver los detalles y realizar la asignación</p>
    </div>

    <div v-else-if="loading" class="loading-state">
      <p>Cargando detalles de la orden...</p>
    </div>

    <div v-else-if="orderDetails">
      <!-- Formulario de asignación -->
      <div class="form-section">
        <div class="field-group">
          <div class="form-field">
            <label for="driver">Elegir conductor</label>
            <select id="driver" v-model="selectedDriver">
              <option disabled value="">Selecciona un conductor</option>
              <option 
                v-for="driver in drivers" 
                :key="driver.id" 
                :value="driver.id"
              >
                {{ driver.name }} {{ driver.lastName }}
              </option>
            </select>
          </div>

          <div class="form-field">
            <label for="vehicle">Elegir vehículo</label>
            <select id="vehicle" v-model="selectedVehicle">
              <option disabled value="">Selecciona un vehículo</option>
              <option 
                v-for="vehicle in vehicles" 
                :key="vehicle.id" 
                :value="vehicle.id"
              >
                {{ vehicle.brand }} - {{ vehicle.licensePlate }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Información de envío - ACTUALIZADO: Agregado el listener -->
      <ShippingInformation 
        :orderData="orderDetails" 
        :editable="true" 
        @orderUpdated="handleOrderUpdated"
      />
    </div>

    <!-- Confirmar asignación -->
    <NotificationModal
      v-if="showModal"
      :show="showModal"
      title="¿Estás seguro de hacer la asignación?"
      message="Recuerda tomar en cuenta la disponibilidad tanto del conductor como del vehículo."
      confirmText="Asignar"
      cancelText="Cerrar"
      @close="showModal = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.assignment-form {
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  max-width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: none;
  padding: 0.5rem;
}

.back-btn:hover {
  color: #2f67f6;
}

.mobile-only {
  display: none;
}

header h2 {
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.assign-btn {
  display: flex;
  align-items: center;
  justify-content: center; 
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  height: 55px;
}

.assign-btn:hover:not(:disabled) {
  background-color: #235dda;
}

.assign-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.assign-btn span {
  margin-right: 5px;
}

.no-selection, .loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

select,
textarea {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: none;
}

textarea {
  min-height: 100px;
}

@media (max-width: 770px) {

  .assignment-form {
    padding: 1.5rem;
  }

  .field-group {
    flex-direction: column;
  }

  .mobile-only {
    display: block;
  }

  header h2 {
    display: none;
  }
}
</style>