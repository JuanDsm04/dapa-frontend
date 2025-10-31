<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getOrders } from '@/services/orderService'
import { getUsers } from '@/services/userService'
import { getVehicles } from '@/services/vehicleService'
import TableUsers from '@/components/Table.vue'
import type { Order } from '@/types/order'
import type { User } from '@/types/user'
import type { Vehicle } from '@/types/vehicle'

// Estados
const orders = ref<Order[]>([])
const users = ref<User[]>([])
const vehicles = ref<Vehicle[]>([])
const loading = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// Mapeo de tipos de carga
const cargoTypeMap: Record<string, string> = {
    move: 'Mudanza',
    cargo: 'Flete',
    corporate: 'Empresarial'
}

// Computed para órdenes completadas
const completedOrders = computed(() => {
    return orders.value.filter(order => order.status === 'delivered')
})

// Computed para obtener información del conductor
const getDriverName = (userId?: number) => {
    if (!userId || !users.value.length) return 'No especificado'
    const driver = users.value.find(user => user.id === userId)
    return driver ? `${driver.name} ${driver.lastName}` : 'No encontrado'
}

// Computed para obtener información del vehículo
const getVehicleInfo = (vehicleId?: number) => {
    if (!vehicleId || !vehicles.value.length) return 'No especificado'
    const vehicle = vehicles.value.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} - ${vehicle.licensePlate}` : 'No encontrado'
}

// Computed para obtener información del ayudante
const getHelperName = (helperId?: number) => {
    if (!helperId || !users.value.length) return 'No especificado'
    const helper = users.value.find(user => user.id === helperId)
    return helper ? `${helper.name} ${helper.lastName}` : 'No encontrado'
}

// Función para formatear fecha
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

// Función para formatear precio
const formatPrice = (amount: any) => {
    if (!amount) return 'Q 0.00'
    return `Q ${parseFloat(amount).toFixed(2)}`
}

// Cargar datos
const loadData = async () => {
    loading.value = true
    try {
        const [ordersData, usersData, vehiclesData] = await Promise.all([
            getOrders(),
            getUsers(),
            getVehicles()
        ])

        orders.value = ordersData
        users.value = usersData
        vehicles.value = vehiclesData

    } catch (error) {
        console.error('Error cargando datos:', error)
        toast.error('Error al cargar los datos')

    } finally {
        loading.value = false
    }
}

// Abrir modal de detalles
const handleViewDetails = (order: Order) => {
    selectedOrder.value = order
    showDetailModal.value = true
}

// Cerrar modal
const closeModal = () => {
    showDetailModal.value = false
    selectedOrder.value = null
}

// Montar componente
onMounted(async () => {
    await loadData()
})
</script>

<template>
    <main>
        <header>
            <button class="btn-back" @click="$router.back()">
                <span class="material-symbols-outlined md-icon">arrow_back</span>
            </button>
            <h1>Historial de servicios</h1>
        </header>

        <section>
            <div v-if="loading" class="loading-overlay">
                <div class="spinner"></div>
            </div>

            <div v-else-if="completedOrders.length === 0" class="no-data">
                <span class="material-symbols-outlined">history</span>
                <p>No hay servicios completados en el historial</p>
            </div>

            <TableUsers v-else :items="completedOrders" :columns="[
                {
                    label: 'Fecha',
                    field: 'date',
                    formatter: (value: string) => formatDate(value)
                },
                {
                    label: 'Cliente',
                    field: 'clientName',
                },
                {
                    label: 'Tipo',
                    field: 'type',
                    formatter: (value: string) => cargoTypeMap[value] || value
                },
                {
                    label: 'Origen',
                    field: 'origin'
                },
                {
                    label: 'Destino',
                    field: 'destination'
                },
                {
                    label: 'Monto',
                    field: 'totalAmount',
                    formatter: (value: any) => formatPrice(value)
                }
            ]" :showView="true" :showEdit="false" :showDelete="false" @view="handleViewDetails" />
        </section>
    </main>

    <!-- Modal de detalles -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeModal">
        <article class="modal-content">
            <header class="modal-header">
                <h3>Detalles del servicio</h3>
                <button class="close-btn" @click="closeModal">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </header>

            <section class="modal-body" v-if="selectedOrder">
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Fecha</label>
                        <p>{{ formatDate(selectedOrder.date) }}</p>
                    </div>

                    <div class="detail-item">
                        <label>Cliente</label>
                        <p>{{ selectedOrder.clientName }}</p>
                    </div>

                    <div class="detail-item">
                        <label>Teléfono</label>
                        <p>{{ selectedOrder.clientPhone }}</p>
                    </div>

                    <div class="detail-item">
                        <label>Tipo de servicio</label>
                        <p><strong>{{ cargoTypeMap[selectedOrder.type || ''] }}</strong></p>
                    </div>

                    <div class="detail-item">
                        <label>Conductor</label>
                        <p><strong>{{ getDriverName(selectedOrder.userId) }}</strong></p>
                    </div>

                    <div class="detail-item">
                        <label>Vehículo</label>
                        <p><strong>{{ getVehicleInfo(selectedOrder.vehicleId) }}</strong></p>
                    </div>

                    <div class="detail-item">
                        <label>Ayudante</label>
                        <p><strong>{{ getHelperName(selectedOrder.helperId) }}</strong></p>
                    </div>

                    <div class="detail-item">
                        <label>Monto total</label>
                        <p class="amount"><strong>{{ formatPrice(selectedOrder.totalAmount) }}</strong></p>
                    </div>

                    <div class="detail-item full-width">
                        <label>Origen</label>
                        <p><strong>{{ selectedOrder.origin || 'No especificado' }}</strong></p>
                    </div>

                    <div class="detail-item full-width">
                        <label>Destino</label>
                        <p><strong>{{ selectedOrder.destination || 'No especificado' }}</strong></p>
                    </div>

                    <div class="detail-item full-width">
                        <label>Observaciones</label>
                        <p>{{ selectedOrder.details || 'Sin observaciones adicionales' }}</p>
                    </div>
                </div>
            </section>
        </article>
    </div>
</template>

<style scoped>
main {
  display: block;
  margin: 0 auto;
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
    font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
}

section {
    width: 100%;
    min-height: calc(100vh - 150px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
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

.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--neutral-gray-600);
    padding: 3rem;
}

.no-data .material-symbols-outlined {
    font-size: clamp(3rem, 6vw, 4rem);
    opacity: 0.5;
}

.no-data p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    margin: 0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: var(--neutral-white);
    border-radius: 10px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light);
}

.modal-header h3 {
    font-size: clamp(1.3rem, 2.5vw, 1.5rem);
    font-weight: 500;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: clamp(1.3rem, 2.5vw, 1.5rem);
    color: var(--neutral-gray-400);
    cursor: pointer;
    padding: 0.5rem;
}

.close-btn:hover {
    color: var(--neutral-gray-600);
}

.modal-body {
    padding: 2rem 0rem;
    width: 100%;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 3rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-item.full-width {
    grid-column: span 2;
}

.detail-item label {
    font-size: clamp(0.8rem, 1.6vw, 0.9rem);
    color: var(--neutral-gray-600);
    font-weight: 500;
}

.detail-item p {
    margin: 0;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
    color: var(--neutral-black);
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
        width: 95%;
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

    .detail-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .detail-item.full-width {
        grid-column: span 1;
    }

    .modal-content {
        width: 95%;
    }
}

@media (max-width: 400px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
}
</style>