<script setup lang="ts">
import { ref, computed } from 'vue'
import QuoteCard from './QuoteCard.vue'
import { type Submission } from '@/types/form'

const props = defineProps<{
  title: string
  submissions: Submission[]
}>()

const filter = ref<string | undefined>(undefined)
const showFilters = ref(false)

const emit = defineEmits(['quote-selected'])

const handleQuoteSelected = (submission: Submission) => {
  emit('quote-selected', submission)
}

function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

function setFilter(option?: string) {
  filter.value = option
  showFilters.value = false
}

const filteredSubmissions = computed(() => {
  switch (filter.value) {
    case 'recent':
      return [...props.submissions].sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
    case 'oldest':
      return [...props.submissions].sort((a, b) => 
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      )
    default:
      return props.submissions
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
          <button @click="setFilter(undefined)">Todos</button>
        </div>
      </div>
    </header>

    <div class="card-list">
      <QuoteCard
        v-for="submission in filteredSubmissions"
        :key="submission.id"
        :quote="submission"
        @quote-selected="handleQuoteSelected"
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