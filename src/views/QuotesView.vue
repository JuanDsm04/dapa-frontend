<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import InformationQuote from '@/components/quotes/InformationQuote.vue';
import QuotesList from '@/components/quotes/QuotesList.vue';
import { getSubmissions, getSubmissionById } from '@/services/submissionService';
import {  type Submission } from '@/types/form';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const submissions = ref<Submission[]>([])
const selectedSubmission = ref<Submission | undefined>(undefined)
const isLoading = ref(false)
const showDetailView = ref(false)
const selectedSubmissionId = ref<string | number | null>(null)

onMounted(async()=>{
  await loadSubmissions()
})

const loadSubmissions = async() => {
  try{
    submissions.value = await getSubmissions()
  }catch(err){
    const error = err as Error
    console.error('Error cargando formularios:', error)
    toast.error(`Error al cargar formularios: ${error.message}`)
  }
}

const handleQuoteSelected = async (submission: Submission) => {
  try {
    isLoading.value = true
    selectedSubmissionId.value = submission.id
    selectedSubmission.value = await getSubmissionById(submission.id)
    showDetailView.value = true
  } catch (error) {
    console.error('Error loading submission details:', error)
    toast.error('Error cargando los detalles del formulario')
  } finally {
    isLoading.value = false
  }
}

const handleBackToList = () => {
  showDetailView.value = false
  selectedSubmission.value = undefined
  selectedSubmissionId.value = null
}

const pendingSubmissions = computed(() => {
  return submissions.value.filter(submission => submission.status === 'pending')
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
            <QuotesList 
              title="Pendientes" 
              :submissions="pendingSubmissions" 
              :selectedSubmissionId="selectedSubmissionId"
              @quote-selected="handleQuoteSelected"
            />
        </div>
        <!-- Detalles -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <InformationQuote 
              :submission="selectedSubmission"
              @back-to-list="handleBackToList"
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
}

.pending-orders {
  width: 100%;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  height: calc(100vh - 150px); 
  background-color: var(--white);
  border-radius: 10px;
}

.pending-orders .list {
  overflow-y: auto;
}

.pending-orders .details {
  display: block;
  overflow-y: auto;
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
    margin-left: 50px;
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