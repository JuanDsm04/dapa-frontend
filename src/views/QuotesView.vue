<script setup>
  import VerticalNav from '@/components/NavBar.vue';
</script>

<template>
  <div class="layout">
    <VerticalNav />
    <main class="main-content">
      <header>
        <h1>Cotizaciones</h1>
      </header>
    </main>
  </div>
</template>

<style scoped>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    margin-left: 80px; 
    padding: 16px;
    flex: 1;
  }
</style>
