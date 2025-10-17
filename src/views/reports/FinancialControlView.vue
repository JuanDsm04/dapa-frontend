<script setup lang="ts">
import ReportFilter from '@/components/filters/FinancialControlFilter.vue';
import { default as ExpenseTable, default as IncomeTable } from '@/components/Table.vue';
import { ref } from 'vue';

const activeTab = ref('left');

</script>

<template>
  <main>
    <header>
      <button class="btn-back" @click="$router.back()">
        <span class="material-symbols-outlined md-icon">arrow_back</span>
      </button>
      <h1>Control Financiero</h1>
    </header>
    <div class="filters-toggle-row">
      <ReportFilter />
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
          :items="[]"
          :columns="[
            { label: 'ID', field: 'id' },
            { label: 'Fecha', field: 'date' },
            { label: 'Tipo', field: 'type' },
            { label: 'Monto (Q)', field: 'amount' },
            { label: 'Categoría', field: 'category' },
            { label: 'Método de pago', field: 'paymentMethod' },
            { label: 'Responsable', field: 'responsable' },
            { label: 'Descripción', field: 'desc' },
          ]"
          :viewOnly="true"
          @edit="() => {}"
          @delete="() => {}"
        />
      </div></div>
      
      <div class="kpi-wrapper" v-if="activeTab == 'right'">
        <div class="table-wrapper">
          <ExpenseTable
            :items="[]"
            :columns="[
              { label: 'ID', field: 'id' },
              { label: 'Fecha', field: 'date' },
              { label: 'Tipo', field: 'type' },
              { label: 'E. Temporal', field: 'tempEmployee' },
              { label: 'Descripción', field: 'description' },
              { label: 'Tipo de pago', field: 'paymentType' },
              { label: 'Costo', field: 'amount' },
            ]"
            :viewOnly="true"
            @edit="() => {}"
            @delete="() => {}"
          />
        </div>
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
