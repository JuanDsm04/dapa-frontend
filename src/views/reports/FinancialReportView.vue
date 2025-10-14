<script setup lang="ts">
import BarChart from '@/components/charts/BarChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import ReportFilter from '@/components/filters/ReportFilter.vue';
import TotalesFinancieros from '@/components/reports/FinancialTotal.vue';
import FinanceTable from '@/components/Table.vue';
import { getFinancialReport, getFinancialReportByDate, getTotalIncomeReport } from '@/services/reportService';
import type { Income } from '@/types/reports';
import { onMounted, ref } from 'vue';

const activeTab = ref('table');
const totalIncome = ref(0);
const incomeSources = ref<Income[]>([]);

const categories = ['Enero', 'Febrero', 'Marzo', 'Abril']
const seriesBar = [{ name: 'Ingresos', data: [20, 40, 35, 50] }]
const seriesLine = [{ name: 'Gastos', data: [10, 30, 25, 40] }]
const seriesPie = [44, 55, 13, 33]
const labelsPie = ['Alquiler', 'Comida', 'Transporte', 'Otros']
const seriesCircular = [30, 25, 20, 25]
const labelsCircular = ['Tarjeta', 'Efectivo', 'Transferencia', 'Cheque']

const fetchFinancialReport = async (startDate?: string, endDate?: string) => {
  try {
    let response;
    if (startDate && endDate) {
      response = await getFinancialReportByDate(startDate, endDate);
    } else {
      response = await getFinancialReport();
    }

    incomeSources.value = response.data.map((item: any) => {
      const date = new Date(item.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return {
        ...item,
        formattedDate: `${day}/${month}/${year}`
      };
    });
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
    const response = await getTotalIncomeReport();
    totalIncome.value = response.data.totalIncome;
  } catch (error) {
    console.error('Error fetching total income:', error);
  }
  fetchFinancialReport();
});
</script>

<template>
  <main>
    <header>
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
          :options="
          {
            dom: 'Bfrtip',
            buttons: [
              { extend: 'csv', text: 'CSV' },
            ],
          }
          "
          :viewOnly="true"
          @edit="() => {}"
          @delete="() => {}"
        />
      </div>

      <div v-if="activeTab === 'graphics'" class="graphs">
        <div class="charts-row">
          <BarChart
            :series="seriesBar"
            :categories="categories"
            title="Ingresos"
          />
          <PieChart
            :series="seriesPie"
            :labels="labelsPie"
            title="Distribución de gastos"
          />
          <LineChart
            :series="seriesLine"
            :categories="categories"
            title="Gastos"
          />
          <CircularChart
            :series="seriesCircular"
            :labels="labelsCircular"
            title="Métodos de pago"
          />
        </div>
      </div>
    </section>
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
  margin-bottom: 0.5rem;
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

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

.charts-row {
  width: 100%;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 770px) {
  main {
    padding: 2rem 1rem;
  }

  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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
