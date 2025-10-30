<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { type Question } from '@/types/form'

const props = defineProps<{
  question: Question
  readOnly?: boolean
  value?: any
  error?: string
}>()

const emit = defineEmits<{
  (e: 'change', questionId: number, value: any): void
}>()

const localValue = ref(props.value || getInitialValue())

// Computed para saber si el campo tiene error
const hasError = computed(() => !!props.error)

function getInitialValue() {
  switch (props.question.type.type) {
    case 'text':
      return ''
    case 'area':
      return ''
    case 'multiple':
      if (Array.isArray(props.value)) {
        return props.value
      }
      if (typeof props.value === 'number') {
        return [props.value]
      }
      return []
    case 'dropdown':
    case 'unique':
      return typeof props.value === 'number' ? props.value : ''
    default:
      return ''
  }
}

watch(localValue, (newValue) => {
  if (props.question.id) {
    emit('change', props.question.id, newValue)
  }
}, { deep: true })

watch(() => props.value, (newValue) => {
  if (newValue !== undefined) {
    if (props.question.type.type === 'multiple') {
      localValue.value = Array.isArray(newValue)
        ? newValue
        : typeof newValue === 'number'
          ? [newValue]
          : []
    } else {
      localValue.value = newValue
    }
  }
})

const handleCheckboxChange = (optionId: number, checked: boolean) => {
  if (!Array.isArray(localValue.value)) {
    localValue.value = []
  }

  if (checked) {
    if (!localValue.value.includes(optionId)) {
      localValue.value.push(optionId)
    }
  } else {
    const index = localValue.value.indexOf(optionId)
    if (index > -1) {
      localValue.value.splice(index, 1)
    }
  }
}

</script>

<template>
  <div class="preview-question" :class="{ 'has-error': hasError }">
    <label class="question-label">
      {{ question.question }}
      <span v-if="question.isRequired" class="required-indicator">*</span>
    </label>

    <!-- Pregunta de texto -->
    <div v-if="question.type.type === 'text'" class="input-group">
      <input v-model="localValue" type="text" class="text-input" :class="{ 'error': hasError }"
        placeholder="Escribe tu respuesta aquí..." :readonly="props.readOnly" />
    </div>

    <!-- Pregunta de texto larga -->
    <div v-if="question.type.type === 'area'" class="input-group">
      <textarea v-model="localValue" class="text-input" :class="{ 'error': hasError }"
        placeholder="Escribe tu respuesta aquí..." :readonly="props.readOnly"></textarea>
    </div>

    <!-- Pregunta de selección múltiple -->
    <div v-else-if="question.type.type === 'multiple'" class="input-group">
      <div class="checkbox-group" :class="{ 'error': hasError }">
        <div v-for="option in question.options" :key="option.id" class="checkbox-item">
          <input :id="`${question.id}-${option.option}`" type="checkbox" :value="option.id"
            :checked="Array.isArray(localValue) && localValue.includes(option.id)"
            @change="handleCheckboxChange(option.id, ($event.target as HTMLInputElement).checked)"
            class="checkbox-input" :disabled="props.readOnly" />
          <label :for="`${question.id}-${option.option}`" class="checkbox-label">
            {{ option.option }}
          </label>
        </div>
      </div>
    </div>

    <!-- Pregunta de lista desplegable -->
    <div v-else-if="question.type.type === 'dropdown'" class="input-group">
      <select v-model="localValue" class="select-input" :class="{ 'error': hasError }" :disabled="props.readOnly">
        <option value="">Selecciona una opción</option>
        <option v-for="option in question.options" :key="option.id" :value="option.id">
          {{ option.option }}
        </option>
      </select>
    </div>

    <!-- Pregunta de selección única -->
    <div v-else-if="question.type.type === 'unique'" class="input-group">
      <div class="radio-group" :class="{ 'error': hasError }">
        <div v-for="option in question.options" :key="option.id" class="radio-item">
          <input :id="`${question.id}-${option.option}`" v-model="localValue" type="radio" :value="option.id"
            class="radio-input" :disabled="props.readOnly" />
          <label :for="`${question.id}-${option.option}`" class="radio-label">
            {{ option.option }}
          </label>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="hasError" class="error-message">
      <span class="material-symbols-outlined sm-icon">
        cancel
      </span>
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.preview-question {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 0.0625rem solid var(--border-base);
  border-radius: 12px;
  background: var(--neutral-white);
  transition: all 0.2s ease;
}

.question-label {
  display: block;
  margin-bottom: 1rem;
  font-size: clamp(1rem, 2vw, 1.1rem);
  font-weight: 600;
  color: var(--neutral-gray-800);
  line-height: 1.4;
}

.required-indicator {
  color: var(--principal-error);
  margin-left: 0.25rem;
}

.input-group {
  width: 100%;
}

/* Estilos para input de texto */
.text-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 0.125rem solid var(--border-base);
  /* 2px -> rem */
  border-radius: 8px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

textarea.text-input {
  height: 10rem;
}

.text-input:focus {
  outline: none;
  border-color: var(--principal-primary-200);
}

.text-input:hover {
  background-color: var(--neutral-gray-50);
}

.icon {
  height: 1.2rem;
  width: 1.2rem;
}

/* Estilos para select */
.select-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 0.125rem solid var(--border-base);
  border-radius: 8px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  background: var(--neutral-white);
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.select-input:focus {
  outline: none;
  border-color: var(--principal-primary-200);
}

.select-input:hover {
  background-color: var(--neutral-gray-50);
}

/* Estilos para checkboxes */
.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 0.125rem solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input,
.radio-input {
  width: 1.125rem;
  /* 18px -> rem */
  height: 1.125rem;
  accent-color: var(--principal-primary);
  cursor: pointer;
}

.checkbox-label,
.radio-label {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: var(--neutral-gray-600);
  cursor: pointer;
  line-height: 1.4;
  user-select: none;
}

.checkbox-label:hover,
.radio-label:hover {
  color: var(--neutral-gray-800);
}

/* Mensaje de error */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--principal-error-25);
  border: 0.0625rem solid var(--principal-error-200);
  border-radius: 6px;
  color: var(--principal-error-700);
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
}

.error-message svg {
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 48rem) {

  /* 768px -> rem */
  .preview-question {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .question-label {
    font-size: clamp(0.9rem, 2vw, 1rem);
  }

  .text-input,
  .select-input {
    font-size: clamp(0.9rem, 2vw, 1rem);
  }

  .checkbox-group,
  .radio-group {
    padding: 0.5rem;
  }

  .error-message {
    font-size: clamp(0.7rem, 2vw, 0.8rem);
    padding: 0.5rem;
  }
}
</style>