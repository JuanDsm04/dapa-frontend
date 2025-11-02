<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { type Question, type QuestionOption, type QuestionType } from '@/types/form'

const props = defineProps<{
  initialData?: Question
  questionTypes: QuestionType[]
  updating?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: Partial<Question>]
}>()

const loadingTypes = ref(false)

// Estado de validación
const errors = ref<{
  question?: string
  type?: string
  options?: string[]
  general?: string
}>({})

const showErrors = ref(false)

// Reactive form data
const formData = ref<{
  question: string,
  type: QuestionType | null,
  isActive: boolean,
  isRequired: boolean,
  options: QuestionOption[]
}>({
  question: '',
  type: null,
  isActive: true,
  isRequired: true,
  options: []
})

onMounted(() => {
  if (props.initialData) {
    formData.value = {
      question: props.initialData.question || '',
      type: props.initialData.type || (props.questionTypes.length > 0 ? props.questionTypes[0] : null),
      isActive: props.initialData.isActive ?? true,
      isRequired: props.initialData.isRequired ?? true,
      options: props.initialData.options ? deepClone(props.initialData.options) : []
    }
  } else {
    formData.value.type = props.questionTypes.length > 0 ? props.questionTypes[0] : null
  }
})

// Watch for changes in initialData (in case parent updates it)
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      question: newData.question || '',
      type: newData.type,
      isActive: newData.isActive ?? true,
      isRequired: newData.isRequired ?? true,
      options: newData.options ? deepClone(newData.options) : []
    }
    // Limpiar errores cuando se cargan nuevos datos
    clearErrors()
  }
}, { deep: true })

const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

watch(() => formData.value.type, (newType) => {
  if (!newType) return;

  const t = newType.type;

  if (['multiple', 'dropdown', 'unique'].includes(t)) {
    if (formData.value.options.length === 0) {
      formData.value.options = [{ id: 0, option: '' }]
    }
  } else {
    formData.value.options = []
  }
  
  // Limpiar errores relacionados con el tipo
  clearFieldError('type')
  clearFieldError('options')
})

// Watch para limpiar errores cuando el usuario empieza a escribir
watch(() => formData.value.question, () => {
  if (showErrors.value && formData.value.question.trim()) {
    clearFieldError('question')
  }
})

const addOption = () => {
  const newId = Math.max(0, ...formData.value.options.map(o => o.id)) + 1
  formData.value.options.push({ id: newId, option: '' })
}

const deleteOption = (index: number) => {
  if (formData.value.options.length > 1) {
    formData.value.options.splice(index, 1)
    // Limpiar errores de opciones si se elimina una
    if (errors.value.options && errors.value.options[index]) {
      errors.value.options.splice(index, 1)
    }
  }
}

// Función para limpiar errores
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

// Función para validar el formulario
const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // Validar pregunta
  if (!formData.value.question.trim()) {
    errors.value.question = 'El texto de la pregunta es obligatorio'
    isValid = false
  } else if (formData.value.question.trim().length < 3) {
    errors.value.question = 'El texto de la pregunta debe tener al menos 3 caracteres'
    isValid = false
  } else if (formData.value.question.trim().length > 50) {
    errors.value.question = 'El texto de la pregunta no puede exceder 50 caracteres'
    isValid = false
  }

  // Validar tipo de pregunta
  if (!formData.value.type) {
    errors.value.type = 'Debes seleccionar un tipo de pregunta'
    isValid = false
  }

  // Validar opciones si el tipo las requiere
  if (requiresOptions.value && formData.value.options.length > 0) {
    errors.value.options = []
    let hasValidOptions = false
    let duplicateOptions: string[] = []
    const optionTexts: string[] = []

    formData.value.options.forEach((option, index) => {
      const trimmedOption = option.option.trim()
      
      if (!trimmedOption) {
        errors.value.options![index] = 'Esta opción no puede estar vacía'
        isValid = false
      } else if (trimmedOption.length > 50) {
        errors.value.options![index] = 'Esta opción no puede exceder 50 caracteres'
        isValid = false
      } else if (optionTexts.includes(trimmedOption.toLowerCase())) {
        errors.value.options![index] = 'Esta opción está duplicada'
        duplicateOptions.push(trimmedOption)
        isValid = false
      } else {
        hasValidOptions = true
        optionTexts.push(trimmedOption.toLowerCase())
      }
    })

    // Validar que haya al menos 2 opciones válidas para tipos que requieren opciones
    if (requiresOptions.value && !hasValidOptions) {
      errors.value.general = 'Debes agregar al menos una opción válida'
      isValid = false
    } else if (requiresOptions.value && optionTexts.length < 2) {
      errors.value.general = 'Debes tener al menos 2 opciones válidas'
      isValid = false
    }
  }

  return isValid
}

const canSave = computed(() => {
  if (!formData.value.question.trim()) return false
  if (!formData.value.type) return false

  if (['multiple', 'dropdown', 'unique'].includes(formData.value.type.type)) {
    const validOptions = formData.value.options.filter(option => option.option.trim() !== '')
    return validOptions.length >= 2
  }
  return true
})

const handleSubmit = () => {
  if (props.loading) return
  
  showErrors.value = true
  
  if (!validateForm()) {
    return
  }

  // Filter out empty options
  const filteredOptions = formData.value.options
    .filter(option => option.option.trim() !== '')
    .map(option => ({
      id: option.id,
      option: option.option.trim()
    }))

  // Find the TypeID from the loaded question types
  const selectedType = props.questionTypes.find(qt => qt.type === formData.value.type?.type)
  if (!selectedType) {
    errors.value.general = 'Tipo de pregunta no válido. Por favor, selecciona un tipo diferente.'
    return
  }

  const payload: any = {
    question: formData.value.question.trim(),
    description: null,
    typeId: selectedType.id,
    isActive: formData.value.isActive,
    isRequired: formData.value.isRequired, 
    options: filteredOptions
  }

  // Add ID if updating
  if (props.updating && props.initialData?.id) {
    payload.id = props.initialData.id
  }

  emit('submit', payload)
}

// Función para limpiar error de opción específica
const clearOptionError = (index: number) => {
  if (showErrors.value && errors.value.options && errors.value.options[index]) {
    errors.value.options[index] = ''
  }
}

const isEditing = computed(() => props.updating || !!props.initialData?.id)

const requiresOptions = computed(() => {
  return formData.value.type?.type === 'multiple' || formData.value.type?.type === 'dropdown' || formData.value.type?.type === 'unique'
})

const getTypeDisplayName = (typeObj: QuestionType | null) => {
  if (!typeObj) return ''
  const displayNames: Record<string, string> = {
    'text': 'Respuesta corta',
    'multiple': 'Selección múltiple',
    'dropdown': 'Lista desplegable',
    'unique': 'Selección única',
    'area': 'Respuesta larga'
  }
  return displayNames[typeObj.type] || typeObj.type
}

// Computed para verificar si hay errores
const hasErrors = computed(() => {
  return showErrors.value && Object.keys(errors.value).length > 0
})

</script>

<template>
  <div class="question-form">
    <div class="form-group">
      <label for="question-text">Texto de la pregunta: <span class="required">*</span></label>
      <input 
        id="question-text" 
        v-model="formData.question" 
        type="text" 
        placeholder="Ej. ¿Cuál es tu nombre?"
        class="form-input" 
        :class="{ 'error': showErrors && errors.question }"
        :disabled="loading" 
        maxlength="50"
        required 
      />
      <div v-if="showErrors && errors.question" class="error-message">
        {{ errors.question }}
      </div>
      <div class="input-help">
        {{ formData.question.length }}/50 caracteres
      </div>
    </div>

    <div class="form-group">
      <label for="question-type">Tipo de pregunta: <span class="required">*</span></label>
      <select 
        id="question-type" 
        v-model="formData.type" 
        class="form-select"
        :class="{ 'error': showErrors && errors.type }"
        :disabled="loading || loadingTypes"
      >
        <option value="" disabled v-if="loadingTypes">Cargando tipos...</option>
        <option value="" disabled v-if="!loadingTypes && questionTypes.length === 0">No hay tipos disponibles</option>
        <option v-for="questionType in questionTypes" :key="questionType.id" :value="questionType">
          {{ getTypeDisplayName(questionType) }}
        </option>
      </select>
      <div v-if="showErrors && errors.type" class="error-message">
        {{ errors.type }}
      </div>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input v-model="formData.isActive" type="checkbox" :disabled="loading" />
        <div class="toggle-slider"></div>
        <span class="toggle-text">Pregunta activa</span>
      </label>
      <div class="input-help">
        {{ formData.isActive ? 'La pregunta aparecerá en el formulario' : 'La pregunta estará oculta en el formulario' }}
      </div>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input v-model="formData.isRequired" type="checkbox" :disabled="loading" />
        <div class="toggle-slider"></div>
        <span class="toggle-text">Pregunta obligatoria</span>
      </label>
      <div class="input-help">
        {{ formData.isRequired ? 'La pregunta es obligatoria' : 'La pregunta es opcional' }}
      </div>
    </div>

    <div v-if="requiresOptions" class="form-group">
      <label>Opciones: <span class="required">*</span></label>
      <div class="input-help" style="margin-bottom: 0.75rem;">
        Agrega al menos 2 opciones. Cada opción debe ser única.
      </div>
      <div class="options-container">
        <div v-for="(option, index) in formData.options" :key="option.id || index" class="option-row">
          <div class="option-input-container">
            <input 
              v-model="option.option" 
              type="text" 
              :placeholder="`Opción ${index + 1}`"
              class="form-input option-input" 
              :class="{ 'error': showErrors && errors.options && errors.options[index] }"
              :disabled="loading"
              maxlength="200"
              @input="clearOptionError(index)"
            />
            <div v-if="showErrors && errors.options && errors.options[index]" class="error-message">
              {{ errors.options[index] }}
            </div>
            <div class="option-help">
              {{ option.option.length }}/50 caracteres
            </div>
          </div>
          <button 
            @click="deleteOption(index)" 
            class="btn-delete-option"
            :disabled="formData.options.length === 1 || loading" 
            type="button"
            :title="formData.options.length === 1 ? 'Debe haber al menos una opción' : 'Eliminar opción'"
          >
              <span class="material-symbols-outlined md-icon">
                delete
              </span>
          </button>
        </div>
        <button @click="addOption" class="btn-add-option" type="button" :disabled="loading || formData.options.length >= 10">
          + Agregar opción {{ formData.options.length >= 15 ? '(máximo 15)' : '' }}
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="handleSubmit" 
        class="btn-primary" 
        :disabled="!canSave || loading"
      >
        <span v-if="loading">
          Guardando...
        </span>
        <span v-else>{{ isEditing ? 'Guardar cambios' : 'Crear pregunta' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
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
  color: var(--neutral-gray-800);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
}

.required {
  color: var(--principal-error);
  margin-left: 0.25rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
}

.alert-error {
  background: var(--neutral-gray-50);
  border: 1px solid var(--principal-error-25);
  color: var(--principal-error);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: var(--principal-error);
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 500;
}

.icon {
  height: 1.2rem;
  width: 1.2rem;
}

.input-help {
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--neutral-gray-500);
}

.option-help {
  font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  color: var(--neutral-gray-400);
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.checkbox-text {
  font-weight: 500;
  color: var(--neutral-gray-600);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
}

.toggle-switch {
  display: flex !important;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0 !important;
  padding: 0.5rem 0;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 28px;
  background: var(--neutral-gray-100);
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: var(--neutral-white);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--principal-secondary);
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-switch input:disabled ~ .toggle-text {
  opacity: 0.5;
}

.toggle-text {
  font-weight: 500;
  color: var(--neutral-gray-600);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  transition: color 0.2s ease;
}

.toggle-switch:hover:not(:has(input:disabled)) .toggle-slider {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.toggle-switch:hover:not(:has(input:disabled)) input:checked + .toggle-slider {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--principal-primary-200);
}

.form-input.error,
.form-select.error {
  border-color: var(--principal-error);
}

.form-input.error:focus,
.form-select.error:focus {
  border-color: var(--principal-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:disabled,
.form-select:disabled {
  background-color: var(--neutral-gray-100);
  cursor: not-allowed;
  opacity: 0.7;
}

.options-container {
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 1rem;
  background-color: var(--neutral-gray-50);
  transition: border-color 0.2s ease;
}

.options-container.error {
  border-color: var(--principal-error);
  background-color: var(--neutral-gray-100);
}

.option-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: flex-start;
}

.option-input-container {
  flex: 1;
}

.option-input {
  flex: 1;
  margin-bottom: 0;
}

.btn-delete-option {
  margin-top: 0.35rem;
  padding: 0.5rem;
  background-color: var(--principal-error);
  color: var(--neutral-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  transition: background-color 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
}

.btn-delete-option:hover:not(:disabled) {
  background-color: var(--principal-error-600);
}

.btn-delete-option:disabled {
  background-color: var(--neutral-gray-300);
  cursor: not-allowed;
}

.btn-add-option {
  padding: 0.5rem 1rem;
  background-color: var(--principal-secondary);
  color: var(--neutral-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add-option:hover:not(:disabled) {
  background-color: var(--principal-secondary-hover);
}

.btn-add-option:disabled {
  background-color: var(--neutral-gray-300);
  cursor: not-allowed;
}

.form-actions {
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--principal-primary-hover);
}

.btn-primary:disabled {
  background-color: var(--neutral-gray-300);
  cursor: not-allowed;
}

.btn-primary.has-errors:not(:disabled) {
  background-color: var(--principal-error);
}

.btn-primary.has-errors:hover:not(:disabled) {
  background-color: var(--principal-error-600);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .option-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-delete-option {
    width: 100%;
    height: auto;
    padding: 0.5rem 0.75rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }

  .toggle-switch {
    gap: 0.75rem;
  }

  .toggle-text {
    font-size: 0.9rem;
  }
}
</style>
