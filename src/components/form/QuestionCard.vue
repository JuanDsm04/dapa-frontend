<script setup lang="ts">
import { type Question } from '@/types/form';
import { Bars3Icon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'toggle'): void
}>()

const typeLabel = {
  text: 'Respuesta corta',
  multiple: 'Opción múltiple',
  dropdown: 'Lista desplegable',
  unique: 'Selección única'
}
</script>

<template>
  <div class="question-card" :class="{ inactive: !question.active }">
    <div class="drag-handle" title="Arrastrar para mover">
      <Bars3Icon class="drag-icon" />
    </div>

    <div class="card-body">
      <h3>{{ question.text || '(Sin texto)' }}</h3>
      <p><strong>Tipo:</strong> {{ typeLabel[question.type] }}</p>

      <div v-if="!(question.type === 'text')">
        <p v-if="question.options && question.options.length">
          <strong>Opciones:</strong> {{ question.options.join(', ') }}
        </p>
      </div>

      <div class="actions">
        <button class="btn-edit" @click="emit('edit')">Editar</button>
        <button class="btn-delete" @click="emit('delete')">Eliminar</button>
        <button class="btn-toggle" @click="emit('toggle')">
          {{ question.active ? 'Desactivar' : 'Activar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  display: flex;
  align-items: flex-start;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
  padding: 1rem;
  background-color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.question-card.inactive {
  opacity: 0.6;
  background-color: #f8f8f8;
}

.drag-handle {
  cursor: grab;
  margin-right: 1rem;
  color: #6c757d;
  user-select: none;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.drag-handle:hover {
  background-color: #f8f9fa;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  width: 20px;
  height: 20px;
}

.card-body {
  flex: 1;
}

.card-body h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.card-body p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: var(--edit-btn);
  color: var(--on-edit-btn);
}

.btn-edit:hover {
  background-color: var(--edit-btn-hover);
}

.btn-delete {
  background-color: var(--delete-btn);
  color: var(--on-delete-btn);
}

.btn-delete:hover {
  background-color: var(--delete-btn-hover);
}

.btn-toggle {
  background-color: var(--add-btn);
  color: white;
}

.btn-toggle:hover {
  background-color: var(--add-btn-hover);
}

.question-card.inactive .btn-toggle {
  background-color: var(--terciary);
}

.question-card.inactive .btn-toggle:hover {
  background-color: var(--terciary-dark);
}
</style>
