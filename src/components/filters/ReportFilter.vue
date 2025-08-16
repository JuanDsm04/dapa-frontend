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
  <main>
    <div class="field">
      <label for="startDate">Fecha inicio</label>
      <input v-model="startDate" type="date" name="startDate" id="startDate" @input="onFilterChange">
    </div>
    <div class="field">
      <label for="endDate">Fecha fin</label>
      <input v-model="endDate" type="date" name="endDate" id="endDate" @input="onFilterChange">
    </div>
    <div class="field">
      <label for="search">Buscar</label>
      <input v-model="search" type="text" name="search" id="search" @change="onFilterChange">
    </div>
    <button>Descargar</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  align-items: center;
}

.field {
  display: flex;
  gap: 10px;
}

button {
  background-color: #3949ab;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

</style>
