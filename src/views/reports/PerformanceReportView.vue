<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import KpiCard from '@/components/charts/KpiCard.vue';
import DriversTable from '@/components/Table.vue'
import { ref, onMounted, watch } from 'vue';
import { getCurrentKPIs, getDriversParticipationChart, getDriversReport, getKPIGoals, getPerformanceChart, getQuotationsPerMonth, getQuotationsPerStatus, updatePerformanceGoal } from '@/services/performanceReportService';
import type { DriverReport, GraphData } from '@/types/reports';

const activeTab = ref('left')
const selectedMonth = ref<String>('Diciembre 2024')
const driverReports = ref<DriverReport[]>([]);
const quotationsPerMonth = ref<GraphData>();
const quotationsPerStatus = ref<GraphData>();
const driversPerformanceChart = ref<GraphData>();
const driversDriversParticipationChart = ref<GraphData>();

const ordersCompletedCurrently = ref(0);
const ordersCompletedGoal = ref(0);

const utilityCurrent = ref(0);
const utilityGoal = ref(0);

const avgOrderAmountCurrent = ref(0);
const avgOrderAmountGoal = ref(0);

const tripsCompletedCurrently = ref(0);
const tripsCompletedGoal = ref(0);

const deliveriesPerEmployeeCurrent = ref(0);
const deliveriesPerEmployeeGoal = ref(0);

const fulfillmentRateCurrent = ref(0);
const fulfillmentRateGoal = ref(0);

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
    { name: 'Tasa de cumplimiento', data: [92, 88, 95] },
  ],
  categories: ['Ene', 'Feb', 'Mar'],
})

const driversPieData = ref({
  series: [400, 350, 300, 230],
  labels: ['Conductor A', 'Conductor B', 'Conductor C', 'Conductor D'],
  title: 'Participación en Viajes'
})

const saveAllGoals = async () => {
  try {
    const payload = {
      orderGoal: ordersCompletedGoal.value,
      utilityGoal: utilityGoal.value,
      averagePerOrderGoal: avgOrderAmountGoal.value,
      travelGoal: tripsCompletedGoal.value,
      deliveryGoal: deliveriesPerEmployeeGoal.value,
      achievementRateGoal: fulfillmentRateGoal.value,
    }

    await updatePerformanceGoal(payload)
    console.log('Performance goals updated successfully')
  } catch (error) {
    console.error('Error updating performance goals:', error)
  }
}

watch(
  [
    ordersCompletedGoal,
    utilityGoal,
    avgOrderAmountGoal,
    tripsCompletedGoal,
    deliveriesPerEmployeeGoal,
    fulfillmentRateGoal
  ],
  async () => {
    await saveAllGoals()
  }
)

onMounted(async () => {
  try {
    const response = await getCurrentKPIs();
    ordersCompletedCurrently.value = response.data.deliveredOrders
    utilityCurrent.value = response.data.utility
    avgOrderAmountCurrent.value = response.data.averagePerOrder
    tripsCompletedCurrently.value = response.data.completedTrips
    deliveriesPerEmployeeCurrent.value = response.data.deliveredOrders
    fulfillmentRateCurrent.value = response.data.fulfillmentRate

  } catch (error) {
    console.error('Error fetching KPI:', error);
  }

  try {
    const response = await getKPIGoals();
    ordersCompletedGoal.value = response.data.orderGoal
    utilityGoal.value = response.data.utilityGoal
    avgOrderAmountGoal.value = response.data.averagePerOrderGoal
    tripsCompletedGoal.value = response.data.travelGoal
    deliveriesPerEmployeeGoal.value = response.data.deliveryGoal
    fulfillmentRateGoal.value = response.data.achievementRateGoal

  } catch (error) {
    console.error('Error fetching KPI:', error);
  }
  try {
    const response = await getDriversReport();
    driverReports.value = response.data
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }

  try {
    const response = await getQuotationsPerMonth()
    quotationsPerMonth.value = response.data
  } catch (error) {
    console.error('Error fetching quotations per month:', error)
  }

  try {
    const response = await getQuotationsPerStatus()
    quotationsPerStatus.value = response.data
  } catch (error) {
    console.error('Error fetching quotations per status:', error)
  }

  try {
    const response = await getPerformanceChart()
    driversPerformanceChart.value = response.data
  } catch (error) {
    console.error('Error fetching drivers performance chart:', error)
  }

  try {
    const response = await getDriversParticipationChart()
    driversDriversParticipationChart.value = response.data
  } catch (error) {
    console.error('Error fetching drivers participation chart:', error)
  }
});

</script>

<template>
  <main>
    <header>
      <button class="btn-back" @click="$router.back()">
        <span class="material-symbols-outlined md-icon">arrow_back</span>
      </button>
      <h1>Reporte de desempeño</h1>
    </header>
    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Cotizaciones</div>
      <div class="toggle-button" @click="activeTab = 'right'">Empleados</div>
    </div>

    <h2>Indicadores clave de desempeño (KPI)</h2>
    <div class="kpi-wrapper" v-if="activeTab == 'left'">
      <KpiCard class="kpi" title="Ordenes completadas" :value="ordersCompletedCurrently" v-model:goal="ordersCompletedGoal" />
      <KpiCard class="kpi" title="Utilidad (Q)" :value="utilityCurrent" v-model:goal="utilityGoal" />
      <KpiCard class="kpi" title="Monto promedio por orden (Q)" :value="avgOrderAmountCurrent" v-model:goal="avgOrderAmountGoal" />
    </div>
    <div class="kpi-wrapper" v-if="activeTab == 'right'">
      <KpiCard class="kpi" title="Viajes completados" :value="tripsCompletedCurrently" v-model:goal="tripsCompletedGoal" />
      <KpiCard class="kpi" title="Entregas por empleado" :value="deliveriesPerEmployeeCurrent" v-model:goal="deliveriesPerEmployeeGoal" />
      <KpiCard class="kpi" title="Tasa de cumplimiento (%)" :value="fulfillmentRateCurrent" v-model:goal="fulfillmentRateGoal" 
    />
    </div>

    <section class="stats-header">
      <h2>Resumen estadístico</h2>
      <select v-model="selectedMonth" class="month-select">
        <option v-for="(month, index) in quotationsPerMonth?.categories" :key="index" :value="month">
          {{ month }}
        </option>
      </select>
    </section>
    <section class="quotes" v-if="activeTab == 'left'">
      <div class="charts-wrapper">
        <LineChart :categories="quotationsPerMonth?.categories" :series="quotationsPerMonth?.series" :title="'Cotizaciones completadas'"/>
        <CircularChart :labels="quotationsPerStatus?.categories" :series="quotationsPerStatus?.series" :title="'Estados de cotizaciones'"/>
      </div>
    </section>
    <section class="employees" v-if="activeTab == 'right'">
      <div class="charts-wrapper">
        <BarChart :categories="driversPerformanceChart?.categories" :series="driversPerformanceChart?.series" :title="'Desempeño de conductores'"/>
        <PieChart :labels="driversDriversParticipationChart?.categories" :series="driversDriversParticipationChart?.series" :title="'Participación en pedidos'"/>
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
        :viewOnly="true"
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
  background-color: var(--bg-general);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

main header {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 2rem;
}

.month-select {
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid var(--neutral-gray-100);
  background: var(--neutral-white);
}

h1 {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
}

h2 {
  font-weight: 600;
  margin: 0;
}

.toggle-wrapper {
  display: flex;
  background-color: var(--neutral-gray-200);
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
  background-color: var(--neutral-white);
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

.btn-back{
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  padding: 0.75rem;
  background: none;
  cursor: pointer;
}

.btn-back:hover{
  background-color: var(--neutral-gray-200);
}

.btn-back:active{
  background-color: var(--neutral-gray-300);
}

@media (max-width: 770px) {
  main {
    width: 100%;
    margin-left: 0;
    padding: 2rem 1rem;
  }
  
  main header {
    margin-top: 3rem;
    gap: 1rem;
    align-items: stretch;
    align-items: center;
  }

   h1 {
    margin: 0;
    text-align: center;
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1rem;
  }

  .kpi {
    width: 100%;
    min-width: 100%;
  }

  .charts-wrapper {
    display: flex;
    flex-direction: column;
  }

  .toggle-wrapper{
    align-self: center;
  }
}
</style>
