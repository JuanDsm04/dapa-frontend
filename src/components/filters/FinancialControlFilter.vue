<script setup>
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['filter-change'])
const startDate = ref('')
const endDate = ref('')
const search = ref('')

function onFilterChange() {
  emit('filter-change', {
    startDate: startDate.value,
    endDate: endDate.value,
    search: search.value
  })
}
</script>

<template>
  <form class="filter-form" @submit.prevent>
    <div class="field">
      <label for="startDate">Fecha inicio</label>
      <input v-model="startDate" type="date" name="startDate" id="startDate" @input="onFilterChange">
    </div>
    <div class="field">
      <label for="endDate">Fecha fin</label>
      <input v-model="endDate" type="date" name="endDate" id="endDate" @input="onFilterChange">
    </div>
  </form>
</template>

<style scoped>
.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

label {
  font-size: 0.95rem;
  margin-bottom: 4px;
  color: var(--principal-primary-400);
}

input[type="date"],
input[type="text"] {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--neutral-gray-400);
  font-size: 1rem;
}

button {
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  margin-top: 20px;
}

button:hover {
  background-color: var(--principal-primary-700);
}

@media (max-width: 600px) {
  .filter-form {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  button {
    width: 100%;
  }
}
</style>
