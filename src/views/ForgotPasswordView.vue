<script setup lang="ts">
import { ref } from 'vue'
import { forgotPassword } from '@/services/authService'
import { toast } from 'vue3-toastify'

const email = ref('')
const emailSent = ref(false)
const errors = ref<{ email?: string }>({})

// Validar el email
const validateEmail = () => {
	errors.value.email = ''

	if (!email.value.trim()) {
		errors.value.email = 'El correo es requerido *'
		return false
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email.value)) {
		errors.value.email = 'Formato de correo inválido *'
		return false
	}

	return true
}

// Manejar el envío del formulariof
const handleForgotButton = async () => {
	if (!validateEmail()) return

	try {
		const result = await forgotPassword(email.value)
		toast.success('Se ha enviado un correo con las instrucciones para restablecer tu contraseña')
		emailSent.value = true

	} catch (error) {
		console.error('Error enviando email de recuperación:', error)
		toast.error('Error al enviar el correo. Por favor intenta de nuevo.')
	}
}
</script>

<template>
	<main class="main-container">
		<section class="form-container">
			<!-- Botón de regresar -->
			<div class="back-button-container">
				<a href="/login" class="back-button">
					<span class="material-symbols-outlined">
						arrow_back
					</span>
					Regresar
				</a>
			</div>

			<!-- Contenido principal -->
			<div class="content">
				<div class="logo-container">
					<img src="@/assets/images/logo_2.png" alt="Company logo" class="logo">
				</div>

				<template v-if="emailSent">
					<h1 class="title">Reestablecimiento de contraseña solicitado</h1>
					<p class="subtitle">Revisa tu bandeja de entrada para continuar.</p>
				</template>

				<template v-else>
					<h1 class="title">¿Olvidaste tu contraseña?</h1>
					<p class="subtitle">Escribe tu correo electrónico para restablecer tu contraseña.</p>
					<div class="field">
						<input
							type="email"
							name="Email"
							v-model="email"
							placeholder="Correo electrónico"
							class="email-input"
						>
						<p v-if="errors.email" class="error">{{ errors.email }}</p>
					</div>
				</template>
			</div>

			<!-- Botón de acción -->
			<div class="action-button-container">
				<button v-if="!emailSent" type="button" @click="handleForgotButton" class="action-button">
					<span>Siguiente</span>
					<span class="material-symbols-outlined">
						arrow_forward
					</span>
				</button>
			</div>

			<!-- Texto inferior -->
			<div class="bottom-text">
				<p>Si olvidaste tu correo contacta al administrador</p>
			</div>
		</section>
	</main>
</template>

<style scoped>
.main-container {
	min-height: 100vh;
	background-image: url('@/assets/images/demo-image.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.main-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1;
}

.form-container {
	position: relative;
	z-index: 2;
	background: white;
	border-radius: 12px;
	padding: 32px;
	width: 100%;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	min-height: 500px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.back-button-container {
	margin-bottom: 20px;
}

.back-button {
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 8px;
	color: #2563eb;
	text-decoration: none;
	font-size: 14px;
	font-weight: 500;
	transition: color 0.2s;
}

.back-button:hover {
	color: #235dda;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	margin-bottom: 20px;
}

.logo-container {
	margin-bottom: 24px;
}

.logo {
	width: 64px;
	height: auto;
	object-fit: contain;
}

.title {
	font-size: 20px;
	font-weight: 600;
	color: #1F2937;
	margin-bottom: 12px;
	line-height: 1.3;
}

.subtitle {
	font-size: 14px;
	color: #6B7280;
	margin-bottom: 24px;
	line-height: 1.4;
}

.field {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.error {
	font-size: 12px;
	color: red;
	margin-top: 4px;
	text-align: left;
}

.email-input {
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #D1D5DB;
	border-radius: 8px;
	font-size: 14px;
	transition: all 0.2s;
	outline: none;
}

.email-input:focus {
	border-color: #3B82F6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.email-input::placeholder {
	color: #9CA3AF;
}

.action-button-container {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 20px;
}

.action-button {
	background: #2563eb;
	color: white;
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: background-color 0.2s;
}

.action-button:hover {
	background: #235dda;
}

.action-button:active {
	transform: translateY(1px);
}

.bottom-text {
	text-align: center;
}

.bottom-text p {
	font-size: 12px;
	color: #6B7280;
	margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
	.form-container {
		padding: 24px;
		margin: 10px;
	}

	.title {
		font-size: 18px;
	}

	.subtitle {
		font-size: 13px;
	}
}
</style>