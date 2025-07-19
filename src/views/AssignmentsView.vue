<script setup>
import { ref } from 'vue'
import OrderList from '@/components/assignments/OrderList.vue';
import AssigmentForm from '@/components/assignments/AssigmentForm.vue';
import OrderTracking from '@/components/assignments/OrderTracking.vue';

const activeTab = ref('left')
</script>

<template>
  <main>
    <header>
      <h1>Control de pedidos y asignaciones</h1>
    </header>

    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Pendientes</div>
      <div class="toggle-button" @click="activeTab = 'right'">Asignados</div>
    </div>

    <section class="pending-orders" v-if="activeTab === 'left'">
        <div class="list">
            <OrderList
              title="Pendientes"
              :defaultStatuses="['pending', 'assigned']"
              :availableFilters="[
                { value: 'recent', label: 'Fecha más reciente' },
                { value: 'oldest', label: 'Fecha más antigua' },
                { value: 'pending', label: 'Asignado en espera' },
                { value: 'assigned', label: 'Pendiente de asignar' }
              ]"
            />
        </div>
        <div class="details">
            <AssigmentForm />
        </div>
    </section>
    <section class="pending-orders" v-else>
        <div class="list">
            <OrderList
              title="Asignados"
              :defaultStatuses="['pickup', 'collected', 'transporting', 'delivered']"
              :availableFilters="[
                { value: 'in_progress', label: 'En progreso' },
                { value: 'delivered', label: 'Completado' }
              ]"
            />
        </div>
        <div class="details">
            <OrderTracking />
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

.toggle-wrapper {
  display: flex;
  background-color: #EAEEF4;
  border-radius: 10px;
  position: relative;
  width: 300px;
  height: 60px;
  padding: 6px;
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 2rem;
}

.toggle-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background-color: white;
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

.pending-orders {
  width: 100%;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  height: calc(100vh - 250px); 
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

@media (max-width: 1000px) {
  .pending-orders {
    grid-template-columns: 1fr;
  }

  .pending-orders .details {
    display: none;
  }
}

@media (max-width: 770px) {
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
}
</style>