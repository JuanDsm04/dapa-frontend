<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import InformationQuote from '@/components/quotes/InformationQuote.vue';
import QuotesList from '@/components/quotes/QuotesList.vue';
import { getSubmissions, getSubmissionById } from '@/services/submissionService';
import { type Submission } from '@/types/form';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const submissions = ref<Submission[]>([])
const selectedSubmission = ref<Submission | undefined>(undefined)
const loading = ref(false)
const showDetailView = ref(false)
const selectedSubmissionId = ref<string | number | null>(null)

// Control de polling
const POLLING_INTERVAL = 5000
let pollingTimer: NodeJS.Timeout | null = null
const isModalOpen = ref(false)
const isInteracting = ref(false)

// Función para comparar y actualizar submissions
const smartUpdateSubmissions = (newSubmissions: Submission[]) => {
  if (submissions.value.length === 0) {
    submissions.value = newSubmissions
    return
  }

  const currentSubmissionsMap = new Map(submissions.value.map(sub => [sub.id, sub]))
  const newSubmissionsMap = new Map(newSubmissions.map(sub => [sub.id, sub]))

  // Actualizar submissions existentes y agregar nuevas
  const updatedSubmissions: Submission[] = []

  submissions.value.forEach(currentSub => {
    const newSub = newSubmissionsMap.get(currentSub.id)
    if (newSub) {
      if (selectedSubmission.value?.id === currentSub.id) {
        updatedSubmissions.push(currentSub)
      } else {
        if (JSON.stringify(currentSub) !== JSON.stringify(newSub)) {
          updatedSubmissions.push(newSub)
        } else {
          updatedSubmissions.push(currentSub)
        }
      }
    }
  })

  // Agregar nuevas submissions que no existían antes
  newSubmissions.forEach(newSub => {
    if (!currentSubmissionsMap.has(newSub.id)) {
      updatedSubmissions.push(newSub)
    }
  })

  submissions.value = updatedSubmissions
}

// Obtener cotizaciones
const loadSubmissions = async (showLoading = true, isPolling = false) => {
  // Si hay un modal abierto o el usuario está interactuando, no actualizar
  if (isPolling && (isModalOpen.value || isInteracting.value)) {
    return
  }

  if (showLoading) {
    loading.value = true;
  }
  
  try {
    const newSubmissions = await getSubmissions()
    
    if (isPolling) {
      smartUpdateSubmissions(newSubmissions)
      
      if (selectedSubmission.value) {
        const updatedSelectedSubmission = newSubmissions.find(s => s.id === selectedSubmission.value!.id)
        if (updatedSelectedSubmission && 
            JSON.stringify(selectedSubmission.value) !== JSON.stringify(updatedSelectedSubmission)) {
          selectedSubmission.value = updatedSelectedSubmission
        }
      }
    } else {
      submissions.value = newSubmissions
    }
  } catch (err) {
    const error = err as Error
    console.error('Error cargando formularios:', error)
    
    if (showLoading) {
      toast.error(`Error al cargar formularios: ${error.message}`)
    }
  } finally {
    if (showLoading) {
      loading.value = false;
    }
  }
}

// Iniciar polling
const startPolling = () => {
  stopPolling()
  
  pollingTimer = setInterval(async () => {
    await loadSubmissions(false, true)
  }, POLLING_INTERVAL)
}

// Detener polling
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// Manejar selección de cotización
const handleQuoteSelected = async (submission: Submission) => {
  loading.value = true;
  try {
    selectedSubmissionId.value = submission.id
    selectedSubmission.value = await getSubmissionById(submission.id)
    showDetailView.value = true
  } catch (error) {
    console.error('Error loading submission details:', error)
    toast.error('Error cargando los detalles del formulario')
  } finally {
    loading.value = false
  }
}

// Manejar deselección de cotización
const handleQuoteDeselected = () => {
  selectedSubmission.value = undefined
  selectedSubmissionId.value = null
  showDetailView.value = false
}

// Manejar regreso a la lista
const handleBackToList = async (payload?: { id: number | string, status: string } | null) => {
  showDetailView.value = false
  selectedSubmission.value = undefined
  selectedSubmissionId.value = null

  if (payload && payload.id != null) {
    const idNum = typeof payload.id === 'string' ? parseInt(payload.id, 10) : payload.id
    const idx = submissions.value.findIndex(s => s.id === idNum)
    if (idx !== -1) {
      submissions.value[idx] = {
        ...submissions.value[idx],
        status: payload.status as any
      }
    } else {
      await loadSubmissions(false, false)
    }
  } else {
    await loadSubmissions(false, false)
  }
}

// Detectar cuando se abre/cierra un modal
const handleModalStateChange = (isOpen: boolean) => {
  isModalOpen.value = isOpen
}

// Detectar cuando el usuario está interactuando con inputs
const handleInteractionStateChange = (isActive: boolean) => {
  isInteracting.value = isActive
}

// Filtrar cotizaciones pendientes
const pendingSubmissions = computed(() => {
  return submissions.value.filter(submission => submission.status === 'pending')
})

// Cargar submissions al montar e iniciar polling
onMounted(async () => {
  await loadSubmissions()
  startPolling()
})

// Limpiar polling al desmontar
onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <main>
    <header>
      <h1>Cotizaciones</h1>
    </header>

    <section class="pending-orders">
        <!-- Lista de órdenes -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <div v-if="loading" class="loading-overlay">
              <div class="spinner"></div>
            </div>
            <QuotesList 
              title="Pendientes" 
              :submissions="pendingSubmissions" 
              :selectedSubmissionId="selectedSubmissionId"
              @quote-selected="handleQuoteSelected"
              @quote-deselected="handleQuoteDeselected"
            />
        </div>
        <!-- Detalles -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <InformationQuote 
              :submission="selectedSubmission"
              @back-to-list="handleBackToList"
              @modal-state-change="handleModalStateChange"
              @interaction-state-change="handleInteractionStateChange"
            />
        </div>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
}

.pending-orders {
  width: 100%;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  height: calc(100vh - 9.375rem);
  background-color: var(--neutral-white);
  border-radius: 10px;
   box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.pending-orders .list {
  overflow-y: auto;
}

.pending-orders .details {
  display: block;
  overflow-y: auto;
}

.list{
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--neutral-gray-50);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid var(--border-light);
  border-top: 0.25rem solid var(--principal-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 770px) {
  .pending-orders {
    grid-template-columns: 1fr;
  }

  .pending-orders .details {
    display: none;
  }

  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }
  
  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-content {
    text-align: center;
  }

  h1 {
    margin-left: 3.125rem;
  }

  /* Responsive behavior para móvil */
  .pending-orders .list.mobile-hidden {
    display: none;
  }

  .pending-orders .details.mobile-shown {
    display: block;
  }

  .pending-orders .details {
    display: none;
  }
}
</style>