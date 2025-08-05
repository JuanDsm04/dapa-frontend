<script setup lang="ts">
import type { HighlightConfig } from '@/types/table';
import { ref, computed, watch, nextTick } from 'vue'

import DataTable from 'datatables.net-vue3'
import DataTablesResponsive from 'datatables.net-responsive-dt'
import DataTablesCore from 'datatables.net'
import 'datatables.net-dt/css/dataTables.dataTables.css'
import 'datatables.net-responsive-dt/css/responsive.dataTables.css'

DataTable.use(DataTablesCore)
DataTable.use(DataTablesResponsive)
const props = defineProps<{
  items: any[]
  columns: { label: string, field: string, formatter?: (value: any, row: any) => string }[]
  highlightFn?: (item: any) => HighlightConfig | undefined
  options?: any
}>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
}>()

const dt = ref()

const handleEdit = (item: any) => {
  emit('edit', item)
}

const handleDelete = (item: any) => {
  emit('delete', item)
}

const getHighlightStyles = (item: any) => {
  const h = props.highlightFn?.(item)
  if (!h) return {}
  return {
    ...(h.borderColor
      ? { borderLeft: `4px solid ${h.borderColor}`, paddingLeft: '12px' }
      : {}),
    ...(h.backgroundColor
      ? { backgroundColor: h.backgroundColor }
      : {})
  }
}

const dtColumns = computed(() => [
  ...props.columns.map(col => ({
    data: col.field,
    title: col.label,
    render: (data: any, type: string, row: any) => {
      return col.formatter ? col.formatter(data, row) : data
    }
  })),
  {
    data: null,
    title: 'Acciones',
    orderable: false,
    searchable: false,
    render: (data: any, type: string, row: any, meta: any) => {
      const rowIndex = meta.row;
      return `<div class="action-buttons">
        <button class="btn-edit" type="button" data-row-index="${rowIndex}">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button class="btn-delete" type="button" data-row-index="${rowIndex}">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>`
    }
  }
])

const dtOptions = computed(() => ({
  responsive: true,
  pageLength: 10,
  lengthMenu: [5, 10, 25, 50, 100],
  language: {
    search: 'Buscar:',
    lengthMenu: 'Mostrar _MENU_ registros por página',
    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
    infoEmpty: 'Mostrando 0 a 0 de 0 registros',
    infoFiltered: '(filtrado de _MAX_ registros totales)',
    paginate: {
      first: 'Primero',
      last: 'Último',
      next: 'Siguiente',
      previous: 'Anterior'
    },
    emptyTable: 'No hay datos disponibles en la tabla',
    zeroRecords: 'No se encontraron registros coincidentes'
  },
  createdRow: function(row: HTMLElement, data: any, dataIndex: number) {
    const item = props.items[dataIndex]
    const highlightStyles = getHighlightStyles(item)
    if (highlightStyles.borderLeft) {
      row.style.borderLeft = highlightStyles.borderLeft
      row.style.paddingLeft = highlightStyles.paddingLeft
    }
    if (highlightStyles.backgroundColor) {
      row.style.backgroundColor = highlightStyles.backgroundColor
    }
  },
  ...props.options
}))


const onButtonClick = (e: Event) => {
  const target = e.target as HTMLElement
  const button = target.closest('button')
  
  if (!button) return

  const rowIndex = button.getAttribute('data-row-index')
  if (rowIndex === null) return

  const index = parseInt(rowIndex)
  const item = props.items[index]
  
  if (!item) {
    console.error('Item no encontrado para el índice:', index)
    return
  }

  if (button.classList.contains('btn-edit')) {
    handleEdit(item)
  } else if (button.classList.contains('btn-delete')) {
    handleDelete(item)
  }
}

const setupEvents = () => {
  nextTick(() => {
    const tableElement = dt.value?.$el
    if (tableElement) {
      tableElement.removeEventListener('click', onButtonClick) 
      tableElement.addEventListener('click', onButtonClick)
    }
  })
}

const onTableInit = () => {
  setupEvents()
}

const onTableDestroy = () => {
  const tableElement = dt.value?.$el
  if (tableElement) {
    tableElement.removeEventListener('click', onButtonClick)
  }
}

watch(() => props.items, (newItems) => {
  if (dt.value?.dt) {
    dt.value.dt.clear()
    dt.value.dt.rows.add(newItems)
    dt.value.dt.draw()
    
    setupEvents()
  }
}, { deep: true })

watch(() => dt.value, (newDt) => {
  if (newDt) {
    setupEvents()
  }
})
</script>

<template>
  <div class="datatable-container">
    <DataTable
      ref="dt"
      :data="items"
      :columns="dtColumns"
      :options="dtOptions"
      class="data-table display"
      @init="onTableInit"
      @destroy="onTableDestroy"
    >
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.field">
            {{ col.label }}
          </th>
          <th>Acciones</th>
        </tr>
      </thead>
    </DataTable>
  </div>
</template>

<style scoped>
.datatable-container {
  width: 100%;
}

:deep(.data-table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

:deep(.data-table thead) {
  background-color: var(--table-header);
  color: var(--text-on-light);
}

:deep(.data-table thead th) {
  padding: 16px 24px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.data-table thead th:first-child) {
  border-top-left-radius: 10px;
}

:deep(.data-table thead th:last-child) {
  border-top-right-radius: 10px;
}

:deep(.data-table tbody td) {
  padding: 12px 18px;
  text-align: center;
  font-weight: 300;
  letter-spacing: 0.5px;
  background-color: var(--table-row);
}

:deep(.data-table tbody tr) {
  border-bottom: 3px solid var(--border);
  transition: all 0.2s ease;
}

:deep(.data-table tbody tr:last-child) {
  border-bottom: none;
}

:deep(.action-buttons) {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  gap: 10px;
}

:deep(.action-buttons button) {
  border: none;
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: none;
  cursor: pointer;
  padding: 8px;
  gap: 10px;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 10px;
}

:deep(.action-buttons .icon) {
  width: 24px;
  height: 24px;
}

:deep(.btn-edit) {
  background-color: var(--edit-btn);
}

:deep(.btn-edit .icon) {
  color: var(--on-edit-btn);
}

:deep(.btn-delete) {
  background-color: var(--delete-btn);
}

:deep(.btn-delete .icon) {
  color: var(--on-delete-btn);
}

:deep(.btn-edit:hover) {
  background-color: var(--edit-btn-hover);
}

:deep(.btn-delete:hover) {
  background-color: var(--delete-btn-hover);
}

/* Personalización de estilos DataTables */
:deep(.dataTables_wrapper) {
  font-family: inherit;
}

:deep(.dataTables_length),
:deep(.dataTables_filter),
:deep(.dataTables_info),
:deep(.dataTables_paginate) {
  margin: 10px 0;
}

:deep(.dataTables_filter input) {
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
}

:deep(.paginate_button) {
  border: 1px solid var(--border) !important;
  border-radius: 5px !important;
  margin: 0 2px !important;
  padding: 5px 10px !important;
  background: white !important;
}

:deep(.paginate_button:hover) {
  background: var(--table-header) !important;
  color: var(--text-on-light) !important;
}

:deep(.paginate_button.current) {
  background: var(--table-header) !important;
  color: var(--text-on-light) !important;
}

/* Estilos adicionales para mejor integración */
:deep(.dataTables_wrapper .dataTables_length select) {
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 2px 5px;
}

:deep(.dataTables_wrapper .dataTables_filter label) {
  font-weight: 600;
  color: var(--text-on-light);
}

:deep(.dataTables_wrapper .dataTables_length label) {
  font-weight: 600;
  color: var(--text-on-light);
}

:deep(.dataTables_wrapper .dataTables_info) {
  color: var(--text-on-light);
  font-weight: 500;
}

:deep(table.dataTable.dtr-inline.collapsed > tbody > tr > td:first-child::before) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(tr.parent td) {
  background: var(--bg-general);
}

:deep(table.dataTable.dtr-inline.collapsed > tbody > tr > td:first-child::before) {
  top: 50%;
  transform: translateY(-15%);
  left: 5px; 
}
</style>