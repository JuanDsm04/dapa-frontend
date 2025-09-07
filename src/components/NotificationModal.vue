<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <!-- Título -->
      <h2 class="modal-title">
        {{ title }}
      </h2>

      <!-- Mensaje -->
      <p class="modal-message">
        {{ message }}
      </p>

      <!-- Botones -->
      <div class="modal-actions">
        <button class="btn btn-cancel" @click="emit('close')">
          <span class="material-symbols-outlined md-icon">close</span> 
          {{ cancelText || 'Cancelar' }}
        </button>

        <button class="btn btn-confirm" @click="emit('confirm')">
          <span class="material-symbols-outlined md-icon">check</span>
          {{ confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo oscuro detrás del modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

/* Contenedor del modal */
.modal {
  background: #fff;
  border-radius: 0.75rem; /* 12px -> 0.75rem */
  box-shadow: 0 0.375rem 1.25rem rgba(0, 0, 0, 0.2); /* 6px 20px */
  padding: 1.5rem; /* 24px */
  width: 25rem; /* 400px */
  max-width: 90%;
  text-align: center;
}

/* Título */
.modal-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem; /* 12px */
  font-weight: 600;
}

/* Mensaje */
.modal-message {
  font-size: 0.9rem;
  color: var(--neutral-gray-600);
  margin-bottom: 1.875rem; /* 30px */
}

/* Contenedor de botones */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1.25rem; /* 20px */
  flex-wrap: wrap;
}

/* Estilos base para botones */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.625rem; /* 10px */
  cursor: pointer;
  color: var(--neutral-white);
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button span {
  margin-right: 0.5rem;
}

/* Botón cancelar */
.btn-cancel {
  background-color: var(--principal-error-400);
}
.btn-cancel:hover {
  background-color: var(--principal-error-hover);
  transform: translateY(-1px);
}

/* Botón confirmar */
.btn-confirm {
  background-color: var(--principal-secondary-300);
}
.btn-confirm:hover {
  background-color: var(--principal-secondary-400);
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .modal {
    width: 90%;
    padding: 1rem;
  }

  .modal-actions {
    gap: 0.75rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-message {
    font-size: 0.85rem;
  }
}
</style>
