<template>
  <div class="order-card">

    <div class="info">
      <div class="field">
        <label>Número de pedido</label>
        <p>#{{ order.id }}</p>
      </div>
      <div class="field">
        <label>Nombre</label>
        <p>{{ order.name || '----' }}</p>
      </div>
      <div class="field">
        <label>Fecha</label>
        <p>{{ order.date || '----' }}</p>
      </div>
    </div>

    <div class="image-container">
      <img src="../../assets/images/truck.png" alt="Pedido" />
    </div>

    <div v-if="status !== 'default'" class="overlay">
      <template v-if="status === 'available'">
        <button class="view-btn">Ver</button>
      </template>
      <template v-else-if="status === 'locked'">
        <div class="lock-icon">
          <span class="material-symbols-outlined">lock</span>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({ id: '', name: '', date: '' })
  },
  status: {
    type: String,
    default: 'default', // 'default' | 'available' | 'locked'
  }
})
</script>

<style scoped>
.order-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: white;
  max-width: 100%;
  overflow: hidden;
}

.order-card:hover {
  background-color: rgb(245, 245, 245);
}

.info {
  flex: 1;
}

.field {
  margin-bottom: 0.5rem;
}

label {
  font-size: 0.9rem;
  color: #666;
}

p {
  margin: 0;
  font-size: 1rem;
  color: #000;
}

.image-container {
  display: block;
  flex-shrink: 0;
  margin-left: 1rem;
}

.image-container img {
  width: 200px;
  object-fit: contain;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 50, 50, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-btn {
  background-color: #00b05b;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.lock-icon .material-symbols-outlined {
    font-size: 48px;
    color: white;
}

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}
</style>