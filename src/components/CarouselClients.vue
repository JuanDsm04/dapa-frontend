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
      <img src="@/assets/images/logo_2.png" alt="Company logo" class="logo-img">
      <h1>De aquí para allá</h1>
      <p>Mudanzas, fletes y traslados</p>
      <nav>
          <button @click="$router.push('/#')">Cotizar</button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
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
  width: 150px;
  height: auto;
  margin-bottom: 15px;
}

.carousel-overlay nav button {
  background-color: #FFB601;
  border: none;
  padding: 10px 20px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
  border-radius: 5px;
}

.carousel-overlay nav button:hover {
  background-color: #FFB601;
}

.logo-img {
  width: 150px;
  height: auto;
  margin-bottom: 15px;
}

h1 {
  color: white;
  font-size: 80px;
  margin-bottom: 10px;
  font-weight: bold;
}

p {
  color: white;
  font-size: 40px;
  margin-bottom: 30px;
}
</style>
