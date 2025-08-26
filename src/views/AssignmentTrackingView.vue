<script setup lang="ts">
import OrderSteps from '@/components/assignments/OrderSteps.vue';

</script>

<template>
  <main>
    <header>
      <div>
        <h1>De aquí para allá</h1>
        <span>Mudanzas, fletes y translados</span>
      </div>
      <img src="@/assets/images/logo_2.png" alt="Company logo" class="logo">
    </header>
    <section class="info">
      <h2>Flete #ABCD123</h2>
      <p>Consulta el estado actual de tu carga. Recuerda que puedes comunicarte con nosotros para resolver tus dudas.</p>
      <h3>Estado actual</h3>
      <p class="steps-info">
        1 - En camino a recoger la carga<br />
        2 - Carga recogida<br />
        3 - Envío completado<br />
      </p>
      <OrderSteps />
      <div class="info-box">
        <div class="info-item">
          <label>Conductor</label>
          <p>Gerardo Gómez</p>
        </div>
        <div class="info-item">
          <label>Vehículo</label>
          <p>Honda 3B - PEX909</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
  main {
    width: 100%;
    padding: 3rem;
    background-color: var(--bg-general);
    min-height: 100vh;
  }

  header {
    background-color: white;
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  h1, h2, h3 {
    font-weight: 600;
  }

  h2, h3 {
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    margin-top: 2rem;
  }

  header img {
    width: 150px;
    height: auto;
  }

  .info {
    background-color: white;
    padding: 2rem 3rem;
  }

  .info-box {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .info-item label {
    font-size: 0.9rem;
    color: #666;
  }

  .info-item p {
    margin: 0;
    font-size: 1rem;
  }

</style>
