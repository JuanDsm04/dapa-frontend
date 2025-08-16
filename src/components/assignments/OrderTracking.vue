<script setup>
import OrderSteps from './OrderSteps.vue';
import ShippingInformation from './ShippingInformation.vue';
</script>

<template>
  <section class="tracking-container">
    <!-- Encabezado -->
    <header>
      <div class="header-information">
        <h2>Estado actual</h2>
        <p class="steps-info">
          1 - En camino a recoger la carga<br />
          2 - Carga recogida<br />
          3 - Envío completado
        </p>
      </div>

      <div class="header-button">
         <button class="form-btn">
          <span class="material-symbols-outlined">attach_file</span>
        </button>
      </div>
    </header>

    <!-- Etapas del tracking -->
    <OrderSteps />

    <!-- Información de envío -->
    <ShippingInformation :editable="false" />
  </section>
</template>

<style scoped>
.tracking-container {
  padding: 2rem;
  background-color: #fff;
}

header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.form-btn {
  padding: 0.6rem;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  color: #235dda;
  border: 1px solid #235dda;
  border-radius: 8px;
  background-color: white;
}

.form-btn:hover {
  background-color: #f9f9fc;
}

header h2 {
  font-weight: 600;
}

.steps-info {
  font-size: 0.9rem;
  color: #444;
  margin-top: 0.5rem;
  line-height: 1.4;
}
</style>
