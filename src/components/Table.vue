<script setup lang="ts">
import type { HighlightConfig } from '@/types/table';
import { ref, computed, watch, nextTick } from 'vue'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import DataTablesResponsive from 'datatables.net-responsive-dt'
import Buttons from 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/dataTables.buttons.js'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import 'datatables.net-buttons/js/buttons.colVis.js'
import jszip from 'jszip'

import 'datatables.net-dt/css/dataTables.dataTables.css'
import 'datatables.net-responsive-dt/css/responsive.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'

window.JSZip = jszip

DataTable.use(DataTablesCore)
DataTable.use(DataTablesResponsive)
DataTable.use(Buttons)

const props = defineProps<{
  items: any[]
  columns: { label: string, field: string, formatter?: (value: any, row: any) => string }[]
  highlightFn?: (item: any) => HighlightConfig | undefined
  options?: any
  viewOnly?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showView?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
  (e: 'view', item: any): void
}>()

const dt = ref()

const handleEdit = (item: any) => {
  emit('edit', item)
}

const handleDelete = (item: any) => {
  emit('delete', item)
}

const handleView = (item: any) => {
  emit('view', item)
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

const dtColumns = computed(() => {
  const columns = [
    ...props.columns.map(col => ({
      data: col.field,
      title: col.label,
      render: (data: any, type: string, row: any) => {
        return col.formatter ? col.formatter(data, row) : data
      }
    }))
  ];

  // Solo agregar columna de acciones si no es viewOnly o si hay algún botón configurado
  const hasActions = props.showEdit || props.showDelete || props.showView;
  
  if (!props.viewOnly && hasActions) {
    columns.push({
      data: null,
      title: 'Acciones',
      orderable: false,
      searchable: false,
      render: (data: any, type: string, row: any, meta: any) => {
        const rowIndex = meta.row;
        let buttonsHtml = '<div class="action-buttons">';
        
        // Botón de ver
        if (props.showView) {
          buttonsHtml += `
            <button class="btn-view" type="button" data-row-index="${rowIndex}">
              <span class="material-symbols-outlined icon md-icon">
                visibility
              </span>
            </button>
          `;
        }
        
        // Botón de editar (por defecto true si no se especifica)
        if (props.showEdit !== false) {
          buttonsHtml += `
            <button class="btn-edit" type="button" data-row-index="${rowIndex}">
              <span class="material-symbols-outlined icon md-icon">
                edit_square
              </span>
            </button>
          `;
        }
        
        // Botón de eliminar (por defecto true si no se especifica)
        if (props.showDelete !== false) {
          buttonsHtml += `
            <button class="btn-delete" type="button" data-row-index="${rowIndex}">
              <span class="material-symbols-outlined icon md-icon">
                delete
              </span>
            </button>
          `;
        }
        
        buttonsHtml += '</div>';
        return buttonsHtml;
      }
    });
  }

  return columns;
});

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
  } else if (button.classList.contains('btn-view')) {
    handleView(item)
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
          <th v-if="!viewOnly && (showEdit !== false || showDelete !== false || showView)">Acciones</th>
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
  margin-bottom: 1.25rem;
}

:deep(.data-table thead) {
  background-color: var(--neutral-white);
  color: var(--neutral-black);
  font-weight: 800 !important;
}

:deep(.data-table thead th) {
  padding: 1rem 1.5rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.03125rem;
}

:deep(.data-table thead th:first-child) {
  border-top-left-radius: 10px;
}

:deep(.data-table thead th:last-child) {
  border-top-right-radius: 10px;
}

:deep(.data-table tbody td) {
  padding: 0.75rem 1.125rem;
  text-align: center;
  font-weight: 300;
  letter-spacing: 0.03125rem;
  background-color: var(--neutral-white);
}

:deep(.data-table tbody tr) {
  border-bottom: 0.1875rem solid var(--neutral-gray-50);
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
  gap: 0.625rem;
}

:deep(.action-buttons button) {
  border: none;
  color: var(--neutral-white);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 10px;
}

:deep(.btn-view) {
  background-color: var(--principal-primary-100);
}

:deep(.btn-view .icon) {
  color: var(--principal-primary);
}

:deep(.btn-view:hover) {
  background-color: var(--principal-primary-50);
}

:deep(.btn-edit) {
  background-color: var(--principal-secondary-100);
}

:deep(.btn-edit .icon) {
  color: var(--principal-secondary);
}

:deep(.btn-delete) {
  background-color: var(--principal-error-100);
}

:deep(.btn-delete .icon) {
  color: var(--principal-error);
}

:deep(.btn-edit:hover) {
  background-color: var(--principal-secondary-50);
}

:deep(.btn-delete:hover) {
  background-color: var(--principal-error-50);
}

:deep(.dataTables_wrapper) {
  font-family: inherit;
}

:deep(.dataTables_length),
:deep(.dataTables_filter),
:deep(.dataTables_info),
:deep(.dataTables_paginate) {
  margin: 0.625rem 0;
}

:deep(.dataTables_filter input) {
  border: 1px solid var(--border-base);
  border-radius: 5px;
  padding: 0.3125rem 0.625rem;
  margin-left: 0.625rem;
}

:deep(.dt-paging-button) {
  border: 0.0625rem solid var(--border-base) !important;
  border-radius: 8px !important;
  margin: 0 0.125rem !important;
  padding: 0.3125rem 0.625rem !important;
  background: white !important;
}

:deep(.dt-paging-button:hover) {
  background: var(--neutral-gray-500) !important;
  color: var(--neutral-black) !important;
}

:deep(.dt-paging-button.current) {
  background: var(--neutral-white) !important;
  color: var(--neutral-black) !important;
}

:deep(.dataTables_wrapper .dataTables_length select) {
  border: 1px solid var(--border-base);
  border-radius: 5px;
  padding: 0.125rem 0.3125rem;
}

:deep(.dataTables_wrapper .dataTables_filter label),
:deep(.dataTables_wrapper .dataTables_length label) {
  font-weight: 600;
  color: var(--neutral-black);
}

:deep(.dataTables_wrapper .dataTables_info) {
  color: var(--neutral-black);
  font-weight: 500;
}

:deep(table.dataTable.dtr-inline.collapsed > tbody > tr > td:first-child::before) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(tr.parent td) {
  background: var(--principal-primary-50);
}

:deep(table.dataTable.dtr-inline.collapsed > tbody > tr > td:first-child::before) {
  top: 50%;
  transform: translateY(-15%);
  left: 0.3125rem;
}

:deep(.dt-search){
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 1rem;
}

:deep(.dt-buttons) {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

:deep(.dt-button) {
  background-color: var(--principal-primary-600) !important;
  color: var(--neutral-white) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.5rem 1rem !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
}

:deep(.dt-button span){
  display: flex !important;
  align-items: center !important;
  height: auto;
  gap: 0.5rem;
}

:deep(.dt-button:hover),
:deep(.dt-button:focus) {
  background-color: var(--principal-primary-hover);
}

:deep(.dt-button:active) {
  background-color: var(--principal-primary-800);
  transform: translateY(0);
}

:deep(.dt-info){
  margin: 1rem;
}
</style>