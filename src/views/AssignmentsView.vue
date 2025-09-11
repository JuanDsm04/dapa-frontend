<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import OrderList from '@/components/assignments/OrderList.vue';
import AssigmentForm from '@/components/assignments/AssigmentForm.vue';
import OrderTracking from '@/components/assignments/OrderTracking.vue';
import { getOrders } from '@/services/orderService';
import type { Order } from '@/types/order';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const activeTab = ref<'left' | 'right'>('left')
const selectedOrder = ref<Order | null>(null)
const showDetailView = ref(false)
const orders = ref<Order[]>([])
const loading = ref(false)

// Computed para órdenes pendientes
const pendingOrders = computed(() => {
  return orders.value.filter(order => 
    ['pending', 'assigned'].includes(order.status)
  )
})

// Computed para órdenes en progreso
const inProgressOrders = computed(() => {
  return orders.value.filter(order => 
    ['pickup', 'collected', 'delivered'].includes(order.status)
  )
})

// Cargar todas las órdenes
const loadOrders = async () => {
  loading.value = true;
  try {
    orders.value = await getOrders()
  } catch (err) {
    const error = err as Error
    console.error('Error cargando órdenes:', error)
    toast.error(`Error al cargar órdenes: ${error.message}`)
  } finally {
    loading.value = false;
  }
}

const handleOrderSelected = (order: Order) => {
  selectedOrder.value = order
  showDetailView.value = true
}

const handleBackToList = () => {
  showDetailView.value = false
  selectedOrder.value = null
}

// Watch para detectar cambio de pestañas y limpiar selección
watch(activeTab, () => {
  showDetailView.value = false
  selectedOrder.value = null
})

// Cargar órdenes al montar
onMounted(async () => {
  await loadOrders()
})
</script>

<template>
  <main>
    <header>
      <h1 class="text-title">Control de servicios y asignaciones</h1>
    </header>

    <!-- Switch para cambiar entre pestañas -->
    <div :class="['toggle-wrapper', activeTab === 'left' ? 'active-left' : 'active-right']">
      <div class="toggle-indicator"></div>
      <div class="toggle-button" @click="activeTab = 'left'">Pendientes</div>
      <div class="toggle-button" @click="activeTab = 'right'">En progreso</div>
    </div>

    <!-- Loading global -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Servicios pendientes -->
    <section class="orders-section" v-else-if="activeTab === 'left'">
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="Pendientes"
              :orders="pendingOrders"
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

    <!-- Servicios en progreso -->
    <section class="orders-section" v-else>
        <!-- Lista de órdenes - se oculta en móvil cuando hay una orden seleccionada -->
        <div class="list" :class="{ 'mobile-hidden': showDetailView }">
            <OrderList
              title="En progreso"
              :orders="inProgressOrders"
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
  position: relative;
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
  background-color: var(--neutral-gray-200);
  border-radius: 10px;
  position: relative;
  width: 18.75rem; /* 300px → rem */
  height: 3.75rem; /* 60px → rem */
  padding: 0.375rem; /* 6px → rem */
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-indicator {
  position: absolute;
  top: 0.375rem; /* 6px → rem */
  left: 0.375rem; /* 6px → rem */
  width: calc(50% - 0.375rem);
  height: calc(100% - 0.75rem); /* 12px → rem */
  background-color: var(--neutral-white);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.toggle-button {
  flex: 1;
  text-align: center;
  line-height: 3rem; /* 48px → rem */
  cursor: pointer;
  z-index: 1;
  user-select: none;
}

.active-left .toggle-indicator {
  left: 0.375rem;
}

.active-right .toggle-indicator {
  left: 50%;
}

.orders-section {
  width: 100%;
  display: grid;
  grid-template-columns: 0.75fr 1fr;
  height: calc(100vh - 15.625rem); /* 250px → rem */
  background-color: var(--neutral-white);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.orders-section .list {
  overflow-y: auto;
}

.orders-section .details {
  display: block;
  overflow-y: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-general);
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
  .orders-section {
    grid-template-columns: 1fr;
  }

  .orders-section .details {
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
    margin-left: 3.125rem; /* 50px → rem */
    font-size: 1.5rem;
  }

  /* Switch */
  .toggle-wrapper {
    width: 15.625rem; /* 250px → rem */
    height: 3.125rem; /* 50px → rem */
    font-size: 0.9rem;
    align-items: center;
  }

  /* Responsive behavior para móvil */
  .orders-section .list.mobile-hidden {
    display: none;
  }

  .orders-section .details.mobile-shown {
    display: block;
  }

  .orders-section .details {
    display: none;
  }
}
</style>