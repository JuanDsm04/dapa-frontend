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
  {
    ingresos: '',
    egresos: '',
    saldo: ''
  }
]

const columns = [
  {
    data: 'ingresos',
    title: '<span class="col-ingresos">Total ingresos</span>',
    className: 'col-ingresos'
  },
  {
    data: 'egresos',
    title: '<span class="col-egresos">Total egresos</span>',
    className: 'col-egresos'
  },
  {
    data: 'saldo',
    title: '<span class="col-saldo">Saldo total</span>',
    className: 'col-saldo'
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
  // Sin columnDefs por ahora
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
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

:deep(.totales-table) {
  width: 90vw;           /* Ocupa el 90% del ancho de la ventana */
  max-width: 1800px;     /* Permite que sea más ancha en pantallas grandes */
  min-width: 700px;      /* Más espacio mínimo */
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  font-size: 1.1rem;
  table-layout: auto;
}

:deep(.totales-table th),
:deep(.totales-table td) {
  white-space: nowrap;
  width: 33%;            /* Cada columna ocupa un tercio */
  padding: 24px 32px;    /* Más espacio interno */
  font-size: 1.3rem;     /* Más grande el texto */
}

:deep(.totales-table thead th.col-ingresos) {
  color: #388e3c;
  font-weight: bold;
  font-size: 1.2rem;
  background: transparent; /* Cambiado a transparente */
  text-align: center;
}
:deep(.totales-table thead th.col-egresos) {
  color: #d32f2f;
  font-weight: bold;
  font-size: 1.2rem;
  background: transparent; /* Cambiado a transparente */
  text-align: center;
}
:deep(.totales-table thead th.col-saldo) {
  color: #000000;
  font-weight: bold;
  font-size: 1.2rem;
  background: transparent; /* Cambiado a transparente */
  text-align: center;
}

:deep(.totales-table tbody td) {
  text-align: center;
  padding: 18px 0;
}

:deep(.totales-table .valor-ingresos) {
  color: #388e3c;
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}
:deep(.totales-table .valor-egresos) {
  color: #d32f2f;
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}
:deep(.totales-table .valor-saldo) {
  color: #000000;
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 900px) {
  :deep(.totales-table) {
    width: 98vw;
    min-width: unset;
    font-size: 1rem;
  }
  :deep(.totales-table th),
  :deep(.totales-table td) {
    padding: 12px 8px;
    font-size: 1rem;
  }
}
</style>