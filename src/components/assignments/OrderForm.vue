<script setup lang="ts">
import { ref } from 'vue'

const price = ref('')
const cargoType = ref('personal')
const origin = ref('')
const destination = ref('')
const details = ref('')

const errors = ref<Record<string, string>>({})

const handleSubmit = () => {
  errors.value = {}

  // Validaciones
  const numericPrice = parseFloat(price.value)
  if (numericPrice !== 0) {
    errors.value.price = 'El precio es requerido *'
  } else if (isNaN(numericPrice)) {
    errors.value.price = 'El precio debe ser un número *'
  } else if (numericPrice < 0) {
    errors.value.price = 'El precio no puede ser negativo *'
  }

  if (!origin.value.trim()) {
    errors.value.origin = 'El origen es requerido *'
  }

  if (!destination.value.trim()) {
    errors.value.destination = 'El destino es requerido *'
  }

  if (!details.value.trim()) {
    errors.value.details = 'Los detalles son requeridos *'
  }

  if (Object.keys(errors.value).length > 0) return
}

// Filtrar el input de precio
const filterPriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9.]/g, '')
  price.value = input.value;
}

</script>

<template>
  <form @submit.prevent="handleSubmit">

    <div class="field-group">
      <!-- Precio -->
      <div class="field">
        <label for="price">Precio</label>
        <div class="input-container price-input">
          <input type="text" id="price" v-model="price" @input="filterPriceInput" />
          <span class="currency-symbol">Q</span>
        </div>
        <p v-if="errors.price" class="error">{{ errors.price }}</p>
      </div>

      <!-- Tipo de carga -->
      <div class="field">
        <label for="cargoType">Tipo de carga</label>
        <select id="cargoType" v-model="cargoType">
          <option value="personal">Personal</option>
          <option value="empresarial">Empresarial</option>
          <option value="negocio">Negocio</option>
        </select>
      </div>
    </div>

    <!-- Origen -->
    <div class="field">
      <label for="origin">Origen</label>
      <input type="text" id="origin" v-model="origin" />
      <p v-if="errors.origin" class="error">{{ errors.origin }}</p>
    </div>

    <!-- Destino -->
    <div class="field">
      <label for="destination">Destino</label>
      <input type="text" id="destination" v-model="destination" />
      <p v-if="errors.destination" class="error">{{ errors.destination }}</p>
    </div>

    <!-- Detalles -->
    <div class="field">
      <label for="details">Detalles</label>
      <textarea id="details" v-model="details"></textarea>
      <p v-if="errors.details" class="error">{{ errors.details }}</p>
    </div>

    <!-- Botón -->
    <button type="submit">Confirmar</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  display: flex;
  gap: 5px;
}

.field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-container.price-input {
  position: relative;
}

.input-container.price-input input {
  padding-left: 2rem;
}

input.price-input {
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.input-container {
  display: flex;
  align-items: center;
}

input,
select,
textarea {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-input, #ccc);
  font-size: 1rem;
  width: 100%;
}

textarea {
  min-height: 150px;
  max-height: 150px;
  resize: vertical;
}

.error {
  font-size: 0.85rem;
  color: red;
  margin-top: 0.25rem;
}

button {
  border: 0;
  padding: 15px 35px;
  border-radius: 10px;
  background-color: var(--add-btn, #2563eb);
  color: var(--white, #fff);
  font-size: 1rem;
  font-weight: 500;
  margin: 0 auto;
  cursor: pointer;
}

button:hover {
  background-color: var(--add-btn-hover, #1e4ed8);
}

@media screen and (max-width: 770px) {
  .field-group {
    flex-direction: column;
    gap: 1.75rem;
  }
}
</style>
