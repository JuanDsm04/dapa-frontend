<script setup>
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import LineChart from '@/components/charts/LineChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import KpiCard from '@/components/charts/KpiCard.vue';
import DriversTable from '@/components/Table.vue'
import { ref } from 'vue';
const activeTab = ref('left')
const selectedMonth = ref<String>('Diciembre 2024')

// Temporary dummy data
const linealData = ref({
  series: [
    { name: 'Cotizaciones', data: [20, 40, 35, 48] },
  ],
  categories: ['Diciembre 2024', 'Enero 2025', 'Febrero 2025', 'Marzo 2025'],
  title: 'Cotizaciones completadas'
})

const pieData = ref({
  series: [50, 6.3, 12.5, 31.3],
  labels: ['Completadas', 'Pendientes', 'Aprobadas', 'En progreso'],
  title: 'Cotizaciones 2025'
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
    <header class="header">
      <h1>Reporte de desempeño</h1>
      <select v-model="selectedMonth" class="month-select">
        <option v-for="(month, index) in linealData.categories" :key="index" :value="month">
          {{ month }}
        </option>
      </select>
    </header>

    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Cotizaciones</div>
      <div class="toggle-button" @click="activeTab = 'right'">Empleados</div>
    </div>

    <KpiCard title="Cotizaciones completadas" :icon="ClipboardDocumentCheckIcon" value=57 last-month=71 goal=80 />
    <KpiCard title="Utilidad" :icon="ChartBarIcon" value=5342 last-month=4971 goal=5000 />

    <section class="quotes" v-if="activeTab == 'left'">
      <div class="charts-wrapper">
        <LineChart :categories="linealData.categories" :series="linealData.series" :title="linealData.title"/>
        <CircularChart :labels="pieData.labels" :series="pieData.series" :title="pieData.title"/>
      </div>
    </section>
    <section class="employees" v-if="activeTab == 'right'">
      <div class="charts-wrapper">
        <BarChart :categories="financialBarData.categories" :series="financialBarData.series" :title="financialBarData.title"/>
        <PieChart :labels="financialPieData.labels" :series="financialPieData.series" :title="financialPieData.title"/>
      </div>
    </section>
    <div class="table-wrapper">
      <DriversTable 
        :items="[]"
        :columns="[
          { label: 'Conductor', field: 'driver' },
          { label: 'Viajes completados', field: 'completedOrders' },
          { label: 'Entregas semanales', field: 'avgWeeklyOrders' },
          { label: 'Calificación', field: 'score' },
        ]"
        @edit="() => {}"
        @delete="() => {}"
      />
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

.month-select {
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  background: white;
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
  margin-top: 2rem;
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
  margin-top: 2rem;
  flex-wrap: wrap;
}
</style>
