<script setup lang="ts">
import ReportFilter from '@/components/filters/FinancialControlFilter.vue'
import { default as ExpenseTable, default as IncomeTable } from '@/components/Table.vue'
import ExpenseForm from '@/components/ExpenseForm.vue'
import { getFinancialControlIncome, getFinancialControlSpending } from '@/services/financialReportService'
import { getExpenseTypes, createExpense, createExpenseType } from '@/services/expenseService'
import type { Expense, ExpenseType } from '@/types/expense'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const activeTab = ref('left')
const showModal = ref(false)
const loading = ref(false)
const expenseTypes = ref<ExpenseType[]>([])

const incomeItems = ref<any[]>([])
const expenseItems = ref<any[]>([])

const openModal = async () => {
  loading.value = true
  try {
    const response = await getExpenseTypes()
    expenseTypes.value = response.data || []
    showModal.value = true
  } catch (error) {
    toast.error('Error al obtener los tipos de egreso')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}

const handleCreateExpenseType = async (payload: Partial<ExpenseType>): Promise<ExpenseType | null> => {
  try {
    const newType = await createExpenseType(payload)
    toast.success('Nuevo tipo de egreso registrado exitosamente')
    return newType.data 
  } catch (error) {
    toast.error('Error al registrar el tipo de egreso')
    return null
  }
}

const handleCreateOrUpdateExpense = async (payload: Partial<Expense>) => {
  loading.value = true
  try {
    let typeId = payload.typeId

     if (!typeId && payload.expenseType) {
      const newType = await handleCreateExpenseType({ type: payload.expenseType })
      
      if (!newType?.id) {
        toast.error('Error al crear el tipo de egreso')
        loading.value = false
        return
      }
      typeId = newType.id
    }

    if (!typeId) {
      toast.error('Debe seleccionar o crear un tipo de egreso')
      loading.value = false
      return
    }

    await createExpense({
      date: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
      typeId: typeId,
      temporalEmployee: payload.temporalEmployee === true,
      description: payload.description || '',
      amount: payload.amount
    })

    toast.success('Egreso registrado exitosamente')
    closeModal()
    
    await fetchAll()
    expenseTypes.value = (await getExpenseTypes()) || []
    
  } catch (error) {
    console.error('Error creating expense:', error)
    toast.error('Error al registrar el egreso')
  } finally {
    loading.value = false
  }
}


const mapIncome = (rows: any[]) => rows.map((r: any, idx: number) => ({
  id: idx + 1,
  date: formatDate(r.date),
  type: r.in_type,
  amount: r.amount,
  category: '',
  paymentMethod: r.payment_method ?? 'N/A',
  responsable: r.assigned && r.assigned.trim() !== '' ? r.assigned : 'Sin responsable',
  userId: r.user_id ?? null,
  desc: r.description ?? ''
}))

const mapExpenses = (rows: any[]) => rows.map((r: any, idx: number) => ({
  id: idx + 1,
  date: formatDate(r.date),
  type: r.ex_type,
  tempEmployee: !!r.temporal_employee,
  description: r.description ?? '',
  paymentType: 'N/A',
  amount: r.amount
}))


const formatDate = (s: string | Date | undefined | null) => {
  if (!s) return ''
  const d = new Date(String(s))
  try {
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
  } catch (e) {
    return d.toLocaleDateString()
  }
}

const extractRows = (resp: any): any[] => {
  if (!resp) return []
  if (Array.isArray(resp)) return resp
  if (resp.data && Array.isArray(resp.data)) return resp.data
  if (resp.result && Array.isArray(resp.result)) return resp.result
  if (resp.items && Array.isArray(resp.items)) return resp.items
  return []
}

const fetchAll = async (startDate?: string, endDate?: string) => {
  try {
    const inc = await getFinancialControlIncome(startDate, endDate)
    const rows = extractRows(inc)
    incomeItems.value = mapIncome(rows)
  } catch (e) {
    console.error('Error fetching income', e)
    incomeItems.value = []
  }

  try {
    const exp = await getFinancialControlSpending(startDate, endDate)
    const rows = extractRows(exp)
    expenseItems.value = mapExpenses(rows)
  } catch (e) {
    console.error('Error fetching expenses', e)
    expenseItems.value = []
  }
}

const handleFilterChange = (payload: { startDate?: string; endDate?: string; search?: string }) => {
  const { startDate, endDate } = payload || {}
  fetchAll(startDate, endDate)
}

onMounted(() => {
  fetchAll()
})

const myTable = {
  dom: 'Bfrtip',
  buttons: [
    {
      extend: 'pdf',
      text: `<span class="material-symbols-outlined sm-icon">picture_as_pdf</span> PDF`,
      title: 'Reporte Financiero', 
      orientation: 'landscape',    
      pageSize: 'A4',              
      exportOptions: {             
        columns: ':visible'
      }
    },
    { extend: 'csv', text: `<span class="material-symbols-outlined sm-icon">download</span> CSV`},
  ],
}

</script>

<template>
  <main>
    <header>
      <button class="btn-back" @click="$router.back()">
        <span class="material-symbols-outlined md-icon">arrow_back</span>
      </button>
      <h1>Control Financiero</h1>
      <button class="add-btn" @click="openModal" :disabled="loading">
        {{ loading ? 'Cargando...' : '+ Agregar Egreso' }}
      </button>
    </header>
    <div class="filters-toggle-row">
      <ReportFilter @filter-change="handleFilterChange" />
      <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
        <div class="toggle-indicator"></div>
        <div class="toggle-button" @click="activeTab = 'left'">Ingresos</div>
        <div class="toggle-button" @click="activeTab = 'right'">Egresos</div>
      </div>
    </div>
    <section>
      <div class="kpi-wrapper" v-if="activeTab == 'left'">
        <div class="table-wrapper">
          <IncomeTable
            :items="incomeItems"
            :columns="[
              { label: 'ID', field: 'id' },
              { label: 'Fecha', field: 'date' },
              { label: 'Tipo', field: 'type' },
              { label: 'Monto (Q)', field: 'amount' },
              { label: 'Método de pago', field: 'paymentMethod' },
              { label: 'Responsable', field: 'responsable' },
              { label: 'Descripción', field: 'desc' }
            ]"
            :options="myTable"
            :viewOnly="true"
            @edit="() => {}"
            @delete="() => {}"
          />
        </div>
      </div>

      <div class="kpi-wrapper" v-if="activeTab == 'right'">
        <div class="table-wrapper">
          <ExpenseTable
            :items="expenseItems"
            :columns="[
              { label: 'ID', field: 'id' },
              { label: 'Fecha', field: 'date' },
              { label: 'Tipo', field: 'type' },
              { label: 'E. Temporal', field: 'tempEmployee' },
              { label: 'Descripción', field: 'description' },
              { label: 'Costo', field: 'amount' }
            ]"
            :options="myTable"
            :viewOnly="true"
            @edit="() => {}"
            @delete="() => {}"
          />
        </div>
      </div>
    </section>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <article>
        <header>
          <h3>Agregar Egreso</h3>
          <button class="close-btn" @click="closeModal">
            <span class="material-symbols-outlined md-icon">close</span>
          </button>
        </header>
        <section>
          <ExpenseForm :expenseTypes="expenseTypes" @submit="handleCreateOrUpdateExpense" />
        </section>
      </article>
    </div>
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
  justify-content: start;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
}

section {
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: stretch;
}

.filters-toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.filters-toggle-row > *:first-child {
  flex: 1;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

.toggle-wrapper {
  display: flex;
  background-color: var(--neutral-gray-200);
  border-radius: 10px;
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 60px;
  padding: 6px;
  font-family: sans-serif;
  font-weight: bold;
}

.toggle-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background-color: var(--neutral-white);
  border-radius: 10px;
  transition: all 0.3s ease;
  z-index: 1;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
}

.active-left .toggle-indicator {
  left: 6px;
}

.active-right .toggle-indicator {
  left: 50%;
}

.btn-back{
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  padding: 0.75rem;
  background: none;
  cursor: pointer;
}

.btn-back:hover{
  background-color: var(--neutral-gray-200);
}

.btn-back:active{
  background-color: var(--neutral-gray-300);
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
}

.add-btn:hover:not(:disabled) {
  background-color: var(--principal-primary-hover);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--shadow-dark);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--neutral-white);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px var(--shadow-dark);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-base);
}

article header h3 {
  font-size: clamp(1.1rem, 1vw + 0.5rem, 1.5rem);
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--neutral-gray-400);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--neutral-gray-600);
}

@media (max-width: 770px) {
  main {
    padding: 2rem 1rem;
  }

  main header {
    margin-top: 3rem;
    gap: 1rem;
    align-items: stretch;
    font-size: 0.8rem;
    align-items: center;
  }

  h1 {
    margin-left: 0;
    text-align: center;
  }

  section {
    gap: 0.5rem;
  }

  .table-wrapper {
    justify-content: center;
  }

  .filters-toggle-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toggle-wrapper{
    align-self: center;
  }
}
</style>
