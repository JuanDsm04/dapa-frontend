<script setup>
import VerticalNav from '@/components/NavBar.vue';
</script>

<template>
  <div class="layout">
    <VerticalNav />
    <main>

      <header>
        <h1>Vehículos</h1>
        <button class="add-btn" @click="openModal">
          + Agregar
        </button>
      </header>

      <div class="body-container">
        <TableUsers :items="activeVehicles" :columns="[
          { label: 'Marca', field: 'brand' },
          { label: 'Modelo', field: 'model' },
          { label: 'Placa', field: 'licensePlate' },
          { label: 'Capacidad (kg)', field: 'capacityKg' },
          { label: 'Disponibilidad', field: 'available' },
          { label: 'Kilometraje actual', field: 'currentMileage' },
          { label: 'Próximo mantenimiento (km)', field: 'nextMaintenanceMileage' }
        ]" @edit="handleEditVehicle" @delete="handleDeleteVehicle" />
      </div>

      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ selectedVehicle ? 'Editar' : 'Agregar' }}</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <UserForm :initialData="selectedVehicle" @submit="handleRegisterOrUpdate" :updating="selectedVehicle" />
          </div>
        </div>
      </div>

    </main>
  </div>
  
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

main {
  width: 100%;
  min-height: 100dvh;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: 80px;
  flex: 1;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.body-container {
  display: flex;
  width: 100%;
  height: calc(100dvh-150px);
  justify-content: center;
  align-items: center;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--secondary);
  color: var(--text-on-dark);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: var(--secondary-dark);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--modal-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input)
}

.modal-header h3 {
  margin: 0 25px;
  font-weight: 500;
  font-size: 1.5rem;
}

.modal-body {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 25px 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--close-btn);
  padding: 0 0.5rem;
}

.close-btn:hover {
  color: var(--close-btn-hover);
}
</style>