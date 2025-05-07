<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
    initialData?: {
        id?: number
        brand?: string
        model?: string
        licensePlate?: string
        capacityKg?: number
        available?: boolean
        currentMileage?: number
        nextMaintenanceMileage?: number
    }
}>()

const emit = defineEmits<{
  (e: 'submit', payload: any): void
  (e: 'cancel'): void
}>()

const handleSubmit = () => {
  emit('submit', {
    id: props.initialData?.id,
    brand: brand.value,
    model: model.value,
    licensePlate: licensePlate.value,
    capacityKg: capacityKg.value,
    available: available.value,
    currentMileage: currentMileage.value,
    nextMaintenanceMileage: nextMaintenanceMileage.value,
  })
}

const brand = ref('')
const model = ref('')
const licensePlate = ref('')
const capacityKg = ref<number | null>(null)
const available = ref(true)
const currentMileage = ref<number | null>(null)
const nextMaintenanceMileage = ref<number | null>(null)

watch(() => props.initialData, (newData) => {
    if (newData) {
        brand.value = newData.brand || ''
        model.value = newData.model || ''
        licensePlate.value = newData.licensePlate || ''
        capacityKg.value = newData.capacityKg ?? null
        available.value = newData.available ?? true
        currentMileage.value = newData.currentMileage ?? null
        nextMaintenanceMileage.value = newData.nextMaintenanceMileage ?? null
    }
}, { immediate: true })
</script>

<template>
    <main>
        <form @submit.prevent="handleSubmit">
            <div class="field-group">
                <div class="field">
                    <label for="Brand">Marca</label>
                    <input type="text" id="Brand" name="Brand" v-model="brand">
                </div>
                <div class="field">
                    <label for="Model">Modelo</label>
                    <input type="text" id="Model" name="Model" v-model="model">
                </div>
            </div>
            <div class="field">
                <label for="LicensePlate">Placa</label>
                <input type="text" id="LicensePlate" name="LicensePlate" v-model="licensePlate">
            </div>
            <div class="field-group">
                <div class="field">
                    <label for="CapacityKg">Capacidad (Kg)</label>
                    <input type="number" id="CapacityKg" name="CapacityKg" v-model="capacityKg" min="0">
                </div>
                <div class="field">
                    <label for="Available">Disponible</label>
                    <select id="Available" name="Available" v-model="available">
                        <option :value="true">Sí</option>
                        <option :value="false">No</option>
                    </select>
                </div>
            </div>
            <div class="field-group">
                <div class="field">
                    <label for="CurrentMileage">Kilometraje actual</label>
                    <input type="number" id="CurrentMileage" name="CurrentMileage" v-model="currentMileage" min="0">
                </div>
                <div class="field">
                    <label for="NextMaintenanceMileage">Próximo mantenimiento (km)</label>
                    <input type="number" id="NextMaintenanceMileage" name="NextMaintenanceMileage" v-model="nextMaintenanceMileage" min="0">
                </div>
            </div>

            <button type="submit">Guardar vehículo</button>
        </form>
    </main>
</template>

<style scoped>
form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}

.field-group {
    display: flex;
    gap: 5px;
    width: 100%;
}

.field {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

input,
select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-input);
    font-size: 1rem;
}

label {
    margin-bottom: 0.1rem;
}

button {
    width: 100%;
    border: 0;
    padding: 15px 0;
    border-radius: 32px;
    background-color: var(--primary);
    font-size: 1.25rem;
    font-weight: 500;
}

form > button:hover {
    background-color: var(--primary-dark);
}
</style>