<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  initialData?: any
  types: string[]
  categories: string[]
  paymentMethods: string[]
  responsables: string[]
  updating?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: any]
}>()

const errors = ref<{
  date?: string
  type?: string
  amount?: string
  category?: string
  paymentMethod?: string
  responsable?: string
  description?: string
  general?: string
}>({})

const showErrors = ref(false)

const formData = ref({
  date: '',
  type: '',
  amount: '',
  category: '',
  paymentMethod: '',
  responsable: '',
  description: ''
})

onMounted(() => {
  if (props.initialData) {
    formData.value = {
      date: props.initialData.date || '',
      type: props.initialData.type || (props.types[0] || ''),
      amount: props.initialData.amount || '',
      category: props.initialData.category || (props.categories[0] || ''),
      paymentMethod: props.initialData.paymentMethod || (props.paymentMethods[0] || ''),
      responsable: props.initialData.responsable || (props.responsables[0] || ''),
      description: props.initialData.description || ''
    }
  } else {
    formData.value.type = props.types[0] || ''
    formData.value.category = props.categories[0] || ''
    formData.value.paymentMethod = props.paymentMethods[0] || ''
    formData.value.responsable = props.responsables[0] || ''
  }
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      date: newData.date || '',
      type: newData.type || (props.types[0] || ''),
      amount: newData.amount || '',
      category: newData.category || (props.categories[0] || ''),
      paymentMethod: newData.paymentMethod || (props.paymentMethods[0] || ''),
      responsable: newData.responsable || (props.responsables[0] || ''),
      description: newData.description || ''
    }
    clearErrors()
  }
}, { deep: true })

const clearErrors = () => {
  errors.value = {}
  showErrors.value = false
}

const clearFieldError = (field: keyof typeof errors.value) => {
  if (errors.value[field]) {
    delete errors.value[field]
    errors.value = { ...errors.value }
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.date) {
    errors.value.date = 'La fecha es obligatoria'
    isValid = false
  }
  if (!formData.value.type) {
    errors.value.type = 'El tipo es obligatorio'
    isValid = false
  }
  if (!formData.value.amount || isNaN(Number(formData.value.amount)) || Number(formData.value.amount) <= 0) {
    errors.value.amount = 'El monto debe ser un número mayor a 0'
    isValid = false
  }
  if (!formData.value.category) {
    errors.value.category = 'La categoría es obligatoria'
    isValid = false
  }
  if (!formData.value.paymentMethod) {
    errors.value.paymentMethod = 'El método de pago es obligatorio'
    isValid = false
  }
  if (!formData.value.responsable) {
    errors.value.responsable = 'El responsable es obligatorio'
    isValid = false
  }
  if (formData.value.description.length > 200) {
    errors.value.description = 'La descripción no puede exceder 200 caracteres'
    isValid = false
  }
  return isValid
}

const canSave = computed(() => {
  return (
    formData.value.date &&
    formData.value.type &&
    formData.value.amount &&
    !isNaN(Number(formData.value.amount)) &&
    Number(formData.value.amount) > 0 &&
    formData.value.category &&
    formData.value.paymentMethod &&
    formData.value.responsable
  )
})

const handleSubmit = () => {
  if (props.loading) return
  showErrors.value = true
  if (!validateForm()) return

  const payload = {
    ...formData.value,
    amount: Number(formData.value.amount),
    ...(props.updating && props.initialData?.id ? { id: props.initialData.id } : {})
  }
  emit('submit', payload)
}

const isEditing = computed(() => props.updating || !!props.initialData?.id)
</script>

<template>
  <div class="question-form">
    <div class="form-group">
      <label for="date">Fecha: <span class="required">*</span></label>
      <input
        id="date"
        v-model="formData.date"
        type="date"
        class="form-input"
        :class="{ 'error': showErrors && errors.date }"
        :disabled="loading"
        required
      />
      <div v-if="showErrors && errors.date" class="error-message">
        {{ errors.date }}
      </div>
    </div>

    <div class="form-group">
      <label for="type">Tipo de movimiento: <span class="required">*</span></label>
      <select
        id="type"
        v-model="formData.type"
        class="form-select"
        :class="{ 'error': showErrors && errors.type }"
        :disabled="loading"
      >
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
      <div v-if="showErrors && errors.type" class="error-message">
        {{ errors.type }}
      </div>
    </div>

    <div class="form-group">
      <label for="amount">Monto (Q.): <span class="required">*</span></label>
      <input
        id="amount"
        v-model="formData.amount"
        type="number"
        min="0.01"
        step="0.01"
        class="form-input"
        :class="{ 'error': showErrors && errors.amount }"
        :disabled="loading"
        required
      />
      <div v-if="showErrors && errors.amount" class="error-message">
        {{ errors.amount }}
      </div>
    </div>

    <div class="form-group">
      <label for="category">Categoría: <span class="required">*</span></label>
      <select
        id="category"
        v-model="formData.category"
        class="form-select"
        :class="{ 'error': showErrors && errors.category }"
        :disabled="loading"
      >
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <div v-if="showErrors && errors.category" class="error-message">
        {{ errors.category }}
      </div>
    </div>

    <div class="form-group">
      <label for="paymentMethod">Método de pago: <span class="required">*</span></label>
      <select
        id="paymentMethod"
        v-model="formData.paymentMethod"
        class="form-select"
        :class="{ 'error': showErrors && errors.paymentMethod }"
        :disabled="loading"
      >
        <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
      </select>
      <div v-if="showErrors && errors.paymentMethod" class="error-message">
        {{ errors.paymentMethod }}
      </div>
    </div>

    <div class="form-group">
      <label for="responsable">Responsable: <span class="required">*</span></label>
      <select
        id="responsable"
        v-model="formData.responsable"
        class="form-select"
        :class="{ 'error': showErrors && errors.responsable }"
        :disabled="loading"
      >
        <option v-for="resp in responsables" :key="resp" :value="resp">{{ resp }}</option>
      </select>
      <div v-if="showErrors && errors.responsable" class="error-message">
        {{ errors.responsable }}
      </div>
    </div>

    <div class="form-group">
      <label for="description">Descripción:</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-input"
        :class="{ 'error': showErrors && errors.description }"
        :disabled="loading"
        maxlength="200"
        rows="3"
        placeholder="Descripción opcional (máx. 200 caracteres)"
      ></textarea>
      <div v-if="showErrors && errors.description" class="error-message">
        {{ errors.description }}
      </div>
      <div class="input-help">
        {{ formData.description.length }}/200 caracteres
      </div>
    </div>

    <div class="form-actions">
      <button
        @click="handleSubmit"
        class="btn-primary"
        :disabled="!canSave || loading"
      >
        <span v-if="loading">Guardando...</span>
        <span v-else>{{ isEditing ? 'Guardar cambios' : 'Agregar registro' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Usa los mismos estilos de QuestionForm.vue para mantener la sintonía */
.question-form {
  width: 100%;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}
.required {
  color: #e74c3c;
  margin-left: 0.25rem;
}
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}
.input-help {
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;
}
.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}
.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--add-btn, #2196f3);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}
.form-input.error,
.form-select.error {
  border-color: #ef4444;
}
.form-input.error:focus,
.form-select.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.form-input:disabled,
.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
.form-actions {
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--add-btn, #2196f3);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-primary:hover:not(:disabled) {
  background-color: var(--add-btn-hover, #1976d2);
}
.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>