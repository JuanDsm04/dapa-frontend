<script setup lang="ts">
import Row from './Row.vue'
import type { HighlightConfig } from '@/types/table';
import { defineProps, defineEmits } from 'vue'


const props = defineProps<{
  items: any[]
  columns: { label: string, field: string }[]
  highlightFn?: (item: any) => HighlightConfig | undefined
}>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
}>()

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
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.field">
          {{ col.label }}
        </th>
        <th>Opcionesss</th>
      </tr>
    </thead>
    <tbody>
      <Row
        v-for="item in items"
        :key="item.id"
        :item="item"
        :columns="columns.map(c => c.field)"
        :highlight="highlightFn?.(item)"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </tbody>
    <tfoot>
      <tr>
        <td :colspan="columns.length + 1" class="footer-cell"></td>
      </tr>
    </tfoot>
  </table>

   <div class="data-cards">
    <div v-for="item in items" :key="item.id" class="card" :style="getHighlightStyles(item)">
      <div v-for="col in columns" :key="col.field" class="card-row">
        <span class="card-label">{{ col.label }}: </span>
        <span class="card-value">{{ item[col.field] }}</span>
      </div>
      <div class="card-actions">
        <button @click="handleEdit(item)" class="card-button edit">Editar</button>
        <button @click="handleDelete(item)" class="card-button delete">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background-color: var(--table-header);
    color: var(--text-on-light);
    border-bottom: 3px solid var(--border);
  }

  .data-table thead th:first-child {
    border-top-left-radius: 10px;
  }

  .data-table thead th:last-child {
    border-top-right-radius: 10px;
  }

  .data-table th {
    padding: 16px 24px;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .data-table tbody tr {
    border-bottom: 3px solid var(--border);
    transition: all 0.2s ease;
  }

  .data-table tbody tr:last-child {
    border-bottom: none;
  }

  .data-table tfoot .footer-cell {
    height: 20px;
    background-color: var(--table-footer);
    border-top: 3px solid var(--border);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .data-cards {
    width: 75%;
    display: none;
    flex-direction: column;
    gap: 16px;
    margin: 16px 0;
  }

  .card {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border);
  }

  .card:hover{
    transform: scale(1.02);
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 5px;
    border-bottom: 2px solid var(--bg-general);
    gap: 10px;
  }

  .card-label {
    font-weight: 600;
    color: var(--text-on-light);
  }

  .card-value{
    overflow: hidden;
    text-overflow: ellipsis;

  }

  .card-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
  }

  .card-button {
    border-radius: 10px;
    font-weight: 600;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .card-button.edit {
    background-color: var(--edit-btn);
    color: var(--on-edit-btn);
  }

  .card-button.edit:hover{
    background-color: var(--on-edit-btn);
    color: var(--edit-btn);
  }

  .card-button.delete {
    background-color: var(--delete-btn);
    color: var(--on-delete-btn);
  }

  .card-button.delete:hover{
    background-color: var(--on-delete-btn);
    color: var(--delete-btn);
  }

  @media (max-width: 840px) {

    .data-table {
      display: none;
    }
    
    .data-cards {
      display: flex;
    }
  }
</style>