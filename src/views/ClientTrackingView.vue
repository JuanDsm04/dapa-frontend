<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { trackOrder, type OrderTracking } from '@/services/orderService'
import OrderSteps from '@/components/assignments/OrderSteps.vue'

const route = useRoute()
const token = ref('')
const orderData = ref<OrderTracking | null>(null)
const loading = ref(false)
const error = ref('')
const showTokenInput = ref(true)

const statusSteps = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'pickup', label: 'En camino a recoger' },
  { value: 'collected', label: 'Carga recogida' },
  { value: 'delivered', label: 'Servicio completado' }
]

const statusText = computed(() => {
  if (!orderData.value) return ''
  const step = statusSteps.find(s => s.value === orderData.value?.status)
  return step?.label || orderData.value.status
})

const handleTrack = async (tokenValue?: string) => {
  const trackToken = tokenValue || token.value.trim()
  if (!trackToken) return

  loading.value = true
  error.value = ''
  orderData.value = null

  try {
    const data = await trackOrder(trackToken)
    orderData.value = data
    showTokenInput.value = false
  } catch (err: any) {
    if (err.message.includes('410')) {
      error.value = 'El código de rastreo ha expirado'
    } else if (err.message.includes('404') || err.message.includes('500')) {
      error.value = 'No se encontró ninguna orden con ese código de rastreo'
    } else {
      error.value = 'Ocurrió un error al buscar tu pedido. Por favor, intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}

// Verificar si hay un token en la URL
onMounted(() => {
  const urlToken = route.query.token as string
  if (urlToken) {
    token.value = urlToken
    handleTrack(urlToken)
  }
})
</script>

<template>
  <main>
    <header>
      <div>
        <h1>De aquí para allá</h1>
        <span>Mudanzas, fletes y traslados</span>
      </div>
      <img src="@/assets/images/logo_2.png" alt="Company logo" class="logo">
    </header>

    <!-- Información de la orden -->
    <section v-if="orderData" class="info">
      <h3>Estado actual</h3>
      <p class="info-description">
        Consulta el estado actual de tu carga. Recuerda que puedes comunicarte con nosotros para resolver tus dudas.
      </p>

      <p class="steps-info">
        1 - En camino a recoger la carga<br />
        2 - Carga recogida<br />
        3 - Servicio completado
      </p>

      <OrderSteps :orderStatus="orderData.status" />

      <div class="info-box">
        <div class="info-item">
          <label>Origen</label>
          <p>{{ orderData.origin }}</p>
        </div>
        <div class="info-item">
          <label>Destino</label>
          <p>{{ orderData.destination }}</p>
        </div>
        <div class="info-item">
          <label>Estado</label>
          <p class="status-badge">{{ statusText }}</p>
        </div>
        <div class="info-item">
          <label>Tipo de servicio</label>
          <p>{{ orderData.type === 'move' ? 'Mudanza' : orderData.type === 'cargo' ? 'Flete' : orderData.type ==='corporate' ? 'Empresarial' : '' }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  min-height: 100vh;
  padding: 3rem;
  background-color: var(--bg-general);
}

header {
  background-color: var(--neutral-white);
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
}

header h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

header span {
  color: #666;
  font-size: 1rem;
}

header img.logo {
  width: 9.375rem;
  height: auto;
}

/* Sección de información */
.info {
  background-color: var(--neutral-white);
  padding: 2rem 3rem;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.info-description {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.steps-info {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-box {
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.info-item label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  main {
    padding: 1.5rem;
  }

  header {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    text-align: center;
  }

  header h1 {
    font-size: 1.5rem;
  }

  .info {
    padding: 1.5rem;
  }

  .info h2 {
    font-size: 1.5rem;
  }

  .info-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .info-box {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>