<script setup lang="ts">
import { ref, watch, withDefaults } from 'vue'
import type { Expense, ExpenseType } from '@/types/expense'

const props = withDefaults(defineProps<{
  initialData?: Expense
  expenseTypes?: ExpenseType[]
  updating?: boolean
}>(), {
  initialData: undefined,
  expenseTypes: () => [],
  updating: false
})

const emit = defineEmits<{
  (e: 'submit', payload: Partial<Expense>): void
  (e: 'cancel'): void
}>()

const date = ref('')
const newExpenseType = ref('')
const isNewType = ref(false)
const selectedTypeId = ref<number | null>(null)
const temporalEmployee = ref(false)
const description = ref('')
const amount = ref<number | null>(null)
const errors = ref<Record<string, string>>({})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      date.value = newData.date ? new Date(newData.date).toISOString().split('T')[0] : ''
      temporalEmployee.value = !!newData.temporalEmployee
      description.value = newData.description || ''
      amount.value = typeof newData.amount === 'number' ? newData.amount : null

      if (newData.typeId) {
        selectedTypeId.value = newData.typeId
        isNewType.value = false
      } else if (newData.expenseType) {
        newExpenseType.value = newData.expenseType
        isNewType.value = true
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.expenseTypes,
  (types) => {
    if (types && types.length > 0 && !props.initialData) {
      isNewType.value = false
    } else if (!types || types.length === 0) {
      isNewType.value = true
      selectedTypeId.value = null
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  errors.value = {}

  if (!date.value) errors.value.date = 'La fecha es requerida *'
  if (!isNewType.value && (selectedTypeId.value === null || selectedTypeId.value === undefined)) {
    errors.value.typeId = 'Debe seleccionar un tipo de egreso *'
  }
  if (isNewType.value && !newExpenseType.value.trim()) errors.value.newExpenseType = 'El tipo de egreso es requerido *'
  if (amount.value === null || amount.value <= 0) errors.value.amount = 'El monto debe ser un número positivo *'

  if (Object.keys(errors.value).length > 0) return

  const payload: Partial<Expense> = {
    id: props.initialData?.id,
    date: date.value,
    description: description.value,
    amount: amount.value,
    temporalEmployee: temporalEmployee.value,
  }

  if (isNewType.value) {
    payload.expenseType = newExpenseType.value.trim()
    payload.typeId = null
  } else {
    payload.typeId = selectedTypeId.value
    payload.expenseType = undefined
  }

  emit('submit', payload)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label for="date">Fecha</label>
      <input type="date" id="date" v-model="date" />
      <p v-if="errors.date" class="error">{{ errors.date }}</p>
    </div>

    <div class="field">
      <label for="isNewType">Tipo de Egreso</label>
      <div class="radio-group">
        <input type="radio" id="existingType" :value="false" v-model="isNewType" />
        <label for="existingType">Existente</label>
        <input type="radio" id="newType" :value="true" v-model="isNewType" />
        <label for="newType">Nuevo</label>
      </div>
    </div>

    <!-- Show dropdown only when "Existente" is selected -->
    <div class="field" v-if="!isNewType">
      <label for="typeId">Seleccionar Tipo</label>
      <select v-if="expenseTypes && expenseTypes.length" v-model="selectedTypeId" id="typeId">
        <option :value="null" disabled>-- Selecciona un tipo --</option>
        <option 
          v-for="t in expenseTypes" 
          :key="t.id" 
          :value="t.id"
        >
          {{ t.type }}
        </option>
      </select>
      <p v-else>No hay tipos disponibles</p>
      <p v-if="errors.typeId" class="error">{{ errors.typeId }}</p>
    </div>

    <div class="field" v-if="isNewType">
      <label for="newExpenseType">Nuevo Tipo de Egreso</label>
      <input type="text" id="newExpenseType" v-model="newExpenseType" />
      <p v-if="errors.newExpenseType" class="error">{{ errors.newExpenseType }}</p>
    </div>

    <div class="field">
      <label for="amount">Monto</label>
      <input type="number" id="amount" v-model.number="amount" />
      <p v-if="errors.amount" class="error">{{ errors.amount }}</p>
    </div>

    <div class="field">
      <label for="description">Descripción</label>
      <textarea id="description" v-model="description"></textarea>
    </div>

    <div class="field">
      <div class="checkbox-group">
        <input type="checkbox" id="temporalEmployee" v-model="temporalEmployee" />
        <label for="temporalEmployee">Empleado Temporal</label>
      </div>
    </div>

    <button type="submit">{{ updating ? 'Actualizar' : 'Confirmar' }}</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-base);
  font-size: 1rem;
}

.radio-group,
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.radio-group input,
.checkbox-group input {
  margin-right: 0.5rem;
}

.error {
  font-size: 0.75rem;
  color: var(--principal-error);
  margin-top: 0.25rem;
}

button {
  border: 0;
  padding: 0.9375rem 2.1875rem;
  border-radius: 10px;
  background-color: var(--principal-primary);
  color: var(--contrast-primary-text);
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
}

button:hover {
  background-color: var(--principal-primary-hover);
}
</style>
