<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QuoteCard from './QuoteCard.vue'
import { type Submission } from '@/types/form'

const props = defineProps<{
  title: string
  submissions: Submission[]
  selectedSubmissionId?: string | number | null
}>()

const filter = ref<string | undefined>(undefined)
const showFilters = ref(false)

// Referencia al wrapper del filtro
const filterWrapper = ref<HTMLElement | null>(null)

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

// Función para cerrar filtros al hacer clic fuera
const handleClickOutside = (event: Event) => {
  if (filterWrapper.value && !filterWrapper.value.contains(event.target as Node)) {
    showFilters.value = false
  }
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

// Montaje del componente
onMounted(() => {
  // Agregar event listener para clics fuera
  document.addEventListener('click', handleClickOutside)
})

// Desmontaje del componente
onUnmounted(() => {
  // Remover event listener al desmontar
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <section class="quotes-list">
    <header>
      <h2>{{ title }}</h2>
      <div class="filter-wrapper" ref="filterWrapper">
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
        v-for="submission in filteredSubmissions"
        :key="submission.id"
        :quote="submission"
        :isSelected="props.selectedSubmissionId === submission.id"
        @quote-selected="handleQuoteSelected"
      />
      <p v-if="filteredSubmissions.length === 0">No hay formularios disponibles</p>
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
  font-size: clamp(1.25rem, 2vw, 1.5rem);
}

.filter-wrapper {
  position: relative;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 0.0625rem solid var(--border-light); /* 1px -> 0.0625rem */
  border-radius: 10px;
  background-color: var(--neutral-white);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  cursor: pointer;
}

.filter-btn:hover {
  background-color: var(--neutral-gray-50);
}

.filter-options {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: var(--neutral-white);
  border: 0.0625rem solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 0.125rem 0.375rem rgba(0,0,0,0.1); /* 2px 6px -> rem */
  display: flex;
  flex-direction: column;
  z-index: 10;
  min-width: 12.5rem; /* 200px -> 12.5rem */
}

.filter-options button {
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.filter-options button:hover {
  background-color: var(--neutral-gray-50);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.25rem; /* 20px -> 1.25rem */
}
</style>