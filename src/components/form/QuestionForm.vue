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

// Reactive form data
const formData = ref<{
  question: string,
  type: QuestionType | null,
  isActive: boolean,
  options: QuestionOption[]
}>({
  question: '',
  type: null,
  isActive: true,
  options: []
})

onMounted(() => {
  if (props.initialData) {
    formData.value = {
      question: props.initialData.question || '',
      type: props.initialData.type || (props.questionTypes.length > 0 ? props.questionTypes[0] : null),
      isActive: props.initialData.isActive ?? true,
      options: props.initialData.options ? [...props.initialData.options] : []
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
      options: newData.options ? [...newData.options] : []
    }
  }
}, { deep: true })

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
})

const addOption = () => {
  const newId = Math.max(0, ...formData.value.options.map(o => o.id)) + 1
  formData.value.options.push({ id: newId, option: '' })
}

const deleteOption = (index: number) => {
  if (formData.value.options.length > 1) {
    formData.value.options.splice(index, 1)
  }
}

const canSave = computed(() => {
  if (!formData.value.question.trim()) return false
  if (!formData.value.type) return false

  if (['multiple', 'dropdown', 'unique'].includes(formData.value.type.type)) {
    return formData.value.options.some(option => option.option.trim() !== '')
  }
  return true
})

const handleSubmit = () => {
  if (!canSave.value || props.loading) return
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
    console.error('Selected question type not found. Selected:', formData.value.type, 'Available:', props.questionTypes)
    return
  }

  const payload: any = {
    question: formData.value.question.trim(),
    description: null,
    typeId: selectedType.id, // Use real ID from database
    isActive: formData.value.isActive,
    options: filteredOptions
  }


  // Add ID if updating
  if (props.updating && props.initialData?.id) {
    payload.id = props.initialData.id
  }

  emit('submit', payload)
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
    'unique': 'Selección única'
  }
  return displayNames[typeObj.type] || typeObj.type
}

</script>

<template>
  <div class="question-form">
    <div class="form-group">
      <label for="question-text">Texto de la pregunta:</label>
      <input id="question-text" v-model="formData.question" type="text" placeholder="Ej. ¿Cuál es tu nombre?"
        class="form-input" :disabled="loading" required />
    </div>

    <div class="form-group">
      <label for="question-type">Tipo de pregunta:</label>
      <select id="question-type" v-model="formData.type" class="form-select" :disabled="loading || loadingTypes">
        <option value="" disabled v-if="loadingTypes">Cargando tipos...</option>
        <option value="" disabled v-if="!loadingTypes && questionTypes.length === 0">No hay tipos disponibles</option>
        <option v-for="questionType in questionTypes" :key="questionType.id" :value="questionType">
          {{ getTypeDisplayName(questionType) }}
        </option>

      </select>
    </div>

    <div class="form-group">
      <label class="toggle-switch">
        <input v-model="formData.isActive" type="checkbox" :disabled="loading" />
        <div class="toggle-slider"></div>
        <span class="toggle-text">Pregunta activa</span>
      </label>
    </div>

    <div v-if="requiresOptions" class="form-group">
      <label>Opciones:</label>
      <div class="options-container">
        <div v-for="(option, index) in formData.options" :key="option.id || index" class="option-row">
          <input v-model="option.option" type="text" :placeholder="`Opción ${index + 1}`"
            class="form-input option-input" :disabled="loading" />
          <button @click="deleteOption(index)" class="btn-delete-option"
            :disabled="formData.options.length === 1 || loading" type="button">
            Eliminar
          </button>
        </div>
        <button @click="addOption" class="btn-add-option" type="button" :disabled="loading">
          + Agregar opción
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button @click="handleSubmit" class="btn-primary" :disabled="!canSave || loading">
        <span v-if="loading">Guardando...</span>
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
  color: #555;
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
  color: #333;
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
  background: #cbd5e1;
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Evita que se reduzca en pantallas pequeñas */
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: #22c55e;
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
  color: #374151;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

/* Hover effect */
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

.form-input:disabled,
.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.options-container {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  background-color: #fafafa;
}

.option-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: center;
}

.option-input {
  flex: 1;
  margin-bottom: 0;
}

.btn-delete-option {
  padding: 0.5rem 0.75rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.btn-delete-option:hover:not(:disabled) {
  background-color: #d32f2f;
}

.btn-delete-option:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-add-option {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.btn-add-option:hover:not(:disabled) {
  background-color: #388e3c;
}

.btn-add-option:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--add-btn-hover, #1976d2);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.debug-info {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .option-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-delete-option {
    width: 100%;
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