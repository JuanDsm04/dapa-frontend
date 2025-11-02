<script setup lang="ts">
import BarChart from '@/components/charts/BarChart.vue'
import CircularChart from '@/components/charts/CircularChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import TotalesFinancieros from '@/components/reports/FinancialTotal.vue'
import FinanceTable from '@/components/Table.vue'
import type { GraphData, Income } from '@/types/reports'
import { ref } from 'vue'
import logo from '@/assets/images/logo_1.png'

defineProps<{
  incomeSources: Income[]
  totalIncome: number
  incomePerMonth?: GraphData
  expensesPerMonth?: GraphData
  expensesPerType?: GraphData
  paymentMethods?: GraphData
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

    <h1 class="report-title">REPORTE FINANCIERO</h1>

    <section class="report-section">
      <h2 class="section-title">TABLA RESUMEN</h2>
      <TotalesFinancieros :ingresos="totalIncome" :egresos="0" :diferencia="totalIncome" />
    </section>

    <section class="report-section">
      <h2 class="section-title">TABLA DE REGISTROS</h2>
      <FinanceTable
        :items="incomeSources"
        :columns="[
          { label: 'Fecha', field: 'formattedDate' },
          { label: 'Tipo', field: 'type' },
          { label: 'Monto (Q)', field: 'totalAmount' },
          { label: 'Responsable', field: 'user' },
        ]"
        :viewOnly="true"
        :options="{ searching: false, paging: false, info: false, dom: 't' }"
      />
    </section>

    <section class="report-section">
      <h2 class="section-title">MÉTRICAS</h2>
      <div class="charts-grid">
        <div class="chart-container">
          <div v-if="incomePerMonth && incomePerMonth.series && incomePerMonth.series.length > 0">
            <BarChart
              :series="[{ name: 'Ingresos', data: incomePerMonth?.series ?? [] }]"
              :categories="incomePerMonth?.categories ?? []"
              title="Ingresos"
            />
          </div>
        </div>
        <div class="chart-container">
          <div v-if="expensesPerType && expensesPerType.series && expensesPerType.series.length > 0">
            <PieChart
              :series="expensesPerType?.series ?? []"
              :labels="expensesPerType?.categories ?? []"
              title="Distribución de gastos"
            />
          </div>
        </div>
        <div class="chart-container">
          <div v-if="expensesPerMonth && expensesPerMonth.series && expensesPerMonth.series.length > 0">
            <LineChart
              :series="[{ name: 'Gastos', data: expensesPerMonth?.series ?? [] }]"
              :categories="expensesPerMonth?.categories ?? []"
              title="Gastos"
            />
          </div>
        </div>
        <div class="chart-container">
          <div v-if="paymentMethods && paymentMethods.series && paymentMethods.series.length > 0">
            <CircularChart
              :series="paymentMethods?.series ?? []"
              :labels="paymentMethods?.categories ?? []"
              title="Métodos de pago"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.report-container {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-time p {
  margin: 0;
}

.logo img {
  max-width: 150px;
}

.report-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.report-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 0.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.chart-container {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 8px;
}
</style>
