<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
})

const currentSlide = ref(0)

onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % props.slides.length
  }, 4000)
})
</script>

<template>
  <div class="carousel">
    <div class="carousel-img-container">
      <img
        :src="props.slides[currentSlide].src"
        :alt="props.slides[currentSlide].alt"
        class="carousel-img"
      />
      <!-- Este overlay oscurece solo la imagen -->
      <div class="carousel-shadow"></div>
    </div>
    <div class="carousel-overlay">
      <img src="@/assets/images/logo_2.png" alt="Logo adicional" class="overlay-img" />
      <h1>De aquí para allá</h1>
      <h3>Mudanzas, fletes y traslados</h3>
      <button @click="() => console.log('Ordenar')">Cotizar</button>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.carousel-img-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.carousel-overlay {
  position: absolute;
  z-index: 2; /* Por encima de la imagen + sombra */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.overlay-img {
  width: 70px; 
  height: auto;
  margin-bottom: 10px; 
}

.carousel-overlay h1 {
  font-size: 2.5rem;
  margin-bottom: 0.2rem;
  font-weight: bold;
}

.carousel-overlay h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.carousel-overlay button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background-color: #FFB601;
  color: #000000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.carousel-overlay button:hover {
  background-color: #FFB601;
}
</style>
