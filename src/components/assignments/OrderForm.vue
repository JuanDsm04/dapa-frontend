<script setup lang="ts">
import type { Order, FrontendCargoType, BackendCargoType } from '@/types/order';
import { ref, watch, onMounted, computed } from 'vue';

// Props
const props = defineProps<{
  isEdit?: boolean
  orderData?: Partial<Order> | null
  initialData?: Partial<Order> | null
}>()

// Emitir evento para volver al componente padre
const emit = defineEmits<{
  (e: 'volver'): void
  (e: 'submit', payload: Partial<Order>): void
  (e: 'update:modelValue', payload: Partial<Order>): void
}>()

const clientName = ref('')
const clientPhone = ref('')
const price = ref('')
const cargoType = ref<FrontendCargoType>('mudanza')
const origin = ref('')
const destination = ref('')
const meetingDate = ref('')
const meetingHour = ref('')
const details = ref('')
const hasUserEdited = ref(false)


const errors = ref<Record<string, string>>({})

// Mapeo de tipos de carga del backend al frontend
const cargoTypeBackendToFrontend: Record<BackendCargoType, FrontendCargoType> = {
  move: 'mudanza',
  cargo: 'flete',
  corporate: 'empresarial'
}

// Mapeo de tipos de carga del frontend al backend
const cargoTypeFrontendToBackend: Record<FrontendCargoType, BackendCargoType> = {
  mudanza: 'move',
  flete: 'cargo',
  empresarial: 'corporate'
}

// Tipo guard para BackendCargoType
const isBackendCargoType = (v: any): v is BackendCargoType => {
  return v === 'move' || v === 'cargo' || v === 'corporate'
}

// Computed para obtener el payload actual del formulario
const currentFormData = computed(() => ({
  clientName: clientName.value.trim(),
  clientPhone: clientPhone.value.trim(),
  totalAmount: parseFloat(price.value) || 0,
  type: cargoTypeFrontendToBackend[cargoType.value],
  origin: origin.value.trim(),
  destination: destination.value.trim(),
  meetingDate: meetingDate.value.trim(),
  details: details.value.trim()
}))

// Cargar datos si es edición o si hay initialData (borrador)
const loadOrderData = () => {
  // Prioridad: orderData (para edición) > initialData (borrador)
  const dataSource = props.orderData || props.initialData

  if (dataSource) {
    clientName.value = dataSource.clientName || ''
    clientPhone.value = dataSource.clientPhone || ''
    price.value = dataSource.totalAmount ? dataSource.totalAmount.toString() : ''

    if (isBackendCargoType(dataSource.type)) {
      cargoType.value = cargoTypeBackendToFrontend[dataSource.type]
    }

    origin.value = dataSource.origin || ''
    destination.value = dataSource.destination || ''
    if (dataSource.meetingDate) {
      const raw = dataSource.meetingDate;

      const [datePart, timePart] = raw.split("T");

      meetingDate.value = datePart; // YYYY-MM-DD

      if (timePart) {
        meetingHour.value = timePart.slice(0, 5); // HH:mm
        console.log("Extracted meetingHour:", meetingHour.value);
      }
    }

    details.value = dataSource.details || ''
  }
}

// Validar y preparar datos para envío
const handleSubmit = async () => {
  errors.value = {}

  // Validación del nombre del cliente
  if (!clientName.value.trim()) {
    errors.value.clientName = 'El nombre del cliente es requerido *'
  }

  // Validación del teléfono del cliente
  if (!clientPhone.value.trim()) {
    errors.value.clientPhone = 'El teléfono del cliente es requerido *'
  } else if (!/^[\d\s\-\+\(\)]+$/.test(clientPhone.value.trim())) {
    errors.value.clientPhone = 'El teléfono debe contener solo números y símbolos válidos *'
  }

  const numericPrice = parseFloat(price.value)
  if (!price.value.trim()) {
    errors.value.price = 'El precio es requerido *'
  } else if (isNaN(numericPrice)) {
    errors.value.price = 'El precio debe ser un número *'
  } else if (numericPrice < 0) {
    errors.value.price = 'El precio no puede ser negativo *'
  }

  if (!origin.value.trim()) {
    errors.value.origin = 'El origen es requerido *'
  }

  if (!destination.value.trim()) {
    errors.value.destination = 'El destino es requerido *'
  }

  if (!meetingDate.value.trim()) {
    errors.value.meetingDate = 'La fecha de encuentro es requerida *'
  } else {
    const selected = new Date(meetingDate.value)
    const today = new Date()

    // Normalizar "hoy" para evitar errores por zona horaria
    today.setHours(0, 0, 0, 0)
    selected.setHours(0, 0, 0, 0)

    if (selected < today) {
      errors.value.meetingDate = 'La fecha no puede ser anterior a hoy *'
    }
  }

  if (!meetingHour.value.trim()) {
    errors.value.meetingHour = 'La hora de encuentro es requerida *'
  } else {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (!timePattern.test(meetingHour.value.trim())) {
      errors.value.meetingHour = 'La hora debe tener un formato válido HH:mm *'
    }
  }

  if (!details.value.trim()) {
    errors.value.details = 'Los detalles son requeridos *'
  }

  if (Object.keys(errors.value).length > 0) return

  // Corregir formato de fecha antes de enviar
  const combined = combineDateTime(meetingDate.value, meetingHour.value);
  if (!combined) {
    errors.value.meetingDate = "Debes seleccionar fecha y hora *";
    return;
  }
  currentFormData.value.meetingDate = combined;
  console.log("Combined meetingDate:", combined);
  emit("submit", currentFormData.value)
}

// Filtrar el input de precio
const filterPriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9.]/g, '')
  price.value = input.value
}

// Filtrar el input de teléfono
const filterPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9\s\-\+\(\)]/g, '')
  clientPhone.value = input.value
}

// Watch para emitir cambios del formulario en tiempo real
watch(
  [clientName, clientPhone, price, cargoType, origin, destination, meetingDate, details],
  () => {
    hasUserEdited.value = true

    emit('update:modelValue', currentFormData.value)
  },
  { deep: true }
)

// Watch para cambios en orderData
watch(() => props.orderData, () => {
  if (props.isEdit && !hasUserEdited.value) {
    loadOrderData()
  }
}, { immediate: true })


// Watch para cambios en initialData (borrador)
watch(() => props.initialData, () => {
  if (!props.isEdit && props.initialData && !hasUserEdited.value) {
    loadOrderData()
  }
}, { immediate: true })


// Cargar datos al montar el componente
onMounted(() => {
  loadOrderData()
})

const combineDateTime = (date: string, time: string) => {
  if (!date || !time) return null;
  return `${date}T${time}:00Z`; // formato sin timezone
};


</script>

<template>
  <form @submit.prevent="handleSubmit">

    <div class="field-group">
      <!-- Nombre del cliente -->
      <div class="field">
        <label for="clientName">Nombre del cliente</label>
        <input type="text" id="clientName" v-model="clientName" />
        <p v-if="errors.clientName" class="error">{{ errors.clientName }}</p>
      </div>

      <!-- Teléfono del cliente -->
      <div class="field">
        <label for="clientPhone">Teléfono del cliente</label>
        <input type="text" id="clientPhone" v-model="clientPhone" @input="filterPhoneInput" />
        <p v-if="errors.clientPhone" class="error">{{ errors.clientPhone }}</p>
      </div>
    </div>

    <div class="field-group">
      <!-- Precio -->
      <div class="field">
        <label for="price">Precio</label>
        <div class="input-container price-input">
          <input type="text" id="price" v-model="price" @input="filterPriceInput" />
          <span class="currency-symbol">Q</span>
        </div>
        <p v-if="errors.price" class="error">{{ errors.price }}</p>
      </div>

      <!-- Tipo de servicio -->
      <div class="field">
        <label for="cargoType">Tipo de servicio</label>
        <select id="cargoType" v-model="cargoType">
          <option value="mudanza">Mudanza</option>
          <option value="flete">Flete</option>
          <option value="empresarial">Empresarial</option>
        </select>
      </div>
    </div>

    <!-- Origen -->
    <div class="field">
      <label for="origin">De aquí</label>
      <input type="text" id="origin" v-model="origin" />
      <p v-if="errors.origin" class="error">{{ errors.origin }}</p>
    </div>

    <!-- Destino -->
    <div class="field">
      <label for="destination">Para allá</label>
      <input type="text" id="destination" v-model="destination" />
      <p v-if="errors.destination" class="error">{{ errors.destination }}</p>
    </div>

    <div class="field-group">
      <!-- Fecha de encuentro -->
      <div class="field">
        <label for="meetingDate">Fecha de encuentro</label>
        <input type="date" id="meetingDate" v-model="meetingDate" :min="new Date().toISOString().split('T')[0]" />
        <p v-if="errors.meetingDate" class="error">{{ errors.meetingDate }}</p>
      </div>
      <!-- Hora de encuentro -->
      <div class="field">
        <label for="meetingHour">Hora de encuentro</label>
        <input type="time" id="meetingHour" v-model="meetingHour" />
        <p v-if="errors.meetingHour" class="error">{{ errors.meetingHour }}</p>
      </div>
    </div>

    <!-- Detalles -->
    <div class="field">
      <label for="details">Observaciones</label>
      <textarea id="details" v-model="details"></textarea>
      <p v-if="errors.details" class="error">{{ errors.details }}</p>
    </div>

    <!-- Botón (solo si es edición) -->
    <button class="edit-button" v-if="isEdit" type="submit">Confirmar</button>

    <!-- Botones (solo si no es edición) -->
    <div v-if="!isEdit" class="action-container">
      <button type="button" @click="emit('volver')">
        <span class="material-symbols-outlined">arrow_back</span>
        Volver
      </button>
      <button type="submit">
        <span class="material-symbols-outlined">check</span>
        Confirmar
      </button>
    </div>

  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  gap: 5px;
}

.field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-container.price-input {
  position: relative;
}

.input-container.price-input input {
  padding-left: 2rem;
}

input.price-input {
  border-radius: 10px;
  font-size: clamp(0.95rem, 2vw, 1rem);
  width: 100%;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.label {
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.input-container {
  display: flex;
  align-items: center;
}

input,
select,
textarea {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-base, #ccc);
  font-size: clamp(0.95rem, 2vw, 1rem);
  width: 100%;
}

textarea {
  min-height: 150px;
  max-height: 150px;
  resize: vertical;
}

.error {
  font-size: clamp(0.8rem, 2vw, 0.85rem);
  color: var(--principal-error);
  margin-top: 0.25rem;
}

/* Botón de edición (Confirmar) */
.edit-button {
  border: 0;
  padding: 15px 35px;
  border-radius: 10px;
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  font-size: clamp(0.95rem, 2vw, 1rem);
  font-weight: 500;
  margin: 0 auto;
  cursor: pointer;
}

.edit-button:hover {
  background-color: var(--principal-primary-hover);
}

/* Contenedor de botones de no edición */
.action-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.action-container button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: var(--neutral-white);
}

.action-container button:first-child {
  background-color: var(--principal-error-400);
}

.action-container button:first-child:hover {
  background-color: var(--principal-error-500);
}

.action-container button:last-child {
  background-color: var(--principal-secondary-300);
}

.action-container button:last-child:hover {
  background-color: var(--principal-secondary-400);
}

.action-container button span {
  margin-right: 0.5rem;
}

@media screen and (max-width: 770px) {
  .field-group {
    flex-direction: column;
    gap: 1.75rem;
  }
}
</style>