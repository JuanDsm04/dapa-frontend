<script setup lang="ts">
import type { Order, FrontendCargoType, BackendCargoType } from '@/types/order';
import { ref, watch, onMounted } from 'vue';

// Props
const props = defineProps<{
  isEdit?: boolean
  orderData?: Order
}>()

// Emitir evento para volver al componente padre
const emit = defineEmits(["volver", "submit"])

const price = ref('')
const cargoType = ref<FrontendCargoType>('personal')
const origin = ref('')
const destination = ref('')
const details = ref('')

const errors = ref<Record<string, string>>({})

// Mapeo de tipos de carga del backend al frontend
const cargoTypeBackendToFrontend: Record<BackendCargoType, FrontendCargoType> = {
  business: 'negocio',
  personal: 'personal',
  corporate: 'empresarial'
}

// Mapeo de tipos de carga del frontend al backend
const cargoTypeFrontendToBackend: Record<FrontendCargoType, BackendCargoType> = {
  personal: 'personal',
  empresarial: 'corporate',
  negocio: 'business'
}

// Tipo guard para BackendCargoType
const isBackendCargoType = (v: any): v is BackendCargoType => {
  return v === 'business' || v === 'personal' || v === 'corporate'
}

// Cargar datos si es edición
const loadOrderData = () => {
  if (props.orderData && props.isEdit) {
    price.value = props.orderData.totalAmount ? props.orderData.totalAmount.toString() : ''
    // asegurar tipo antes de indexar el Record
    if (isBackendCargoType(props.orderData.type)) {
      cargoType.value = cargoTypeBackendToFrontend[props.orderData.type]
    } else {
      cargoType.value = 'personal'
    }
    origin.value = props.orderData.origin || ''
    destination.value = props.orderData.destination || ''
    details.value = props.orderData.details || ''
  }
}

// Validar y preparar datos para envío
const handleSubmit = async () => {
  errors.value = {}

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

  if (!details.value.trim()) {
    errors.value.details = 'Los detalles son requeridos *'
  }

  if (Object.keys(errors.value).length > 0) return

  // Construir payload
  const payload = {
    totalAmount: numericPrice,
    type: cargoTypeFrontendToBackend[cargoType.value],
    origin: origin.value,
    destination: destination.value,
    details: details.value
  }

  // Emitir evento con los datos al componente padre
  emit("submit", payload)
}

// Filtrar el input de precio
const filterPriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9.]/g, '')
  price.value = input.value
}

// Watch para cambios en orderData
watch(() => props.orderData, () => {
  loadOrderData()
}, { immediate: true, deep: true })

// Cargar datos al montar el componente
onMounted(() => {
  loadOrderData()
})
</script>

<template>
  <form @submit.prevent="handleSubmit">

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
          <option value="personal">Personal</option>
          <option value="empresarial">Empresarial</option>
          <option value="negocio">Negocio</option>
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
        Cancelar
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