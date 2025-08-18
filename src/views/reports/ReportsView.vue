<script setup>
import BigButton from '@/components/BigButton.vue';
import router from '@/router';

function goToControl() { }

function goToReport() {
  router.push("/reports/financial")
}

function goToPerformance() { }
</script>

<template>
  <main class="financial-main">
    <div class="btn-column">
      <BigButton
        title="Control financiero"
        description="Administra y visualiza el control de ingresos y egresos."
        image="/src/assets/images/finance-control.png"
        :onClick="goToControl"
      />
      <BigButton
        title="Reporte financiero"
        description="Consulta reportes detallados sobre el estado financiero."
        image="/src/assets/images/finance-report.png"
        :onClick="goToReport"
      />
      <BigButton
        title="Reporte de desempeño"
        description="Analiza el desempeño y resultados de actividades."
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
.btn-column {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
