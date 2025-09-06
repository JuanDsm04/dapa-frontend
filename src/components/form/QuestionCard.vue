<script setup lang="ts">
import { computed } from "vue";
import { type Question, type QuestionType } from "@/types/form";

const props = defineProps<{
  question: Question;
  question_types: QuestionType[]
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
  (e: "toggle"): void;
}>();

const questionTypeLabels: Record<string, string> = {
  text: 'Respuesta corta',
  multiple: 'Selección múltiple',
  dropdown: 'Lista desplegable',
  unique: 'Selección única',
  area: 'Respuesta larga'
};

// Computed para obtener las opciones como strings
const optionsText = computed(() => {
  if (!props.question.options || props.question.options.length === 0) {
    return "";
  }

  // Extraer solo el texto de las opciones
  return props.question.options
    .map((option) => option.option)
    .filter((option) => option.trim() !== "") // Filtrar opciones vacías
    .join(", ");
});

// Computed para verificar si el tipo requiere opciones
const requiresOptions = computed(() => {
  return ["multiple", "dropdown", "unique"].includes(props.question.type.type);
});

function getTypeLabel(type: string, types: QuestionType[]): string {
  const match = types.find(t => t.type === type);

  if (match) {
    return questionTypeLabels[type] || `Tipo desconocido: ${type}`;
  }

  return `Tipo no registrado: ${type}`;
}

const typeLabel = computed(() => getTypeLabel(props.question.type.type, props.question_types))

</script>

<template>
  <div class="question-card" :class="{ 'card-inactive': !question.isActive }">
    <!-- Status indicator bar -->
    <div class="status-indicator" :class="{ 'inactive': !question.isActive }"></div>

    <div class="card-body">
      <div class="drag-handle" title="Arrastrar para mover">
        <span class="material-symbols-outlined drag-icon md-icon">
          menu
        </span>
      </div>

      <div class="card-content">
        <div class="card-header">
          <div class="question-info">
            <div class="question-title-container">
              <h3 class="question-title">{{ question.question || "(Sin texto)" }}</h3>
              <span class="type-badge">{{ typeLabel }}</span>
              <span class="status-badge"
                :class="{ 'status-active': question.isActive, 'status-inactive': !question.isActive }">
                {{ question.isActive ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <p v-if="question.description" class="question-description">
              {{ question.description }}
            </p>
          </div>
        </div>

        <div v-if="requiresOptions" class="options-section">
          <div class="options-header">
            <p class="options-label">Opciones de respuesta</p>
          </div>

          <div v-if="optionsText" class="options-grid">
            <div v-for="(option, index) in question.options" :key="option.id || index"
              v-show="option.option.trim() !== ''" class="option-chip">
              <span class="option-bullet">•</span>
              {{ option.option }}
            </div>
          </div>

          <div v-else class="warning-message">
            <p class="warning-text">Este tipo de pregunta requiere opciones</p>
          </div>
        </div>

        <!-- Action buttons moved to bottom right -->
        <div class="actions-container">
          <div class="actions">
            <button class="btn btn-edit" @click="emit('edit')" title="Editar pregunta">
              <span class="material-symbols-outlined btn-icon sm-icon">
                edit_square
              </span>
              <span class="btn-text">Editar</span>
            </button>

            <button 
              class="btn btn-toggle" 
              @click="emit('toggle')" 
              :title="question.isActive ? 'Desactivar pregunta' : 'Activar pregunta'"
              :class="{ 'btn-toggle-active': question.isActive }"
            >
              <span class="material-symbols-outlined btn-icon sm-icon">{{ question.isActive ? 'check_circle' : 'cancel' }}</span>
              <span class="btn-text">{{ question.isActive ? 'Desactivar' : 'Activar' }}</span>
            </button>

            <button class="btn btn-delete" @click="emit('delete')" title="Eliminar pregunta">
              <span class="material-symbols-outlined btn-icon sm-icon">
                delete
              </span>
              <span class="btn-text">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  position: relative;
  background: var(--white);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.question-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.question-card.card-inactive {
  opacity: 0.7;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.status-indicator.inactive {
  background: linear-gradient(90deg, #ccc 0%, #999 100%);
}

.card-body {
  display: flex;
  align-items: flex-start;
  padding: 1.75rem;
  gap: 1rem;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: grab;
  color: var(--terciary);
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(var(--terciary), 0.08);
  transition: all 0.2s ease;
  border: 2px dashed transparent;
}

.drag-handle:hover {
  color: var(--primary-dark);
  background: rgba(var(--primary), 0.15);
  border-color: var(--primary);
  transform: scale(1.05);
}

.drag-handle:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-info {
  flex: 1;
}

.question-title-container {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.question-title {
  margin: 0;
  color: var(--text-on-light);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
  min-width: 200px;
}

.question-description {
  color: var(--terciary-dark);
  border: 1px solid #e9ecef;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  line-height: 1.6;
  font-style: italic;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  border-radius: 12px;
}

.type-badge {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  font-weight: 600;
  background-color: var(--add-btn);
  color: var(--text-on-add-btn);
  white-space: nowrap;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.status-active {
  color: var(--text-on-add-btn);
  background: var(--secondary-dark);
}

.status-inactive {
  color: var(--terciary-dark);
  background: #e4e2e2;
}

.options-section {
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
}

.options-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.options-icon {
  font-size: clamp(1rem, 1.5vw, 1.1rem);
}

.options-label {
  margin: 0;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  font-weight: 600;
  color: var(--terciary-dark);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.option-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--white);
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  font-size: clamp(0.8rem, 1.6vw, 0.9rem);
  color: var(--text-on-light);
  font-weight: 500;
  transition: all 0.2s ease;
}

.option-chip:hover {
  border-color: var(--primary);
  background: rgba(var(--primary), 0.02);
}

.option-bullet {
  color: var(--primary);
  font-weight: bold;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
}

.warning-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(var(--on-delete-btn), 0.05);
  border: 1px solid rgba(var(--on-delete-btn), 0.15);
  border-radius: 8px;
}

.warning-icon {
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.warning-text {
  margin: 0;
  color: var(--on-delete-btn);
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  font-weight: 500;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: clamp(0.8rem, 1.6vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  font-weight: 500;
}

.btn-text {
  white-space: nowrap;
}

/* Mantengo px en hover, media queries y tamaños específicos */
.btn-edit {
  background: var(--white);
  color: var(--on-edit-btn);
  border: 2px solid var(--on-edit-btn);
}

.btn-edit:hover {
  background: var(--on-edit-btn);
  color: var(--text-on-dark);
  transform: translateY(-1px);
}

.btn-delete {
  background: var(--white);
  color: var(--on-delete-btn);
  border: 2px solid var(--on-delete-btn);
}

.btn-delete:hover {
  background: var(--on-delete-btn);
  color: var(--text-on-dark);
  transform: translateY(-1px);
}

.btn-toggle {
  border: 2px solid var(--terciary-dark);
  background: #f8f9fa;
  color: var(--terciary-dark);
  border-color: #dee2e6;
}

.btn-toggle.btn-toggle-active {
  background: var(--white);
  color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.btn-toggle:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--terciary), 0.15);
}

.btn-toggle.btn-toggle-active:hover {
  background: var(--primary-dark);
  color: var(--text-on-dark);
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-body {
    flex-direction: column;
    padding: 1.25rem;
    gap: 1rem;
  }

  .drag-handle {
    align-self: center;
    width: 36px;
    height: 36px;
  }

  .question-title-container {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .question-title {
    font-size: 1.2rem;
    min-width: unset;
  }

  .type-badge {
    align-self: flex-start;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .actions-container {
    justify-content: center;
  }

  .actions {
    justify-content: center;
    width: 100%;
  }

  .btn {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }

  .btn-text {
    display: none;
  }

  .btn {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .card-body {
    padding: 1rem;
  }

  .question-title {
    font-size: 1.1rem;
  }

  .options-section {
    padding: 1rem;
  }

  .btn {
    padding: 0.625rem;
  }

  .btn-icon {
    width: 20px;
    height: 20px;
  }
}
</style>