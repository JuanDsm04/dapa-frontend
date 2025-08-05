<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { useNotificationStore } from '@/stores/notifications'
import TableVehicles from '@/components/Table.vue';
import VehicleForm from '@/components/VehicleForm.vue';
import type { HighlightConfig } from '@/types/table';
import type { Vehicle } from '@/types/vehicle'

const showModal = ref(false);
const vehicles = ref<Vehicle[]>([])
const selectedVehicle = ref<Vehicle | undefined>(undefined)
const activeVehicles = computed(() => vehicles.value.filter(vehicle => vehicle.isActive));

const openModal = () => {
  selectedVehicle.value = undefined;
  showModal.value = true;
};

const closeModal = () => {
  selectedVehicle.value = undefined;
  showModal.value = false;
};

const highlightVeh = (item: any): HighlightConfig | undefined => {
  if (item.currentMileage > 200000) {
    return { borderColor: '#CC2D44', backgroundColor: '#FFF4F4' }
  }else if (item.currentMileage > 100000){
    return { borderColor: '#FFB601', backgroundColor: '#FFFEEE' }
  }
  return undefined
}

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
    const vehiculosCriticos = data.filter((v: Vehicle) => v.currentMileage > 200000)

    if (vehiculosCriticos.length > 0) {
    toast.warning(`Hay ${vehiculosCriticos.length} vehículo(s) que necesitan atención`, {
      autoClose: 5000,
      position: toast.POSITION.TOP_CENTER,
    })

  }
    vehicles.value = data;

  } catch (error) {
    console.error("Error obteniendo vehículos:", error);
  }
};

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

const handleEditVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = { ...vehicle };
  showModal.value = true;
};

const handleDeleteVehicle = async (vehicle: Vehicle) => {
  selectedVehicle.value = { ...vehicle };
  const vehicleID = selectedVehicle.value.id;

  try {
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${vehicleID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    await getVehicles();
    toast.warning('Vehículo eliminado');
  } catch (error) {
    console.error("Error eliminando vehículo:", error);
    toast.error('Error eliminando vehículo');
  }
};

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
          { label: 'Disponibilidad', field: 'available' },
          { label: 'Vencimiento del seguro', field: 'insuranceDate' }
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
        <button class="close-btn" @click="closeModal">&times;</button>
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