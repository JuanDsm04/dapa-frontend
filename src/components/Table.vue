<script setup lang="ts">
import Row from './Row.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  items: any[]
  columns: { label: string, field: string }[]
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
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.field">
          {{ col.label }}
        </th>
        <th>Opciones</th>
      </tr>
    </thead>
    <tbody>
      <Row
        v-for="item in items"
        :key="item.id"
        :item="item"
        :columns="columns.map(c => c.field)"
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
</style>