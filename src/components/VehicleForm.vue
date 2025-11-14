<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { Vehicle } from '@/types/vehicle'

const props = defineProps<{
  initialData?: Vehicle
  updating?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Vehicle): void
  (e: 'cancel'): void
}>()

// Variables para cada campo del formulario
const brand = ref('')
const model = ref('')
const licensePlate = ref('')
const capacityKg = ref<number | null>(null)
const insuranceDate = ref('')
const errors = ref<Record<string, string>>({})

// Observar cambios en initialData para llenar el formulario de editar
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      brand.value = newData.brand
      model.value = newData.model
      licensePlate.value = newData.licensePlate
      capacityKg.value = newData.capacityKg ?? null
      insuranceDate.value = newData.insuranceDate
        ? newData.insuranceDate.split('T')[0]
        : ''
    }
  },
  { immediate: true }
)

// Validar el formulario y emitir el submit
const handleSubmit = () => {
  errors.value = {}

  if (!brand.value.trim()) errors.value.brand = 'La marca es requerida *'
  if (!model.value.trim()) errors.value.model = 'El modelo es requerido *'

  const plateRegex = /^[A-Z]\d{3}[A-Z]{3}$/ // P123ABC
  if (!plateRegex.test(licensePlate.value.toUpperCase())) {
    errors.value.licensePlate = 'Formato de placa inválido (Ej: P123ABC) *'
  }

  if (capacityKg.value === null || capacityKg.value <= 0) {
    errors.value.capacityKg = 'La capacidad debe ser mayor a 0 *'
  }

  if (!insuranceDate.value) {
    errors.value.insuranceDate = 'La fecha de vencimiento del seguro es requerida *'
  }

  if (Object.keys(errors.value).length > 0) return

  const isoDate = insuranceDate.value
    ? new Date(insuranceDate.value).toISOString()
    : undefined

  emit('submit', {
    id: props.initialData?.id,
    brand: brand.value,
    model: model.value,
    licensePlate: licensePlate.value.toUpperCase(),
    capacityKg: capacityKg.value ?? 0,
    isAvailable: true,
    isActive: true,
    insuranceDate: isoDate!,
  })
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="field-group">
            <div class="field">
                <label for="Brand">Marca</label>
                <input type="text" id="Brand" name="Brand" v-model="brand" />
                <p v-if="errors.brand" class="error">{{ errors.brand }}</p>
            </div>
            <div class="field">
                <label for="Model">Modelo</label>
                <input type="text" id="Model" name="Model" v-model="model" />
                <p v-if="errors.model" class="error">{{ errors.model }}</p>
            </div>
        </div>

        <div class="field">
            <label for="LicensePlate">Placa</label>
            <input type="text" id="LicensePlate" name="LicensePlate" v-model="licensePlate" />
            <p v-if="errors.licensePlate" class="error">{{ errors.licensePlate }}</p>
        </div>

        <div class="field">
            <label for="CapacityKg">Capacidad (Kg)</label>
            <input type="number" id="CapacityKg" name="CapacityKg" v-model="capacityKg" min="0" step="any" />
            <p v-if="errors.capacityKg" class="error">{{ errors.capacityKg }}</p>
        </div>
        
        <div class="field">
            <label for="insuranceDate">Vencimiento del seguro</label>
            <input type="date" id="InsuranceDate" name="InsuranceDate" v-model="insuranceDate" />
            <p v-if="errors.insuranceDate" class="error">{{ errors.insuranceDate }}</p>
        </div>

        <button type="submit">{{ updating ? 'Actualizar' : 'Registrar' }}</button>
    </form>
</template>

<style scoped>
.field-group {
    display: flex;
    gap: 0.3125rem; /* 5px → rem */
}

.field {
    width: 100%;
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}

label {
    margin-bottom: 0.00625rem; /* 0.1px → rem */
}

.error {
    font-size: 0.625rem; /* 10px → rem */
    color: var(--principal-error);
    margin-left: 0.3125rem; /* 5px → rem */
}

input,
select {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border-base);
    font-size: 1rem;
}

button {
    border: 0;
    padding: 0.9375rem 2.1875rem; /* 15px 35px → rem */
    border-radius: 10px;
    background-color: var(--principal-primary);
    color: var(--neutral-white);
    font-size: 1rem;
    margin: 0 auto;
    cursor: pointer;
}

form>button:hover {
    background-color: var(--principal-primary-hover);
}

@media screen and (max-width: 770px) {
    .field-group {
        flex-direction: column;
        gap: 1.75rem;
    }
}
</style>
