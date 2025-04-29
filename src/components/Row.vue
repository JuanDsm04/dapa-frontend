<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  item: Record<string, any>
  columns: string[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
}>()

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}
</script>

<template>
  <tr class="data-row">
    <td v-for="column in columns" :key="column">
      {{ item[column] }}
    </td>
    <td class="action-buttons">
      <button @click="handleEdit" class="btn-edit"> 
        <PencilSquareIcon class="icon" />
        Editar
      </button>
      <button @click="handleDelete" class="btn-delete">
        <TrashIcon class="icon" />
        Eliminar
      </button>
    </td>
  </tr>
</template>


<style scoped>

td{
  padding: 12px 18px;
  text-align: center;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.action-buttons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  gap: 10px;
}

button {
  border: none;
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
    background: none;
    cursor: pointer;
    padding: 8px;
}

.icon {
    width: 24px;
    height: 24px;
    color: var(--white);
}

.btn-edit{
  background-color: var(--primary);
  border-radius: 8px;
}

.btn-delete{
  background-color: var(--delete-btn);
  border-radius: 8px;
}

.btn-edit:hover{
  background-color: var(--primary-dark);
}

.btn-delete:hover{
  background-color: var(--delete-btn-hover);
}

.data-row:hover{
  background-color: var(--row-hover);
}
</style>
