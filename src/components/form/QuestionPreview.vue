<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Question } from '@/types/form'

const props = defineProps<{
  question: Question
  value?: any
}>()

const emit = defineEmits<{
  (e: 'change', questionId: number, value: any): void
}>()

const localValue = ref(props.value || getInitialValue())

function getInitialValue() {
  switch (props.question.type.type) {
    case 'text':
      return ''
    case 'multiple':
      return []
    case 'dropdown':
    case 'unique':
      return ''
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
    localValue.value = newValue
  }
})

const handleCheckboxChange = (option: string, checked: boolean) => {
  if (!Array.isArray(localValue.value)) {
    localValue.value = []
  }
  
  if (checked) {
    if (!localValue.value.includes(option)) {
      localValue.value.push(option)
    }
  } else {
    const index = localValue.value.indexOf(option)
    if (index > -1) {
      localValue.value.splice(index, 1)
    }
  }
}
</script>

<template>
  <div class="preview-question">
    <label class="question-label">
      {{ question.question }}
      <span class="required-indicator">*</span>
    </label>

    <!-- Pregunta de texto -->
    <div v-if="question.type.type === 'text'" class="input-group">
      <input
        v-model="localValue"
        type="text"
        class="text-input"
        placeholder="Escribe tu respuesta aquí..."
      />
    </div>

    <!-- Pregunta de selección múltiple -->
    <div v-else-if="question.type.type === 'multiple'" class="input-group">
      <div class="checkbox-group">
        <div
          v-for="option in question.options"
          :key="option.id"
          class="checkbox-item"
        >
          <input
            :id="`${question.id}-${option.option}`"
            type="checkbox"
            :value="option"
            :checked="Array.isArray(localValue) && localValue.includes(option)"
            @change="handleCheckboxChange(option.option, ($event.target as HTMLInputElement).checked)"
            class="checkbox-input"
          />
          <label
            :for="`${question.id}-${option.option}`"
            class="checkbox-label"
          >
            {{ option.option }}
          </label>
        </div>
      </div>
    </div>

    <!-- Pregunta de lista desplegable -->
    <div v-else-if="question.type.type === 'dropdown'" class="input-group">
      <select v-model="localValue" class="select-input">
        <option value="">Selecciona una opción</option>
        <option
          v-for="option in question.options"
          :key="option.id"
          :value="option"
        >
          {{ option.option }}
        </option>
      </select>
    </div>

    <!-- Pregunta de selección única -->
    <div v-else-if="question.type.type === 'unique'" class="input-group">
      <div class="radio-group">
        <div
          v-for="option in question.options"
          :key="option.id"
          class="radio-item"
        >
          <input
            :id="`${question.id}-${option.option}`"
            v-model="localValue"
            type="radio"
            :value="option"
            class="radio-input"
          />
          <label
            :for="`${question.id}-${option.option}`"
            class="radio-label"
          >
            {{ option.option }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-question {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
}

.preview-question:hover {
  border-color: #c3d9ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.required-indicator {
  color: #e74c3c;
  margin-left: 0.25rem;
}

.input-group {
  width: 100%;
}

/* Estilos para input de texto */
.text-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Estilos para select */
.select-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.select-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Estilos para checkboxes */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
}

.checkbox-label {
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  line-height: 1.4;
  user-select: none;
}

.checkbox-label:hover {
  color: #333;
}

/* Estilos para radio buttons */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-input {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
}

.radio-label {
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  line-height: 1.4;
  user-select: none;
}

.radio-label:hover {
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-question {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .question-label {
    font-size: 1rem;
  }
  
  .text-input, .select-input {
    font-size: 16px; /* Evita zoom en iOS */
  }
}
</style>