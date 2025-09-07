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
  background-color: var(--gradient-black);
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
  width: 9.375rem;
  height: auto;
  margin-bottom: 0.9375rem;
}

.carousel-overlay nav button {
  background-color: var(--principal-tertiary);
  border: none;
  padding: 0.625rem 1.25rem;
  text-align: center;
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.5625rem);
  cursor: pointer;
  border-radius: 5px;
}

.carousel-overlay nav button:hover {
  background-color: var(--principal-tertiary-hover);
}

.logo-img {
  width: 9.375rem;
  height: auto;
  margin-bottom: 0.9375rem;
}

h1 {
  color: var(--neutral-white);
  font-size: clamp(3rem, 5vw + 2rem, 5rem);
  margin-bottom: 0.625rem;
  font-weight: bold;
}

p {
  color: var(--neutral-white);
  font-size: clamp(1.875rem, 3vw + 1rem, 2.5rem);
  margin-bottom: 1.875rem;
}

@media (max-width: 770px) {
  .carousel-overlay nav button {
    font-size: clamp(1rem, 2vw + 0.5rem, 1.125rem);
    padding: 0.5rem 1rem;
  }

  .logo-img {
    width: 6.25rem;
  }

  h1 {
    font-size: clamp(2rem, 4vw + 1rem, 2.5rem);
  }

  p {
    font-size: clamp(1rem, 2vw + 0.5rem, 1.25rem);
  }
}
</style>

