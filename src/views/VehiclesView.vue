<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import VehicleForm from '@/components/VehicleForm.vue';
import TableVehicles from '@/components/Table.vue';
import type { HighlightConfig } from '@/types/table';
import type { Vehicle } from '@/types/vehicle';
import NotificationModal from '@/components/NotificationModal.vue';

const showModal = ref(false);
const vehicles = ref<Vehicle[]>([])
const selectedVehicle = ref<Vehicle | undefined>(undefined)
const loading = ref(false);
const activeVehicles = computed(() => vehicles.value.filter(vehicle => vehicle.isActive));

// Identificador del registro según la fecha de vencimiento de su seguro vehicular
const highlightVeh = (item: any): HighlightConfig | undefined => {
  if (!item.insuranceDate) return undefined;

  const insurance = new Date(item.insuranceDate);
  const now = new Date();

  const diffInMs = insurance.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return { borderColor: '#CC2D44', backgroundColor: '#FFF4F4' };

  } else if (diffInDays <= 7) {
    return { borderColor: '#FFB601', backgroundColor: '#FFFEEE' };
  }

  return undefined;
};

// Abrir y cerrar el modal
const openModal = () => {
  selectedVehicle.value = undefined;
  showModal.value = true;
};

const closeModal = () => {
  selectedVehicle.value = undefined;
  showModal.value = false;
};

// Preparar a un vehículo para editarlo
const handleEditVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = { ...vehicle };
  showModal.value = true;
};

// Estados para el modal de eliminación
const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref<(() => void) | null>(null)

// Eliminar a un vehículo después de su confirmación y actualizar la lista
const handleDeleteVehicle = (vehicle: Vehicle) => {
  confirmTitle.value = '¿Eliminar vehículo?'
  confirmMessage.value = `¿Estás seguro de que quieres eliminar al vehículo con placa ${vehicle.licensePlate}?`

  confirmAction.value = async () => {
    selectedVehicle.value = { ...vehicle }
    const vehicleID = selectedVehicle.value.id
    loading.value = true

    try {
      const token = localStorage.getItem('token')
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${vehicleID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      await getVehicles()
      toast.warning('Vehículo eliminado')
    } catch (error) {
      console.error("Error eliminando vehículo:", error)
      toast.error('Error eliminando vehículo')
    } finally {
      loading.value = false
    }
  }

  showConfirmModal.value = true
}

// Obtener los vehículos desde la API
const getVehicles = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    vehicles.value = data;

    // Detectar seguros vencidos
    const hoy = new Date();

    const vencidos = vehicles.value.filter((v: Vehicle) => {
      if (!v.insuranceDate) return false;
      const fechaSeguro = new Date(v.insuranceDate);
      return fechaSeguro < hoy;
    });

    if (vencidos.length > 0) {
      toast.warning(`Advertencia: Hay ${vencidos.length} vehículo(s) con el seguro vencido`, {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }

  } catch (error) {
    console.error("Error obteniendo vehículos:", error);
  }
};

// Manejar el registro o actualización de un vehículo según si tiene id o no
const handleCreationOrUpdate = async (payload: Partial<Vehicle>) => {
  const token = localStorage.getItem('token');

  try {
    let response;
    let data;

    if (payload.id) {
      response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || 'Error al actualizar el vehículo');
      }

      toast.info('Vehículo actualizado exitosamente');

    } else {
      response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || 'Error al registrar el vehículo');
      }
      toast.success('Vehículo registrado exitosamente');
    }

    getVehicles();
    closeModal();

  } catch (error) {
    const err = error as Error;
    console.error('Error al guardar vehículo:', err);
    toast.error(`Error: ${err.message}`);
    
  }
};

// Cargar la lista de vehículos al montar el componente
onMounted(async() => {
  getVehicles();
});

</script>

<template>
  <main>
    <header>
      <h1>Vehículos</h1>
      <button class="add-btn" @click="openModal" :disabled="loading">
        {{ loading ? 'Cargando...' : '+ Agregar' }}
      </button>
    </header>

    <section>
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <TableVehicles
        :items="activeVehicles"
        :columns="[
          { label: 'Marca', field: 'brand' },
          { label: 'Modelo', field: 'model' },
          { label: 'Placa', field: 'licensePlate' },
          { label: 'Capacidad (kg)', field: 'capacityKg' },
          { 
            label: 'Disponibilidad', 
            field: 'available',
            formatter: (value) => value ? 'Disponible' : 'No disponible'
          },
          { 
            label: 'Vencimiento del seguro', 
            field: 'insuranceDate',
            formatter: (value) => {
              if (!value) return 'Sin fecha'

              const date = new Date(value)
              date.setDate(date.getDate() + 1)
              
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()

              return `${day}/${month}/${year}`
            }
          }
        ]"
        :highlightFn="highlightVeh"
        @edit="handleEditVehicle"
        @delete="handleDeleteVehicle"
      />
    </section>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article>
      <header>
        <h3>{{ selectedVehicle ? 'Editar' : 'Agregar' }}</h3>
        <button class="close-btn" @click="closeModal">✕</button>
      </header>

      <section>
        <VehicleForm 
          :initialData="selectedVehicle" 
          @submit="handleCreationOrUpdate" 
          :updating="!!selectedVehicle"
          :loading="loading" 
        />
      </section>
    </article>
  </div>

  <!-- Modal de confirmación de eliminación -->
  <NotificationModal
    v-if="showConfirmModal"
    :show="showConfirmModal"
    :title="confirmTitle"
    :message="confirmMessage"
    confirmText="Eliminar"
    cancelText="Cancelar"
    @close="showConfirmModal = false"
    @confirm="() => { 
      if (confirmAction) confirmAction()
      showConfirmModal = false
    }"
  />
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
}

main section {
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--add-btn);
  color: var(--text-on-add-btn);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  background-color: var(--add-btn-hover);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--add-btn);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

article {
  background: var(--modal-bg);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input);
}

article header h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--close-btn);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--close-btn-hover);
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

  h1 {
    margin-left: 50px;
  }
}
</style>
