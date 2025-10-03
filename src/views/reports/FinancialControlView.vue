<script setup lang="ts">
import ReportFilter from '@/components/filters/ReportFilter.vue';
import IncomeTable from '@/components/Table.vue';
import ExpenseTable from '@/components/Table.vue';

import BarChart from '@/components/charts/BarChart.vue';
import CircularChart from '@/components/charts/CircularChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';

const categories = ['Enero', 'Febrero', 'Marzo', 'Abril']
const seriesBar = [{ name: 'Ingresos', data: [20, 40, 35, 50] }]
const seriesLine = [{ name: 'Gastos', data: [10, 30, 25, 40] }]
const seriesPie = [44, 55, 13, 33]
const labelsPie = ['Alquiler', 'Comida', 'Transporte', 'Otros']
const seriesCircular = [30, 25, 20, 25]
const labelsCircular = ['Tarjeta', 'Efectivo', 'Transferencia', 'Cheque']
</script>

<template>
  <main>
    <header>
      <h1>Control Financiero</h1>
    </header>
    <section>
      <ReportFilter />
      <div class="charts-row">
        <BarChart
          :series="seriesBar"
          :categories="categories"
          title="Ingresos"
          :height="250"
          :width="300"
        />
        <LineChart
          :series="seriesLine"
          :categories="categories"
          title="Gastos"
          :height="250"
          :width="300"
        />
        <PieChart
          :series="seriesPie"
          :labels="labelsPie"
          title="Distribución de gastos"
          :height="250"
          :width="250"
        />
        <CircularChart
          :series="seriesCircular"
          :labels="labelsCircular"
          title="Métodos de pago"
          :height="250"
          :width="250"
        />
      </div>

      <!-- Tabla -->
      <div class="table-wrapper">
        <IncomeTable
          :items="[]"
          :columns="[
            { label: 'ID', field: 'id' },
            { label: 'Fecha', field: 'date' },
            { label: 'Tipo', field: 'type' },
            { label: 'Monto (Q)', field: 'amount' },
            { label: 'Categoría', field: 'category' },
            { label: 'Método de pago', field: 'paymentMethod' },
            { label: 'Responsable', field: 'responsable' },
            { label: 'Descripción', field: 'desc' },
          ]"
          @edit="() => {}"
          @delete="() => {}"
        />
      </div>
      <div class="table-wrapper">
        <ExpenseTable
          :items="[]"
          :columns="[
            { label: 'ID', field: 'id' },
            { label: 'Fecha', field: 'date' },
            { label: 'Tipo', field: 'type' },
            { label: 'E. Temporal', field: 'tempEmployee' },
            { label: 'Descripción', field: 'description' },
            { label: 'Tipo de pago', field: 'paymentType' },
            { label: 'Costo', field: 'amount' },
          ]"
          @edit="() => {}"
          @delete="() => {}"
        />
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

.charts-row {
  display: flex;
  gap: 0.2rem;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
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

  .table-wrapper {
    justify-content: center;
  }
}
</style>
