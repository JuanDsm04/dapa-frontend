<script setup>
import LineChart from '@/components/charts/LineChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import { ref } from 'vue';
const activeTab = ref('left')
// Temporary dummy data
const data = ref({
  series: [
    { name: 'Transportista A', data: [95, 90, 92] },
    { name: 'Transportista B', data: [88, 85, 87] },
    { name: 'Transportista C', data: [92, 94, 91] }
  ],
  categories: ['Ene', 'Feb', 'Mar'],
  title: 'Desempeño de empleados'
})

const pieData = ref({
  series: [44, 55, 13, 43, 22],
  labels: ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E'],
  title: 'Distribución de carga de trabajo'
})

const financialBarData = ref({
  series: [
    { name: 'Ingresos', data: [120, 150, 180] },
    { name: 'Egresos', data: [80, 90, 100] }
  ],
  categories: ['Ene', 'Feb', 'Mar'],
  title: 'Resumen Financiero'
})

const financialPieData = ref({
  series: [30, 40, 20, 10],
  labels: ['Transporte', 'Almacenamiento', 'Logística', 'Otros'],
  title: 'Distribución de Costos'
})
</script>

<template>
  <main>
    <header>
      <h1>Reporte de desempeño</h1>
    </header>

    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Cotizaciones</div>
      <div class="toggle-button" @click="activeTab = 'right'">Empleados</div>
    </div>

    <div class="charts-wrapper">
      <LineChart :categories="data.categories" :series="data.series" :title="data.title"/>
      <CircularChart :labels="pieData.labels" :series="pieData.series" :title="pieData.title"/>
      <BarChart :categories="financialBarData.categories" :series="financialBarData.series" :title="financialBarData.title"/>
      <PieChart :labels="financialPieData.labels" :series="financialPieData.series" :title="financialPieData.title"/>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general, #fff);
  min-height: 100vh;
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
}

.toggle-wrapper {
  display: flex;
  background-color: #EAEEF4;
  border-radius: 10px;
  position: relative;
  width: 300px;
  height: 60px;
  padding: 6px;
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 2rem;
}

.toggle-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background-color: white;
  border-radius: 10px;
  transition: all 0.3s ease;
  z-index: 1;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
}

.active-left .toggle-indicator {
  left: 6px;
}

.active-right .toggle-indicator {
  left: 50%;
}

.charts-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
</style>
