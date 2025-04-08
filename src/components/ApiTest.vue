<script setup lang="ts">
import { ref, onMounted } from 'vue'

const respuesta = ref('Cargando...')

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ping`)
    const data = await res.json()
    console.log(data.message)
    respuesta.value = data.message
  } catch (error) {
    respuesta.value = 'Error al conectar con el backend'
    console.error(error)
  }
})
</script>

<template>
  <div>
    <h2>Verificación de conexión con el backend:</h2>
    <p>{{ respuesta }}</p>
  </div>
</template>

<style scoped>
h2 {
  color: #2c3e50;
}
</style>
