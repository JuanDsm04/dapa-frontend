<script setup lang="ts">
import ReportFilter from '@/components/filters/ReportFilter.vue';
import FinanceTable from '@/components/Table.vue';
</script>

<template>
  <main>
    <header>
      <h1>Reporte Financiero</h1>
    </header>
    <section>
      <ReportFilter />
      <div class="table-wrapper">
        <FinanceTable
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
