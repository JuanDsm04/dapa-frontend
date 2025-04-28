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
  <tr>
    <td v-for="column in columns" :key="column">
      {{ item[column] }}
    </td>
    <td class="action-buttons">
      <button @click="handleEdit">
        <PencilSquareIcon class="icon" />
      </button>
    </td>
    <td class="action-buttons">
      <button @click="handleDelete">
        <TrashIcon class="icon" />
      </button>
    </td>
  </tr>
</template>


<style scoped>
tr{
  padding: 15px 0;
}

td{
  text-align: center;
}

.action-buttons {
  text-align: center;
}

button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.icon {
    width: 24px;
    height: 24px;
    color: var(--primary);
}

button:hover .icon {
    color: var(--primary-dark);
}
</style>
