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
          <span class="material-symbols-outlined">close</span> 
          {{ cancelText || 'Cancelar' }}
        </button>

        <button class="btn btn-confirm" @click="emit('confirm')">
          <span class="material-symbols-outlined">check</span>
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
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  padding: 24px;
  width: 400px;
  max-width: 90%;
  text-align: center;
}

/* Título */
.modal-title {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

/* Mensaje */
.modal-message {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 30px;
}

/* Contenedor de botones */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

/* Estilos base para botones */
.btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: white;
}

button span {
    margin-right: 0.5rem;
}

/* Botón cancelar */
.btn-cancel {
 background-color: #ff5a70;
}
.btn-cancel:hover {
  background-color: #f0566a;
}

/* Botón confirmar */
.btn-confirm {
  background-color: #53d86c;
}
.btn-confirm:hover {
  background-color: #53cd69;
}
</style>
