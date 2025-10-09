<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from '@/types/order'

const props = defineProps<{
    orderData?: Partial<Order>
    mode?: 'censored' | 'visible'
}>()

const emit = defineEmits(['start-order', 'back-to-list', 'update-status', 'show-form-responses'])

// Función para formatear el precio
const formatPrice = (amount: any) => {
    if (!amount || props.mode === 'censored') return '---'
    return `Q ${parseFloat(amount).toFixed(2)}`
}

// Mapeo de tipos de carga
const cargoTypeMap: Record<string, string> = {
    move: 'Mudanza',
    cargo: 'Flete',
    corporate: 'Empresarial'
}

// Función para obtener el tipo de carga en español
const getCargoTypeInSpanish = (type: string) => {
    if (props.mode === 'censored') return '---'
    return cargoTypeMap[type] || 'No especificado'
}

// Obtener los datos de la orden por ID
const currentOrderData = computed(() => props.orderData)

// Función para manejar el inicio de la orden
const handleStartOrder = () => {
    emit('start-order', currentOrderData.value)
}

// Función para regresar a la lista
const handleBackToList = () => {
    emit('back-to-list')
}

// Función para actualizar el estado de la orden
const handleUpdateStatus = (newStatus: string) => {
    emit('update-status', { orderId: currentOrderData.value?.id, newStatus })
}

// Función para mostrar respuestas del formulario
const handleShowFormResponses = () => {
    emit('show-form-responses')
}

// Mostrar información censurada o real
const getDisplayValue = (value: any, fallback: string = 'No especificado') => {
    if (props.mode === 'censored') return '---'
    return value || fallback
}

// Determinar qué botón de progresión mostrar
const getProgressionButton = () => {
    if (props.mode === 'censored') return null

    const status = currentOrderData.value?.status
    switch (status) {
        case 'pickup':
            return {
                text: 'Carga recogida',
                icon: 'check_circle',
                newStatus: 'collected',
                color: 'success'
            }
        case 'collected':
            return {
                text: 'Servicio completado',
                icon: 'task_alt',
                newStatus: 'delivered',
                color: 'primary'
            }
        default:
            return null
    }
}

// Computed para el botón de progresión
const progressionButton = computed(() => getProgressionButton())

// Mapeo de estados para mostrar
const statusDisplayMap = {
    'assigned': 'Información del servicio',
    'pickup': 'En camino a recoger',
    'collected': 'Carga recogida',
    'delivered': 'Completado'
}

// Función para obtener el estado en español
const getStatusInSpanish = (status: string) => {
    return statusDisplayMap[status as keyof typeof statusDisplayMap] || status
}
</script>

<template>
    <section class="driver-shipment-info">
        <header>
            <div class="header-left">
                <button class="back-btn" @click="handleBackToList">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>

                <div class="header-information">
                    <div class="header-content">
                        <h2 v-if="mode === 'censored'">{{ getStatusInSpanish('assigned') }}</h2>
                        <h2 v-else>{{ getStatusInSpanish(currentOrderData?.status || '') }}</h2>

                        <p v-if="mode === 'censored'" class="censored-info">
                            La información completa estará disponible después de aceptar el servicio.
                        </p>
                        <p v-else class="service-info">
                            Servicio #{{ currentOrderData?.id }} - {{ getCargoTypeInSpanish(currentOrderData?.type ||
                            '') }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="header-actions">
                <button class="form-btn" :class="{ 'disabled': mode === 'censored' || !currentOrderData?.submissionId }"
                    :disabled="mode === 'censored' || !currentOrderData?.submissionId" @click="handleShowFormResponses">
                    <span class="material-symbols-outlined">folder_eye</span>
                </button>
            </div>
        </header>

        <div class="info-box" :class="{ 'censored': mode === 'censored' }">

            <div v-if="!currentOrderData" class="no-data">
                <p>No hay información de orden disponible</p>
            </div>

            <template v-else>
                <!-- Información siempre visible -->
                <div class="info-item">
                    <label>Número de servicio</label>
                    <p><strong>#{{ currentOrderData.id }}</strong></p>
                </div>

                <!-- Información que puede estar censurada -->
                <div class="info-item">
                    <label>Precio</label>
                    <p>{{ formatPrice(currentOrderData.totalAmount) }}</p>
                </div>
                <div class="info-item">
                    <label>Tipo de servicio</label>
                    <p><strong>{{ getCargoTypeInSpanish(currentOrderData.type) }}</strong></p>
                </div>
                <div class="info-item">
                    <label>De aquí</label>
                    <p><strong>{{ getDisplayValue(currentOrderData.origin) }}</strong></p>
                </div>
                <div class="info-item">
                    <label>Para allá</label>
                    <p><strong>{{ getDisplayValue(currentOrderData.destination) }}</strong></p>
                </div>
                <div class="info-item full-width">
                    <label>Observaciones</label>
                    <p><strong>{{ getDisplayValue(currentOrderData.details, 'Sin observaciones adicionales') }}</strong>
                    </p>
                </div>
            </template>

            <!-- Botón para iniciar orden solo en modo censurado -->
            <div v-if="mode === 'censored'" class="action-section">
                <button class="start-order-btn" @click="handleStartOrder">
                    <span class="material-symbols-outlined">play_arrow</span>
                    Aceptar e iniciar servicio
                </button>
            </div>

            <!-- Botón de progresión para órdenes en curso -->
            <div v-if="mode === 'visible' && progressionButton" class="action-section">
                <button class="progression-btn" :class="`progression-btn--${progressionButton.color}`"
                    @click="handleUpdateStatus(progressionButton.newStatus)">
                    <span class="material-symbols-outlined">{{ progressionButton.icon }}</span>
                    {{ progressionButton.text }}
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.driver-shipment-info {
    padding: 0.5rem;
    background-color: var(--neutral-white);
    border-radius: 10px;
    height: 100%;
}

header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    position: relative;
    gap: 1rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    display: block;
}

.back-btn:hover {
    color: var(--principal-primary-hover);
}

.header-information h2 {
    font-weight: 600;
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    margin: 0;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.form-btn {
    padding: 0.6rem;
    cursor: pointer;
    font-size: clamp(1rem, 2vw, 1.2rem);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55px;
    color: var(--principal-primary);
    border: 1px solid var(--principal-primary);
    border-radius: 10px;
    background-color: var(--neutral-white);
}

.form-btn:hover:not(:disabled) {
    background-color: var(--neutral-gray-100);
}

.form-btn:disabled {
    color: var(--neutral-gray-400);
    border-color: var(--neutral-gray-300);
    cursor: not-allowed;
    opacity: 0.6;
}

.censored-info,
.service-info {
    font-size: clamp(0.8rem, 1.6vw, 0.9rem);
    color: var(--neutral-gray-600);
    margin-top: 0.5rem;
    line-height: 1.4;
}

.info-box {
    border: 1px solid var(--border-base);
    border-radius: 10px;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
    position: relative;
    background-color: var(--neutral-white);
}

.info-box.censored {
    background-color: var(--neutral-gray-25);
    border-color: var(--neutral-gray-200);
}

.no-data {
    grid-column: span 2;
    text-align: center;
    color: var(--neutral-gray-600);
    padding: 2rem;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
}

.info-item label {
    font-size: clamp(0.8rem, 1.6vw, 0.9rem);
    color: var(--neutral-gray-600);
    display: block;
    margin-bottom: 0.25rem;
}

.info-item p {
    margin: 0;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
    color: var(--neutral-black);
}

.censored .info-item p {
    color: var(--neutral-gray-400);
    font-style: italic;
}

.info-item.full-width {
    grid-column: span 2;
}

.action-section {
    grid-column: span 2;
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
}

.start-order-btn {
    background-color: var(--principal-primary);
    color: var(--neutral-white);
    border: none;
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: clamp(1rem, 2vw, 1.1rem);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
}

.start-order-btn:hover {
    background-color: var(--principal-primary-hover);
}

.start-order-btn .material-symbols-outlined {
    font-size: 1.3rem;
}

.progression-btn {
    border: none;
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: clamp(1rem, 2vw, 1.1rem);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
    color: var(--neutral-white);
}

.progression-btn--success {
    background-color: var(--principal-primary);
}

.progression-btn--success:hover {
    background-color: var(--principal-primary-hover);
}

.progression-btn--primary {
    background-color: var(--principal-primary);
}

.progression-btn--primary:hover {
    background-color: var(--principal-primary-hover);
}

.progression-btn .material-symbols-outlined {
    font-size: 1.3rem;
}

.censored-notice {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--principal-primary-25);
    border: 1px solid var(--principal-primary-100);
    border-radius: 8px;
}

.notice-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.notice-content .material-symbols-outlined {
    color: var(--principal-primary);
    font-size: 1.25rem;
    margin-top: 0.125rem;
}

.notice-content p {
    margin: 0;
    color: var(--principal-primary-dark);
    font-size: clamp(0.85rem, 1.7vw, 0.95rem);
    line-height: 1.4;
}

@media (max-width: 770px) {
    .header-left {
        display: block;
        align-items: baseline;
        gap: 1rem;
    }

    .driver-shipment-info {
        padding: 0.25rem;
    }

    .mobile-only {
        display: block;
    }

    .info-box {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1rem;
    }

    .info-item.full-width {
        grid-column: span 1;
    }

    .action-section {
        grid-column: span 1;
    }

    .start-order-btn,
    .progression-btn {
        padding: 0.8rem 1.5rem;
        font-size: clamp(0.9rem, 1.8vw, 1rem);
    }

    .notice-content {
        flex-direction: column;
        gap: 0.5rem;
    }

    .notice-content .material-symbols-outlined {
        align-self: center;
    }
}
</style>