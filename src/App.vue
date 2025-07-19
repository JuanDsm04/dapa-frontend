<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { computed } from 'vue'

const route = useRoute()
const showNavbar = computed(() => !route.meta.hideNavbar)
</script>

<template>
  <NavBar v-if="showNavbar" />
  <div :class="['content', { 'with-navbar': showNavbar }]">
    <RouterView />
  </div>
</template>

<style scoped>
  .content {
    padding-left: 0;
  }

  .with-navbar {
    padding-left: 80px;
  }

  @media (max-width: 770px) {
    .with-navbar {
      padding-left: 0;
    }
  }
</style>