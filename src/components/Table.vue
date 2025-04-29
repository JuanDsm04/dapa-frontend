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
  </table>
</template>

<style scoped>

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: var(--sidebar-bg);
  color: white;
}

.data-table th {
  padding: 16px 24px;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: all 0.2s ease;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

</style>