<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'

type Slide = {
  src: string
  alt: string
}

const props = defineProps<{
  slides: Slide[]
}>()

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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .carousel-overlay {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    background-color: var(--primary);
    border: none;
    padding: 10px 20px;
    text-align: center;
    font-size: 25px;
    cursor: pointer;
    border-radius: 5px;
  }

  .carousel-overlay nav button:hover {
    background-color: var(--primary-dark);
  }

  .logo-img {
    width: 150px;
    height: auto;
    margin-bottom: 15px;
  }

  h1 {
    color: var(--text-on-dark);
    font-size: 80px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  p {
    color: var(--text-on-dark);
    font-size: 40px;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    .carousel-overlay nav button {
      font-size: 20px;
    }

    .logo-img {
      width: 100px;
    }

    h1 {
      font-size: 40px;
    }

    p {
      font-size: 20px;
    }

    .carousel-overlay nav button {
      font-size: 18px;
      padding: 8px 16px;
    }
  }
</style>
