<script setup lang="ts">
import { ref } from 'vue'
import OrderForm from './OrderForm.vue'

const props = defineProps<{
  editable?: boolean
}>()

const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <section class="shipment-info">
    <div class="info-box">
      <!-- Botón de acción solo si es editable -->
      <button v-if="props.editable" class="info-action" @click="openModal">
        <span class="material-symbols-outlined">edit</span>
      </button>

      <div class="info-item">
        <label>Precio</label>
        <p>Q 150.00</p>
      </div>
      <div class="info-item">
        <label>Tipo de carga</label>
        <p><strong>Empresarial</strong></p>
      </div>
      <div class="info-item">
        <label>Origen</label>
        <p><strong>31 Avenida H, 14 calle B, Colonia Santa María, Zona 11</strong></p>
      </div>
      <div class="info-item">
        <label>Destino</label>
        <p><strong>31 Avenida H, 14 calle B, Colonia Santa María, Zona 11</strong></p>
      </div>
      <div class="info-item full-width">
        <label>Detalles</label>
        <p><strong>Entrega urgente, manejar con cuidado</strong></p>
      </div>
    </div>
  </section>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article class="modal-content">
      <header class="modal-header">
        <h3>Editar Orden</h3>
        <button class="close-btn" @click="closeModal">✕</button>
      </header>

      <section>
        <OrderForm :isEdit="true" />
      </section>
    </article>
  </div>
</template>

<style scoped>
.shipment-info {
  margin-bottom: 2rem;
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem 1.5rem;
  position: relative;
}

.info-item label {
  font-size: 0.9rem;
  color: #666;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-action {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.info-action:hover {
  color: #2f67f6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--modal-bg);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input);
}

article header h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--close-btn);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--close-btn-hover);
}
</style>