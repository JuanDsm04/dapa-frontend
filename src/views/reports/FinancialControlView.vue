<script setup lang="ts">
import ReportFilter from '@/components/filters/FinancialControlFilter.vue';
import { default as ExpenseTable, default as IncomeTable } from '@/components/Table.vue';
import { ref } from 'vue';

const activeTab = ref('left');

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
    <div class="filters-toggle-row">
      <ReportFilter />
      <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
        <div class="toggle-indicator"></div>
        <div class="toggle-button" @click="activeTab = 'left'">Ingresos</div>
        <div class="toggle-button" @click="activeTab = 'right'">Egresos</div>
      </div>
    </div>
    <section>
      <div class="kpi-wrapper" v-if="activeTab == 'left'">
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
      </div></div>
      
      <div class="kpi-wrapper" v-if="activeTab == 'right'">
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
      </div></div>
      <!-- GRÁFICAS
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
      -->

      <!-- Tabla -->
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

.filters-toggle-row {
  display: flex;
  justify-content: space-between; /* separa filtro y toggle */
  align-items: center;            /* alinea verticalmente */
  margin-bottom: 1rem;
  gap: 1rem;                      /* espacio entre ellos */
}

.filters-toggle-row > *:first-child {
  flex: 1;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
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
