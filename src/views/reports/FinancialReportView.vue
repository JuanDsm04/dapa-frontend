<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ReportFilter from '@/components/filters/ReportFilter.vue';
import TotalesFinancieros from '@/components/reports/FinancialTotal.vue';
import FinanceTable from '@/components/Table.vue';
import { getFinancialReport, getTotalIncomeReport } from '@/services/reportService';
import type { Income } from '@/types/reports';

const totalIncome = ref(0);
const incomeSources = ref<Income[]>([]);

onMounted(async () => {
  try {
    const response = await getTotalIncomeReport();
    totalIncome.value = response.data.totalIncome;
  } catch (error) {
    console.error('Error fetching total income:', error);
  }

  try {
    const response = await getFinancialReport();

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
  }
});
</script>

<template>
  <main>
    <header>
      <h1>Reporte Financiero</h1>
    </header>
    <section>
      <ReportFilter />
      <TotalesFinancieros
        :ingresos="totalIncome"
        :egresos="0"
        :diferencia="totalIncome"
      />
      <div class="wrapper-table">
        <FinanceTable
          :items="incomeSources"
          :columns="[
            { label: 'Fecha', field: 'formattedDate' },
            { label: 'Tipo', field: 'type' },
            { label: 'Monto (Q)', field: 'totalAmount' },
            { label: 'Responsable', field: 'user' },
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

  .download-btn {
    width: 100%;
  }

  section {
    gap: 0.5rem; /* Menor separación en móvil */
  }

  .table-wrapper {
    justify-content: center;
  }
}
</style>
