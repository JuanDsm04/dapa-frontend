<script setup lang="ts">
import DataTablesCore from 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTable from 'datatables.net-vue3';

DataTable.use(DataTablesCore)

const props = defineProps<{
  ingresos: number,
  egresos: number,
  diferencia: number
}>()

const data = [
  { label: 'Total ingresos', value: props.ingresos },
  { label: 'Total egresos', value: props.egresos },
  { label: 'Diferencia', value: props.diferencia }
]

const columns = [
  { data: 'label', title: 'Concepto' },
  { 
    data: 'value', 
    title: 'Monto (Q)', 
    render: (data: number, type: string) => 
      data.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })
  }
]

const options = {
  paging: false,
  searching: false,
  info: false,
  ordering: false,
  language: {
    emptyTable: 'No hay totales disponibles'
  }
}
</script>

<template>
  <div class="totales-datatable">
    <DataTable
      :data="data"
      :columns="columns"
      :options="options"
      class="totales-table display"
    />
  </div>
</template>

<style scoped>
.totales-datatable {
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

:deep(.totales-table) {
  min-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

@media (max-width: 600px) {
  .totales-datatable {
    justify-content: center;
  }
  :deep(.totales-table) {
    min-width: 220px;
    font-size: 0.95rem;
  }
}
</style>