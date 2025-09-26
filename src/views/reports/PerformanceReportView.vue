<script setup lang="ts">
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/vue/24/outline';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import { TruckIcon } from '@heroicons/vue/24/outline';
import { BeakerIcon } from '@heroicons/vue/24/outline';
import LineChart from '@/components/charts/LineChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import KpiCard from '@/components/charts/KpiCard.vue';
import DriversTable from '@/components/Table.vue'
import { ref, onMounted } from 'vue';
import { getDriversReport } from '@/services/reportService';
import type { DriverReport } from '@/types/reports';

const activeTab = ref('left')
const selectedMonth = ref<String>('Diciembre 2024')
const driverReports = ref<DriverReport[]>([]);

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

const driversBarData = ref({
  series: [
    { name: 'Viajes completados', data: [52, 23, 42] },
    { name: 'Calificación global (promedio)', data: [92, 88, 95] },
    { name: 'Eficiencia combustible (km/L)', data: [3.1, 3.3, 3.2] }
  ],
  categories: ['Ene', 'Feb', 'Mar'],
  title: 'Desempeño de Conductores'
})

const driversPieData = ref({
  series: [400, 350, 300, 230],
  labels: ['Conductor A', 'Conductor B', 'Conductor C', 'Conductor D'],
  title: 'Participación en Viajes'
})

onMounted(async () => {
  try {
    const response = await getDriversReport();
    driverReports.value = response.data
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }
});

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

    <h2>Indicadores clave de desempeño (KPI)</h2>
    <div class="kpi-wrapper" v-if="activeTab == 'left'">
      <KpiCard class="kpi" title="Ordenes completadas" :icon="ClipboardDocumentCheckIcon" value=57 last-month=71 goal=80 />
      <KpiCard class="kpi" title="Utilidad (Q)" :icon="ChartBarIcon" value=5342 last-month=4971 goal=5000 />
      <KpiCard class="kpi" title="Monto promedio por orden (Q)" :icon="ClipboardDocumentListIcon" value=345 last-month=245 goal=500 />
    </div>
    <div class="kpi-wrapper" v-if="activeTab == 'right'">
      <KpiCard class="kpi" title="Viajes completados" :icon="TruckIcon" value=112 last-month=100 goal=150 />
      <KpiCard class="kpi" title="Calificación global (%)" :icon="ChartBarIcon" value=92 last-month=93 goal=95 />
      <KpiCard class="kpi" title="Eficiencia global de combustible (L/km)" :icon="BeakerIcon" value=2.5 last-month=2.5 goal=2.5 />
    </div>

    <section class="stats-header">
      <h2>Resumen estadístico</h2>
      <select v-model="selectedMonth" class="month-select">
        <option v-for="(month, index) in linealData.categories" :key="index" :value="month">
          {{ month }}
        </option>
      </select>
    </section>
    <section class="quotes" v-if="activeTab == 'left'">
      <div class="charts-wrapper">
        <LineChart :categories="linealData.categories" :series="linealData.series" :title="linealData.title"/>
        <CircularChart :labels="pieData.labels" :series="pieData.series" :title="pieData.title"/>
      </div>
    </section>
    <section class="employees" v-if="activeTab == 'right'">
      <div class="charts-wrapper">
        <BarChart :categories="driversBarData.categories" :series="driversBarData.series" :title="driversBarData.title"/>
        <PieChart :labels="driversPieData.labels" :series="driversPieData.series" :title="driversPieData.title"/>
      </div>
    </section>
    <div class="table-wrapper">
      <DriversTable v-if="activeTab === 'right'"
        :items="driverReports"
        :columns="[
          { label: 'Conductor', field: 'driverName' },
          { label: 'Viajes completados', field: 'totalOrders' },
          { label: 'Entregas semanales', field: 'ordersPerWeek' },
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-select {
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  background: white;
}

h1, h2 {
  font-weight: 600;
  margin: 0;
}

.toggle-wrapper {
  display: flex;
  background-color: #EAEEF4;
  border-radius: 10px;
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 60px;
  padding: 6px;
  font-family: sans-serif;
  font-weight: bold;
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

.stats-header {
  display: flex;
  justify-content: space-between;
}

.kpi-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.kpi {
  min-width: 430px;
}

.charts-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 700px) {
  main {
    width: 100%;
    margin-left: 0;
    padding: 2rem 1rem;
  }
  
  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  h1 {
    margin-top: 10px;
    margin-left: 50px;
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
    align-self: center;
  }

  .kpi {
    width: 100%;
    min-width: 100%;
  }

  .charts-wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>
