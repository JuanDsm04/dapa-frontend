<script setup lang="ts">
import { ref } from 'vue'
import OrderList from '@/components/assignments/OrderList.vue';
import AssigmentForm from '@/components/assignments/AssigmentForm.vue';
import OrderTracking from '@/components/assignments/OrderTracking.vue';
import type { Order } from '@/types/order';

const activeTab = ref<'left' | 'right'>('left')
const selectedOrder = ref<Order | null>(null)
const showDetailView = ref(false)

const handleOrderSelected = (order: Order) => {
  selectedOrder.value = order
  showDetailView.value = true
}

const handleBackToList = () => {
  showDetailView.value = false
  selectedOrder.value = null
}
</script>

<template>
  <main>
    <header>
      <h1 class="text-title">Control de pedidos y asignaciones</h1>
    </header>

    <!-- Switch para cambiar entre pestañas -->
    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Pendientes</div>
      <div class="toggle-button" @click="activeTab = 'right'">En progreso</div>
    </div>

    <!-- Pedidos pendientes -->
    <section class="pending-orders" v-if="activeTab === 'left'">
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="Pendientes"
              :defaultStatuses="['pending', 'assigned']"
              :availableFilters="[
                { value: 'recent', label: 'Fecha más reciente' },
                { value: 'oldest', label: 'Fecha más antigua' },
                { value: 'pending', label: 'Pendiente de asignar'},
                { value: 'assigned', label: 'Asignado en espera' },
              ]"
              @order-selected="handleOrderSelected"
            />
        </div>
        <!-- Detalles - se muestra en móvil cuando hay una orden seleccionada -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <AssigmentForm 
              :selectedOrder="selectedOrder" 
              @back-to-list="handleBackToList"
            />
        </div>
    </section>

    <!-- Pedidos en progreso -->
    <section class="pending-orders" v-else>
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="En progreso"
              :defaultStatuses="['pickup', 'collected', 'delivered']"
              :availableFilters="[
                { value: 'pickup', label: 'En camino a recoger' },
                { value: 'collected', label: 'Carga recogida' },
                { value: 'delivered', label: 'Completado' }
              ]"
              @order-selected="handleOrderSelected"
            />
        </div>
        <!-- Detalles - se muestra en móvil cuando hay una orden seleccionada -->
        <div class="details" :class="{ 'mobile-shown': showDetailView }">
            <OrderTracking 
              :selectedOrder="selectedOrder" 
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
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 1;
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

  /* Título principal de la página */
  .text-title {
    margin-left: 50px;
    font-size: 1.5rem;
  }

  /* Switch */
  .toggle-wrapper {
    width: 250px;
    height: 50px;
    font-size: 0.9rem;
    align-items: center;
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