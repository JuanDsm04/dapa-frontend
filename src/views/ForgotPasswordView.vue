<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const emailSent = ref(false)

const handleForgotButton = async () => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot`, {
        	method: 'POST',
        	headers: {
          	'Content-Type': 'application/json',
        	},
        	body: JSON.stringify({
          	email: email.value,
        	}),
    	})

		emailSent.value = true

	} catch (e) {
		console.log(e)
	}
}
</script>

<template>
  <main>
    <section>
	  <a href="">Regresar a inicio de sesión</a>
	  <div v-if="emailSent">	
	    <h1> Reestablecimiento de contraseña solicitado</h1>
      	<img src="@/assets/images/logo_1.png" alt="Company logo" class="logo">
		<p>Revisa tu bandeja de entrada para continuar.</p>
	  </div>
	  <div v-else>
	  	<h1>¿Olvidaste tu contraseña?</h1>
      	<img src="@/assets/images/logo_1.png" alt="Company logo" class="logo">
	  	<p>Escribe tu correo electrónico para restablecer tu contraseña.</p>
	  	<input type="text" name="Email" v-model="email" placeholder="Correo electrónico">
	  	<button type="button" @click="handleForgotButton">Siguiente</button>
	  </div>
    </section>
  </main>
</template>
