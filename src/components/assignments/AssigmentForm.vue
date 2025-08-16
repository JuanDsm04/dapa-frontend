<script setup>
import { ref } from 'vue'
import ShippingInformation from '../assignments/ShippingInformation.vue'

const selectedDriver = ref('')
const selectedVehicle = ref('')
const additionalComment = ref('')
</script>

<template>
  <div class="assignment-form">
    <!-- Encabezado -->
    <header>
      <h2>Asignación</h2>
      <div class="header-actions">
        <button class="form-btn">
          <span class="material-symbols-outlined">attach_file</span>
        </button>
        <button class="assign-btn">
          <span class="material-symbols-outlined">check</span>
          Asignar
        </button>
      </div>
    </header>

    <!-- Formulario de asignación -->
    <div class="form-section">
      <div class="field-group">
        <div class="form-field">
          <label for="driver">Elegir conductor</label>
          <select id="driver" v-model="selectedDriver">
            <option disabled value="">Selecciona un conductor</option>
            <option value="armando">Armando</option>
            <option value="lucia">Lucía</option>
          </select>
        </div>

        <div class="form-field">
          <label for="vehicle">Elegir vehículo</label>
          <select id="vehicle" v-model="selectedVehicle">
            <option disabled value="">Selecciona un vehículo</option>
            <option value="camion1">Camión 1</option>
            <option value="camion2">Camión 2</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Información de envío -->
    <ShippingInformation />
  </div>
</template>

<style scoped>
.assignment-form {
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  max-width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

header h2 {
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-btn {
  padding: 0.6rem;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  color: #235dda;
  border: 1px solid #235dda;
  border-radius: 8px;
  background-color: white;
}

.form-btn:hover {
  background-color: #f9f9fc;
}

.assign-btn {
  display: flex;
  align-items: center;
  justify-content: center; 
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  height: 55px;
}

.assign-btn:hover {
  background-color: #235dda;
}

.assign-btn span {
  margin-right: 5px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

select,
textarea {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: none;
}

textarea {
  min-height: 100px;
}

.details h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.subtext {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
}

.details-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

@media (max-width: 770px) {
  .field-group {
    flex-direction: column;
  }
}
</style>