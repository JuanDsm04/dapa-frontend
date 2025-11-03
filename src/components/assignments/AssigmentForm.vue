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
import FormResponseModal from './FormResponseModal.vue'

const props = defineProps<{
  selectedOrder: Order | null
}>()

// Emit para regresar a la lista y notificar estados
const emit = defineEmits<{
  (e: 'back-to-list'): void
  (e: 'order-assigned'): void
  (e: 'modal-state-change', isOpen: boolean): void
  (e: 'interaction-state-change', isActive: boolean): void
}>()

// Estado interno
const selectedDriver = ref<string>('')
const selectedVehicle = ref<string>('')
const selectedHelper = ref<string>('')
const showModal = ref(false)
const showFormResponsesModal = ref(false)
const orderDetails = ref<Order | null>(null)
const drivers = ref<User[]>([])
const vehicles = ref<Vehicle[]>([])
const helpers = ref<User[]>([])
const loading = ref(false)

// Referencia al modal de respuestas
const formResponseModal = ref<InstanceType<typeof FormResponseModal> | null>(null)

// Obtener detalles de la orden por ID usando el servicio
const getOrderDetails = async (orderId: number | undefined) => {
  if (!orderId) return

  loading.value = true
  try {
    const data = await getOrderById(orderId)
    orderDetails.value = data

    selectedDriver.value = data.userId ? String(data.userId) : ''
    selectedVehicle.value = data.vehicleId ? String(data.vehicleId) : ''
    selectedHelper.value = data.helperId ? String(data.helperId) : ''

  } catch (error) {
    console.error("Error obteniendo observaciones de la orden:", error)
    toast.error("Error al cargar observaciones de la orden")
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

// Obtener ayudantes disponibles
const getHelpers = async () => {
  try {
    const data = await getUsers()
    helpers.value = data.filter(user => user.role === 'helper')
  } catch (error) {
    console.error("Error obteniendo ayudantes:", error)
    toast.error("Error al cargar ayudantes")
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

// Función para cerrar el modal de respuestas
const closeFormResponsesModal = () => {
  showFormResponsesModal.value = false
  emit('modal-state-change', false)
}

// Asignar orden a conductor y vehículo
const assignOrderToDriver = async () => {
  if (!orderDetails.value || orderDetails.value.id === undefined || !selectedDriver.value || !selectedVehicle.value) {
    toast.error("Selecciona un conductor y un vehículo, y asegúrate de que la orden tenga un ID válido.")
    return
  }

  try {
    await assignOrder(
      orderDetails.value.id as number,
      parseInt(selectedDriver.value),
      parseInt(selectedVehicle.value),
      parseInt(selectedHelper.value)
    )

    toast.success("Orden asignada exitosamente")
    showModal.value = false
    emit('modal-state-change', false)
    
    // Emitir evento de asignación exitosa
    emit('order-assigned')

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
  // Emitir para que se recargue la lista
  emit('order-assigned')
}

// Manejar cuando se abre el modal de confirmación
const openConfirmModal = () => {
  showModal.value = true
  emit('modal-state-change', true)
}

// Manejar cuando se cierra el modal de confirmación
const closeConfirmModal = () => {
  showModal.value = false
  emit('modal-state-change', false)
}

// Detectar cuando el usuario empieza a interactuar con los selects
const handleSelectFocus = () => {
  emit('interaction-state-change', true)
}

// Detectar cuando el usuario termina de interactuar con los selects
const handleSelectBlur = () => {
  emit('interaction-state-change', false)
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
  getHelpers()
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
        <button class="form-btn" @click="showFormResponses">
          <span class="material-symbols-outlined">folder_eye</span>
        </button>
        <button 
          class="assign-btn" 
          @click="openConfirmModal"
          :disabled="!selectedDriver || !selectedVehicle || !selectedHelper"
        >
          <span class="material-symbols-outlined">check</span>
          Asignar
        </button>
      </div>
    </header>
    
    <section v-if="!props.selectedOrder" class="no-selection">
      <div class="no-selection-content">
          <span class="material-symbols-outlined md-icon">description</span>
          <p>Selecciona una orden para ver los detalles y realizar la asignación</p>
      </div>
    </section>

    <div v-else-if="loading" class="loading-state">
      <p>Cargando detalles de la orden...</p>
    </div>

    <div v-else-if="orderDetails">
      <!-- Formulario de asignación -->
      <div class="form-section">
        <div class="field-group">
          <div class="form-field">
            <label for="driver">Elegir conductor</label>
            <select 
              id="driver" 
              v-model="selectedDriver"
              @focus="handleSelectFocus"
              @blur="handleSelectBlur"
            >
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
            <select 
              id="vehicle" 
              v-model="selectedVehicle"
              @focus="handleSelectFocus"
              @blur="handleSelectBlur"
            >
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

          <div class="form-field">
            <label for="helper">Elegir ayudante</label>
            <select 
              id="helper" 
              v-model="selectedHelper"
              @focus="handleSelectFocus"
              @blur="handleSelectBlur"
            >
              <option disabled value="">Selecciona un ayudante</option>
              <option 
                v-for="helper in helpers" 
                :key="helper.id" 
                :value="helper.id"
              >
                {{ helper.name }} {{ helper.lastName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Información de envío -->
      <ShippingInformation 
        :orderData="orderDetails" 
        :editable="true" 
        mode="assignment"
        @orderUpdated="handleOrderUpdated"
      />
      <br/>
    </div>

    <!-- Modal de respuestas del formulario -->
    <FormResponseModal
      ref="formResponseModal"
      :show="showFormResponsesModal"
      @close="closeFormResponsesModal"
    />

    <!-- Confirmar asignación -->
    <NotificationModal
      v-if="showModal"
      :show="showModal"
      title="¿Estás seguro de hacer la asignación?"
      message="Recuerda tomar en cuenta la disponibilidad tanto del conductor como del vehículo."
      confirmText="Asignar"
      cancelText="Cerrar"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.assignment-form {
  padding: 2rem;
  background-color: var(--neutral-white);
  border-radius: 10px;
  max-width: 100%;
  height: 100%;
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
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  display: none;
  padding: 0.5rem;
}

.back-btn:hover {
  color: var(--principal-primary-hover);
}

.mobile-only {
  display: none;
}

header h2 {
  font-weight: 600;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-btn {
  padding: 0.6rem;
  cursor: pointer;
  font-size: clamp(1rem, 2vw, 1.2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  color: var(--principal-primary);
  border: 1px solid var(--principal-primary);
  border-radius: 10px;
  background-color: var(--neutral-white);
}

.form-btn:hover {
  background-color: var(--neutral-gray-100);
}

.assign-btn {
  display: flex;
  align-items: center;
  justify-content: center; 
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: clamp(0.95rem, 2vw, 1rem);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  height: 55px;
}

.assign-btn:hover:not(:disabled) {
  background-color: var(--principal-primary-hover);
}

.assign-btn:disabled {
  background-color: var(--neutral-gray-200);
  cursor: not-allowed;
}

.assign-btn span {
  margin-right: 5px;
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
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

.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--neutral-gray-500);
  font-size: clamp(0.9rem, 2vw, 1rem);
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
  font-size: clamp(0.9rem, 1.8vw, 1rem);
}

select,
textarea {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--neutral-gray-300);
  font-size: clamp(0.95rem, 1.8vw, 1rem);
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