<script setup>
defineProps({
  quote: {
    type: Object,
    required: true,
    default: () => ({ id: '', date: '' })
  }
})
</script>

<template>
  <div class="quote-card">

    <!-- Información de la cotización -->
    <div class="info">
      <div class="field">
        <label>Número de formulario</label>
        <p>#{{ quote.id }}</p>
      </div>
      <div class="field">
        <label>Fecha</label>
        <p>{{ quote.date || '----' }}</p>
      </div>
    </div>

    <div class="image-container">
      <img src="../../assets/images/package.png" alt="Cotización" />
    </div>

  </div>
</template>

<style scoped>
.quote-card {
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

.quote-card:hover {
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
  width: 100px;
  object-fit: contain;
}

@media (max-width: 1500px) {
  .image-container {
    display: none;
  }
}
</style>
