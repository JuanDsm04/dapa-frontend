<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <NavBar v-show="!route.meta.hideNavbar" />
  <div :class="['content', { 'with-navbar': !route.meta.hideNavbar }]">
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