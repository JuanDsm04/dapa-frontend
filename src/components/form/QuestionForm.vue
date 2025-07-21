<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { type Question } from '@/types/form';

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: 'save', question: Question): void
  (e: 'cancel'): void
}>()

const text = ref(props.question.text)
const type = ref(props.question.type)
const options = ref<string[]>(props.question.options ? [...props.question.options] : [])

watch(type, (newType) => {
  if ((newType === 'multiple' || newType === 'dropdown' || newType === 'unique') && options.value.length === 0) {
    options.value = ['']
  }
})

watch(() => props.question, (q) => {
  text.value = q.text
  type.value = q.type
  options.value = q.options ? [...q.options] : []
}, { deep: true })

const addOption = () => {
  options.value.push('')
}

const deleteOption = (index: number) => {
  if (options.value.length > 1) {
    options.value.splice(index, 1)
  }
}

const canSave = computed(() => {
  if (!text.value.trim()) return false
  if (type.value === 'multiple' || type.value === 'dropdown' || type.value === 'unique') {
    return options.value.some(option => option.trim() !== '')
  }
  return true
})

const save = () => {
  if (!canSave.value) return

  const filteredOptions = options.value.filter(option => option.trim() !== '')
  
  const updatedQuestion: Question = {
    ...props.question,
    text: text.value.trim(),
    type: type.value,
    active: props.question.active,
    ...(type.value === 'multiple' || type.value === 'dropdown' || type.value === 'unique' ? { options: filteredOptions } : {})
  }
  emit('save', updatedQuestion)
}

const cancel = () => emit('cancel')

const isEditing = computed(() => !!props.question.id)
</script>

<template>
  <div class="modal-overlay" @click.self="cancel">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Editar' : 'Agregar' }} Pregunta</h3>
        <button class="close-btn" @click="cancel">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="question-text">Texto de la pregunta:</label>
          <input 
            id="question-text"
            v-model="text" 
            type="text" 
            placeholder="Ej. ¿Cuál es tu nombre?" 
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="question-type">Tipo de pregunta:</label>
          <select id="question-type" v-model="type" class="form-select">
            <option value="text">Respuesta corta</option>
            <option value="multiple">Selección múltiple</option>
            <option value="dropdown">Lista desplegable</option>
            <option value="unique">Selección única</option>
          </select>
        </div>

        <div v-if="type === 'multiple' || type === 'dropdown' || type ==='unique'" class="form-group">
          <label>Opciones:</label>
          <div class="options-container">
            <div v-for="(option, index) in options" :key="index" class="option-row">
              <input 
                v-model="options[index]" 
                type="text" 
                :placeholder="`Opción ${index + 1}`"
                class="form-input option-input"
              />
              <button 
                @click="deleteOption(index)"
                class="btn-delete-option"
                :disabled="options.length === 1"
                type="button"
              >
                Eliminar
              </button>
            </div>
            <button @click="addOption" class="btn-add-option" type="button">
              + Agregar opción
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="save" class="btn-primary" :disabled="!canSave">
          {{ isEditing ? 'Guardar cambios' : 'Crear pregunta' }}
        </button>
        <button @click="cancel" class="btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
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

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
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

.btn-add-option:hover {
  background-color: #388e3c;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1976d2;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9e9e9;
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
