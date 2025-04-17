<script setup>
import CarouselClients from '@/components/CarouselClients.vue';

const slides = [
  {
    src: new URL('@/assets/images/camion1.jpeg', import.meta.url).href,
    alt: 'Camión 1'
  },
  {
    src: new URL('@/assets/images/camion2.jpeg', import.meta.url).href,
    alt: 'Camión 2'
  },
  {
    src: new URL('@/assets/images/camion3.jpeg', import.meta.url).href,
    alt: 'Camión 3'
  }
]
</script>

<template>
  <main>
    <CarouselClients :slides="slides" />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
}
</style>
