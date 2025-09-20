<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import QuoteCard from './QuoteCard.vue'
import { type Submission } from '@/types/form'

const props = defineProps<{
  title: string
  submissions: Submission[]
  selectedSubmissionId?: string | number | null
}>()

const filter = ref<string | undefined>(undefined)
const showFilters = ref(false)
const selectedSubmissionId = ref<string | number | null>(null)

// Referencia al wrapper del filtro
const filterWrapper = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'quote-selected', submission: Submission): void
  (e: 'quote-deselected'): void
}>()

const handleQuoteSelected = (submission: Submission) => {
  selectedSubmissionId.value = submission.id
  emit('quote-selected', submission)
}

function toggleFilterOptions() {
  showFilters.value = !showFilters.value
}

// Función modificada para deseleccionar al filtrar
function setFilter(option?: string) {
  filter.value = option
  showFilters.value = false
  
  // Deseleccionar la cotización actual cuando se aplica un filtro
  selectedSubmissionId.value = null
  emit('quote-deselected')
}

// Función para cerrar filtros al hacer clic fuera
const handleClickOutside = (event: Event) => {
  if (filterWrapper.value && !filterWrapper.value.contains(event.target as Node)) {
    showFilters.value = false
  }
}

// Computed para el texto del filtro activo
const activeFilterText = computed(() => {
  if (!filter.value) return ''
  
  switch (filter.value) {
    case 'recent':
      return 'Más recientes'
    case 'oldest':
      return 'Más antiguos'
    default:
      return ''
  }
})

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

// Watch para verificar si la cotización seleccionada sigue en la lista filtrada
watch([filteredSubmissions, selectedSubmissionId], ([newFilteredSubmissions, currentSelectedId]) => {
  if (currentSelectedId && newFilteredSubmissions.length > 0) {
    const isSelectedSubmissionInFiltered = newFilteredSubmissions.some(submission => submission.id === currentSelectedId)
    if (!isSelectedSubmissionInFiltered) {
      selectedSubmissionId.value = null
      emit('quote-deselected')
    }
  }
})

// Montaje del componente
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Desmontaje del componente
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <section class="quotes-list">
    <header>
      <h2>{{ title }}</h2>
      <div class="filter-wrapper" ref="filterWrapper">
        <button class="filter-btn" :class="{ 'has-filter': filter }" @click="toggleFilterOptions">
          <span class="material-symbols-outlined">tune</span>
        </button>
        <div v-if="showFilters" class="filter-options">
          <button 
            :class="{ 'active': filter === 'recent' }" 
            @click="setFilter('recent')"
          >
            Más recientes
            <span v-if="filter === 'recent'" class="material-symbols-outlined">check</span>
          </button>
          <button 
            :class="{ 'active': filter === 'oldest' }" 
            @click="setFilter('oldest')"
          >
            Más antiguos
            <span v-if="filter === 'oldest'" class="material-symbols-outlined">check</span>
          </button>
          <button
            v-if="filter"
            @click="setFilter(undefined)"
            class="clear-filter"
          >
            Limpiar filtro
          </button>
        </div>
      </div>
    </header>

    <div class="card-list">
      <QuoteCard
        v-for="submission in filteredSubmissions"
        :key="submission.id"
        :quote="submission"
        :isSelected="selectedSubmissionId === submission.id"
        @quote-selected="handleQuoteSelected"
      />
      <section v-if="filteredSubmissions.length === 0" class="no-selection">
        <div class="no-selection-content">
            <span class="material-symbols-outlined md-icon">description</span>
            <p>No hay formularios disponibles</p>
        </div>
      </section>
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
  border: 0.0625rem solid var(--border-light);
  border-radius: 10px;
  background-color: var(--neutral-white);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: var(--neutral-gray-50);
}

.filter-btn.has-filter {
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  border-color: var(--principal-primary);
}

.filter-btn.has-filter:hover {
  background-color: var(--principal-primary-hover);
}

.filter-options {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: var(--neutral-white);
  border: 0.0625rem solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 0.125rem 0.375rem rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
  min-width: 12.5rem;
}

.filter-options button {
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-options button:hover {
  background-color: var(--neutral-gray-50);
}

.filter-options button.active {
  background-color: var(--principal-primary-50);
  color: var(--principal-primary);
  font-weight: 500;
}

.clear-filter {
  border-top: 1px solid var(--border-light) !important;
  color: var(--principal-primary) !important;
  font-weight: 500 !important;
}

.card-list {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 1rem;
  min-height: 100%;
  padding-bottom: 1.25rem;
}

.no-selection {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-selection-content {
    text-align: center;
    color: var(--neutral-gray-600);
}

.no-selection-content .material-symbols-outlined {
    font-size: clamp(2.5rem, 6vw, 3rem);
    margin-bottom: 1rem;
    opacity: 0.5;
}
</style>