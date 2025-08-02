<script setup>
import BigButton from '@/components/BigButton.vue'

function goToControl() {
  // router.push('/financial-control') o acción deseada
}
function goToReport() {
  // router.push('/financial-report') o acción deseada
}
function goToPerformance() {
  // router.push('/performance-report') o acción deseada
}
</script>

<template>
  <main class="financial-main">
    <div class="btn-row">
      <BigButton
        title="Control financiero"
        image="/src/assets/images/finance-control.png"
        :onClick="goToControl"
      />
      <BigButton
        title="Reporte financiero"
        image="/src/assets/images/finance-report.png"
        :onClick="goToReport"
      />
      <BigButton
        title="Reporte de desempeño"
        image="/src/assets/images/performance.png"
        :onClick="goToPerformance"
      />
    </div>
  </main>
</template>

<style scoped>
.financial-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.btn-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}
</style>
