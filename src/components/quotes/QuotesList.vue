<script setup>
import { ref, computed } from 'vue'
import QuoteCard from './QuoteCard.vue'

const props = defineProps({
  title: String,
})

const quotes = ref([
  { id: 'q001', client: 'Armando', date: '2025-04-10' },
  { id: 'q002', client: 'Lucía', date: '2025-04-15' },
  { id: 'q003', client: 'Carlos', date: '2025-05-01' },
  { id: 'q004', client: 'Laura', date: '2025-05-05' }
])

const filter = ref(null)
const showFilters = ref(false)

function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

function setFilter(option) {
  filter.value = option
  showFilters.value = false
}

const filteredQuotes = computed(() => {
  switch (filter.value) {
    case 'recent':
      return [...quotes.value].sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'oldest':
      return [...quotes.value].sort((a, b) => new Date(a.date) - new Date(b.date))
    default:
      return quotes.value
  }
})
</script>

<template>
  <section class="quotes-list">
    <header>
      <h2>{{ title }}</h2>
      <div class="filter-wrapper">
        <button class="filter-btn" @click="toggleFilterOptions">
          <span class="material-symbols-outlined">tune</span>
        </button>
        <div v-if="showFilters" class="filter-options">
          <button @click="setFilter('recent')">Más recientes</button>
          <button @click="setFilter('oldest')">Más antiguos</button>
        </div>
      </div>
    </header>

    <div class="card-list">
      <QuoteCard
        v-for="quote in filteredQuotes"
        :key="quote.id"
        :quote="quote"
      />
    </div>
  </section>
</template>

<style scoped>
.quotes-list {
  padding: 1.5rem;
  height: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  font-weight: 600;
}

.filter-wrapper {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
}

.filter-btn:hover {
  background-color: #f5f5f5;
}

.filter-options {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
  min-width: 200px;
}

.filter-options button {
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.filter-options button:hover {
  background-color: #f0f0f0;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 20px;
}
</style>