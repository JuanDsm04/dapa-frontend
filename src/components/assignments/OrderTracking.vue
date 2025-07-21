<script setup>
import OrderSteps from './OrderSteps.vue';
</script>

<template>
  <main class="tracking-container">
    <!-- Título -->
    <header>
      <h2>Estado actual</h2>
      <p class="steps-info">
        1 - En camino a recoger la carga<br />
        2 - Carga recogida<br />
        3 - En camino al destino<br />
        4 - Envío completado
      </p>
    </header>

    <!-- Etapas del tracking -->
    <OrderSteps />

    <!-- Información de envío -->
    <section class="shipment-info">
      <div class="info-box">
        <div class="info-item">
          <label>Conductor</label>
          <p>Gerardo Gómez</p>
        </div>
        <div class="info-item">
          <label>Vehículo</label>
          <p>Honda 3B - PEX909</p>
        </div>
        <div class="info-item">
          <label>Precio</label>
          <p>Q 150.00</p>
        </div>
        <div class="info-item">
          <label>Tipo de carga</label>
          <p><strong>Empresarial</strong></p>
        </div>
      </div>
    </section>

    <!-- Comentario adicional -->
    <article class="extra-comment">
      <label>Comentario adicional</label>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </article>
  </main>
</template>

<style scoped>
.tracking-container {
  padding: 2rem;
  background-color: #fff;
}

header {
  margin-bottom: 1rem;
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

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
}

.step.active {
  color: #2f67f6;
}

.icon {
  background-color: #ccc;
  border-radius: 50%;
  padding: 0.8rem;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.step.active .icon {
  background-color: #2f67f6;
}

.shipment-info {
  margin-bottom: 2rem;
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.line {
  height: 4px;
  background-color: #ccc;
  flex: 1;
  margin: -25px 8px 0 8px;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.line.active {
  background-color: #2f67f6;
}

.steps {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
  min-width: 40px;
}

.step.active {
  color: #2f67f6;
}

.step .icon {
  background-color: #ccc;
  border-radius: 50%;
  padding: 0.8rem;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.step.active .icon {
  background-color: #2f67f6;
}

@media (max-width: 770px) {
  .info-box {
    grid-template-columns: 1fr;
  }
}

.info-item label {
  font-size: 0.9rem;
  color: #666;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.extra-comment {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
}

.extra-comment label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.extra-comment p {
  margin: 0;
  line-height: 1.5;
}
</style>
