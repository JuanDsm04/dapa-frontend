<script setup lang="ts">
import BarChart from '@/components/charts/BarChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import ReportFilter from '@/components/filters/ReportFilter.vue';
import TotalesFinancieros from '@/components/reports/FinancialTotal.vue';
import FinanceTable from '@/components/Table.vue';
import { getExpensesPerMonth, getExpensesPerType, getFinancialReport, getFinancialReportByDate, getIncomePerMonth, getPaymentMethods, getTotalIncomeReport } from '@/services/financialReportService';
import type { GraphData, Income } from '@/types/reports';
import { onMounted, ref } from 'vue';

const activeTab = ref('table')
const totalIncome = ref(0)
const incomeSources = ref<Income[]>([])

const incomePerMonth = ref<GraphData>()
const expensesPerMonth = ref<GraphData>()
const expensesPerType = ref<GraphData>()
const paymentMethods = ref<GraphData>()

const fetchFinancialReport = async (startDate?: string, endDate?: string) => {
  try {
    let response;
    if (startDate && endDate) {
      response = await getFinancialReportByDate(startDate, endDate);
    } else {
      response = await getFinancialReport();
    }
    if (response.data) {
      incomeSources.value = response.data.map((item: any) => {
        const date = new Date(item.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return {
          ...item,
          formattedDate: `${day}/${month}/${year}`
        }
      })
    }
  } catch (error) {
    console.error('Error fetching financial report: ', error);
    incomeSources.value = [];
  }
};

const handleFilterChange = ({ startDate, endDate }: { startDate: string, endDate: string }) => {
  fetchFinancialReport(startDate, endDate);
};

onMounted(async () => {
  try {
    const response = await getTotalIncomeReport()
    totalIncome.value = response.data.totalIncome
  } catch (error) {
    console.error('Error fetching total income:', error)
  }
  fetchFinancialReport()

  try {
    const response = await getIncomePerMonth()
    incomePerMonth.value = response.data
  } catch (error) {
    console.error('Error fetching monthly income:', error);
  }

  try {
    const response = await getExpensesPerType()
    expensesPerType.value = response.data
  } catch (error) {
    console.error('Error fetching expenses per type:', error);
  }

  try {
    const response = await getExpensesPerMonth()
    expensesPerMonth.value = response.data
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
  }

  try {
    const response = await getPaymentMethods()
    paymentMethods.value = response.data
  } catch (error) {
    console.error('Error fetching payment method distributions:', error);
  }

});

const myTable = {
  dom: 'Bfrtip',
  buttons: [
    { extend: 'csv', text: `<span class="material-symbols-outlined sm-icon">download</span> CSV`},
  ],
}
</script>

<template>
  <main>
    <header>
      <button class="btn-back" @click="$router.back()">
        <span class="material-symbols-outlined md-icon">arrow_back</span>
      </button>
      <h1>Reporte Financiero</h1>
    </header>

    <section>
      <ReportFilter @filter-change="handleFilterChange" />

      <TotalesFinancieros
        :ingresos="totalIncome"
        :egresos="0"
        :diferencia="totalIncome"
      />

      <div class="toggle-row">
        <div :class="['toggle-wrapper', activeTab === 'table' ? 'active-left' : 'active-right']">
          <div class="toggle-indicator"></div>
          <div class="toggle-button" @click="activeTab = 'table'">Tabla</div>
          <div class="toggle-button" @click="activeTab = 'graphics'">Métricas</div>
        </div>
      </div>

      <div v-if="activeTab === 'table'" class="table-wrapper">
        <FinanceTable
          :items="incomeSources"
          :columns="[
            { label: 'Fecha', field: 'formattedDate' },
            { label: 'Tipo', field: 'type' },
            { label: 'Monto (Q)', field: 'totalAmount' },
            { label: 'Responsable', field: 'user' },
          ]"
          :options="myTable"
          :viewOnly="true"
          @edit="() => {}"
          @delete="() => {}"
        />
      </div>

      <div v-if="activeTab === 'graphics'" class="graphs">
        <div class="charts-row">
          <div>
            <div v-if="incomePerMonth && incomePerMonth.series && incomePerMonth.series.length > 0">
              <BarChart
                :series="[{ name: 'Ingresos', data: incomePerMonth?.series ?? [] }]"
                :categories="incomePerMonth?.categories ?? []"
                title="Ingresos"
              />
            </div>
            <div v-else class="chart-placeholder">
              <h3>Ingresos</h3>
              <p>No hay datos suficientes</p>
            </div>
          </div>
          <div>
            <div v-if="expensesPerType && expensesPerType.series && expensesPerType.series.length > 0">
              <PieChart
                :series="expensesPerType?.series ?? []"
                :labels="expensesPerType?.categories ?? []"
                title="Distribución de gastos"
              />
            </div>
            <div v-else class="chart-placeholder">
              <h3>Distribución de gastos</h3>
              <p>No hay datos suficientes</p>
            </div>
          </div>
          <div>
            <div v-if="expensesPerMonth && expensesPerMonth.series && expensesPerMonth.series.length > 0">
              <LineChart
                :series="[{ name: 'Gastos', data: expensesPerMonth?.series ?? [] }]"
                :categories="expensesPerMonth?.categories ?? []"
                title="Gastos"
              />
            </div>
            <div v-else class="chart-placeholder">
              <h3>Gastos</h3>
              <p>No hay datos suficientes</p>
            </div>
          </div>
          <div>
            <div v-if="paymentMethods && paymentMethods.series && paymentMethods.series.length > 0">
              <CircularChart
                :series="paymentMethods?.series ?? []"
                :labels="paymentMethods?.categories ?? []"
                title="Métodos de pago"
              />
            </div>
            <div v-else class="chart-placeholder">
              <h3>Métodos de pago</h3>
              <p>No hay datos suficientes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: block;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
}

main header {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
}

section {
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: stretch;
}

.toggle-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2rem 0;
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

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

.charts-row {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.chart-placeholder {
  width: 100%;
  padding: 2rem;
  background-color: var(--neutral-white);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 600px;
  min-height: 400px;
}

@media (max-width: 770px) {
  main {
    padding: 2rem 1rem;
    width: 95%;
  }

  main header {
    margin-top: 3rem;
    gap: 1rem;
    align-items: stretch;
    font-size: 0.8rem;
    align-items: center;
  }

  h1 {
    margin-left: 0;
    text-align: center;
  }

  section {
    gap: 0.5rem;
  }

  .charts-row {
    justify-content: center;
  }
}
</style>
