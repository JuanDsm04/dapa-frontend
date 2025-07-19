<template>
  <div class="order-card">
    <div class="info">
      <div class="field">
        <label>Número de pedido</label>
        <p>#{{ order.id }}</p>
      </div>
      <div class="field">
        <label>Nombre</label>
        <p>{{ order.name }}</p>
      </div>
      <div class="field">
        <label>Fecha</label>
        <p>{{ order.date }}</p>
      </div>
    </div>
    <div class="image-container">
      <img src="../../assets/images/truck.png" alt="Pedido" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({ id: '', name: '', date: '' })
  }
})
</script>

<style scoped>
.order-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: white;
  max-width: 100%;
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

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}
</style>