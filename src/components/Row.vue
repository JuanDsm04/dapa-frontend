<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  item: Record<string, any>
  columns: string[]
  highlight?: {
    borderColor?: string
    backgroundColor?: string
  }
}>()

const highlightStyles = computed(() => {
  const h = props.highlight
  if (!h) return {}
  return {
    ...(h.borderColor
      ? { borderLeft: `4px solid ${h.borderColor}`, paddingLeft: '14px' }
      : {}),
    ...(h.backgroundColor
      ? { backgroundColor: h.backgroundColor }
      : {})
  }
})

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
  <tr class="data-row" :style="highlightStyles">
    <td v-for="column in columns" :key="column">
      {{ item[column] }}
    </td>
    <td class="action-buttons">
      <button @click="handleEdit" class="btn-edit"> 
        <PencilSquareIcon class="icon" />
      </button>
      <button @click="handleDelete" class="btn-delete">
        <TrashIcon class="icon" />
      </button>
    </td>
  </tr>
</template>


<style scoped>

  .data-row {
    background-color: var(--table-row);
  }

  td {
    padding: 12px 18px;
    text-align: center;
    font-weight: 300;
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
    gap: 10px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  .btn-edit{
    background-color: var(--edit-btn);
    border-radius: 10px;
  }

  .btn-edit .icon {
    color: var(--on-edit-btn);
  }

  .btn-delete {
    background-color: var(--delete-btn);
    border-radius: 10px;
  }

  .btn-delete .icon {
    color: var(--on-delete-btn);
  }

  .btn-edit:hover{
    background-color: var(--edit-btn-hover);
  }

  .btn-delete:hover{
    background-color: var(--delete-btn-hover);
  }

</style>
