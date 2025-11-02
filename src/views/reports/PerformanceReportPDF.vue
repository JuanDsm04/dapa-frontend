<script setup lang="ts">
import { ref } from 'vue'
import DriversTable from '@/components/Table.vue'
import type { DriverReport, GraphData } from '@/types/reports'
import KpiCard from '@/components/charts/KpiCard.vue';
import LineChart from '@/components/charts/LineChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import logo from '@/assets/images/logo_1.png'

defineProps<{
  ordersCompleted: number
  ordersCompletedGoal: number
  utility: number
  utilityGoal: number
  avgOrderAmount: number
  avgOrderAmountGoal: number
  tripsCompleted: number
  tripsCompletedGoal: number
  deliveriesPerEmployee: number
  deliveriesPerEmployeeGoal: number
  fulfillmentRate: number
  fulfillmentRateGoal: number
  quotationsPerMonth?: GraphData
  quotationsPerStatus?: GraphData
  driversPerformance?: GraphData
  driversParticipation?: GraphData
  driverReports: DriverReport[]
}>()

const currentDate = ref(new Date().toLocaleDateString('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}))
const currentTime = ref(new Date().toLocaleTimeString('es-ES'))
</script>

<template>
  <div class="report-container">
    <header class="report-header">
      <div class="date-time">
        <p>Generado el: {{ currentDate }}</p>
        <p>Hora: {{ currentTime }}</p>
      </div>
      <div class="logo">
        <img :src="logo" alt="Logo" />
      </div>
    </header>

    <h1 class="report-title">REPORTE DE DESEMPEÑO</h1>

    <section class="report-section">
      <h2 class="section-title">INDICADORES CLAVE DE DESEMPEÑO (KPI) - COTIZACIONES</h2>
      <div class="kpi-grid">
        <KpiCard
          title="Ordenes completadas" 
          :value="ordersCompleted" 
          :goal="ordersCompletedGoal"
          :readonly="true"
        />
        <KpiCard 
          title="Utilidad (Q)" 
          :value="utility" 
          :goal="utilityGoal"
          :readonly="true"
        />
        <KpiCard 
          title="Monto promedio por orden (Q)" 
          :value="avgOrderAmount" 
          :goal="avgOrderAmountGoal"
          :readonly="true"
        />
      </div>
    </section>

    <section class="report-section">
      <h2 class="section-title">INDICADORES CLAVE DE DESEMPEÑO (KPI) - EMPLEADOS</h2>
      <div class="kpi-grid">
        <KpiCard
          title="Viajes completados" 
          :value="tripsCompleted" 
          :goal="tripsCompletedGoal"
          :readonly="true"
        />
        <KpiCard 
          title="Entregas por empleado" 
          :value="deliveriesPerEmployee" 
          :goal="deliveriesPerEmployeeGoal"
          :readonly="true"
        />
        <KpiCard 
          title="Tasa de cumplimiento (%)" 
          :value="fulfillmentRate" 
          :goal="fulfillmentRateGoal"
          :readonly="true"
        />
      </div>
    </section>

    <section class="report-section">
      <h2 class="section-title">RESUMEN ESTADÍSTICO - COTIZACIONES</h2>
      <div class="charts-grid">
        <div class="chart-container">
          <div v-if="quotationsPerMonth && quotationsPerMonth.series && quotationsPerMonth.series.length > 0">
            <LineChart
              :categories="quotationsPerMonth?.categories ?? []" 
              :series="quotationsPerMonth?.series ?? []" 
              title="Cotizaciones completadas"
            />
          </div>
        </div>
        <div class="chart-container">
          <div v-if="quotationsPerStatus && quotationsPerStatus.series && quotationsPerStatus.series.length > 0">
            <CircularChart
              :labels="quotationsPerStatus?.categories ?? []" 
              :series="quotationsPerStatus?.series ?? []" 
              title="Estados de cotizaciones"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="report-section">
      <h2 class="section-title">RESUMEN ESTADÍSTICO - EMPLEADOS</h2>
      <div class="charts-grid">
        <div class="chart-container">
          <div v-if="driversPerformance && driversPerformance.series && driversPerformance.series.length > 0">
            <BarChart
              :categories="driversPerformance?.categories ?? []" 
              :series="driversPerformance?.series ?? []" 
              title="Desempeño de conductores"
            />
          </div>
        </div>
        <div class="chart-container">
          <div v-if="driversParticipation && driversParticipation.series && driversParticipation.series.length > 0">
            <PieChart
              :labels="driversParticipation?.categories ?? []" 
              :series="driversParticipation?.series ?? []" 
              title="Participación en pedidos"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="report-section">
      <h2 class="section-title">TABLA DE CONDUCTORES</h2>
      <DriversTable
        :items="driverReports"
        :columns="[
          { label: 'Conductor', field: 'driverName' },
          { label: 'Viajes completados', field: 'totalOrders' },
          { label: 'Entregas semanales', field: 'ordersPerWeek' },
        ]"
        :viewOnly="true"
        :options="{ searching: false, paging: false, info: false, dom: 't' }"
      />
    </section>
  </div>
</template>

<style scoped>
.report-container {
  padding: 40px;
  background: white;
  color: #333;
  font-family: Arial, sans-serif;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
}

.date-time p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.logo img {
  max-height: 60px;
}

.report-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin: 30px 0;
  color: #333;
}

.report-section {
  margin: 40px 0;
  page-break-inside: avoid;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 20px 0;
}

.chart-container {
  min-height: 300px;
  page-break-inside: avoid;
}

@media print {
  .report-container {
    padding: 20px;
  }
  
  .report-section {
    page-break-inside: avoid;
  }
}
</style>
