<script setup>
import BigButton from '@/components/BigButton.vue';
import router from '@/router';

function goToControl() { 
  router.push('/reports/financial_control')
}

function goToReport() {
  router.push('/reports/financial')
}

function goToPerformance() { 
  router.push('/reports/performance')
}
</script>

<template>
  <main class="financial-main">
    <div class="btn-container">
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
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
}

.btn-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

/* A partir de tablets, los botones se muestran en fila */
@media (min-width: 768px) {
  .btn-container {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 32px;
    justify-content: center;
  }

  .financial-main{
    padding: 1.25rem;
  }
}
</style>
