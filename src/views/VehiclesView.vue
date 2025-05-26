<script setup>
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import VerticalNav from '@/components/NavBar.vue';
import TableVehicles from '@/components/Table.vue';
import VehicleForm from '@/components/VehicleForm.vue';

const showModal = ref(false);
const selectedVehicle = ref(null);
const vehicles = ref([]);
const activeVehicles = computed(() => vehicles.value.filter(vehicle => vehicle.isActive));

const openModal = () => {
  selectedVehicle.value = null;
  showModal.value = true;
};

const closeModal = () => {
  selectedVehicle.value = null;
  showModal.value = false;
};

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
  } catch (error) {
    console.error("Error obteniendo vehículos:", error);
  }
};

const handleCreationOrUpdate = async (payload) => {
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
    console.error('Error al guardar vehículo:', error);
    toast.error(`Error: ${error.message}`);
  }
};

const handleEditVehicle = (vehicle) => {
  selectedVehicle.value = { ...vehicle };
  showModal.value = true;
};

const handleDeleteVehicle = async (vehicle) => {
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

onMounted(() => {
  getVehicles();
});
</script>

<template>
  <div class="layout">
    <VerticalNav />

    <main>
      <header>
        <h1>Vehículos</h1>
        <button class="add-btn" @click="openModal">+ Agregar</button>
      </header>

      <section>
        <TableVehicles
          :items="activeVehicles"
          :columns="[
            { label: 'Marca', field: 'brand' },
            { label: 'Modelo', field: 'model' },
            { label: 'Placa', field: 'licensePlate' },
            { label: 'Capacidad (kg)', field: 'capacityKg' },
            { label: 'Disponibilidad', field: 'available' },
            { label: 'Kilometraje actual', field: 'currentMileage' },
            { label: 'Próximo mantenimiento (km)', field: 'nextMaintenanceMileage' }
          ]"
          @edit="handleEditVehicle"
          @delete="handleDeleteVehicle"
        />
      </section>
    </main>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article>
      <header>
        <h3>{{ selectedVehicle ? 'Editar' : 'Agregar' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <section>
        <VehicleForm :initialData="selectedVehicle" @submit="handleCreationOrUpdate" :updating="selectedVehicle" />
      </section>
    </article>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-general);
}

.layout main {
  width: 100%;
  padding: 2rem;
  margin-left: 80px;
  box-sizing: border-box;
  background-color: var(--main-bg);
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

header h1 {
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

.add-btn:hover {
  background-color: var(--add-btn-hover);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
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
</style>