<script setup lang="ts">
import ReportFilter from '@/components/filters/ReportFilter.vue';
import FinanceTable from '@/components/Table.vue'
</script>

<template>
  <main>
    <ReportFilter />
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

  </main>
</template>
