<script setup>
import { ref } from 'vue'

const selectedDriver = ref('')
const selectedVehicle = ref('')
const additionalComment = ref('')
</script>

<template>
  <div class="assignment-form">
    <!-- Encabezado -->
    <header>
      <h2>Asignación</h2>
      <button class="assign-btn">
        <span class="material-symbols-outlined">check</span>
        Asignar
      </button>
    </header>

    <!-- Formulario -->
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

      <div class="form-field full-width">
        <label for="comment">Comentario adicional</label>
        <textarea id="comment" v-model="additionalComment" rows="4" />
      </div>
    </div>

    <!-- Detalles del pedido -->
    <article class="details">
      <h3>Detalles</h3>
      <p class="subtext">Información proporcionada por el cliente</p>
      <p class="details-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
      </p>
    </article>
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