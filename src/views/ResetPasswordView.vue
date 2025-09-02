<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { resetPassword } from '@/services/authService'
import { toast } from 'vue3-toastify';

const route = useRoute()
const token = route.query.token
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)	
const showConfirmPassword = ref(false)
const errors = ref({})

// Funciones para alternar la visibilidad de la contraseña
const togglePassVisibility = () => {
	showPassword.value = !showPassword.value
}

const toggleConfirmPassVisibility = () => {
	showConfirmPassword.value = !showConfirmPassword.value
}

// Validaciones
const validateForm = () => {
	errors.value = {}

	if (!password.value.trim()) {
		errors.value.password = 'La contraseña es requerida *'
	}
	if (!confirmPassword.value.trim()) {
		errors.value.confirmPassword = 'La confirmación es requerida *'
	}
	if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
		errors.value.confirmPassword = 'Las contraseñas no coinciden *'
	}

	return Object.keys(errors.value).length === 0
}

// Manejo del restablecimiento de contraseña
const handleResetButton = async () => {
	if (!validateForm()) return

	try {
		const result = await resetPassword(token, password.value)

		if (result.ok) {
			router.push('/login')
		} else {
			console.log(result)
			toast.error('No se pudo restablecer la contraseña')
		}
	} catch (error) {
		console.error(error)
		toast.error('Ocurrió un error al procesar la solicitud')
	}
}
</script>

<template>
	<main class="main-container">
		<section class="form-container">
			<!-- Contenido principal -->
			<div class="content">
				<div class="logo-container">
					<img src="@/assets/images/logo_2.png" alt="Company logo" class="logo">
				</div>

				<h1 class="title">Reestablecer contraseña</h1>
				<p class="subtitle">Ingresa tu nueva contraseña y confírmala para continuar.</p>

				<!-- Campo de contraseña -->
				<div class="field">
					<div class="pass-row">
						<input
							:type="showPassword ? 'text' : 'password'"
							id="Password"
							name="Password"
							v-model="password"
							placeholder="Nueva contraseña"
							class="email-input"
						>
						<button type="button" class="toggle-visibility-btn" @click="togglePassVisibility">
							<div class="icon-wrapper">
								<EyeIcon v-if="showPassword" />
								<EyeSlashIcon v-else />
							</div>
						</button>
					</div>
					<p v-if="errors.password" class="error">{{ errors.password }}</p>
				</div>

				<!-- Confirmar contraseña -->
				<div class="field">
					<div class="pass-row">
						<input
							:type="showConfirmPassword ? 'text' : 'password'"
							id="ConfirmPassword"
							name="ConfirmPassword"
							v-model="confirmPassword"
							placeholder="Confirmar contraseña"
							class="email-input"
						>
						<button type="button" class="toggle-visibility-btn" @click="toggleConfirmPassVisibility">
							<div class="icon-wrapper">
								<EyeIcon v-if="showConfirmPassword" />
								<EyeSlashIcon v-else />
							</div>
						</button>
					</div>
					<p v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</p>
				</div>
			</div>

			<!-- Botón de acción -->
			<div class="action-button-container">
				<button type="button" @click="handleResetButton" class="action-button">
					<span>Reestablecer</span>
					<span class="material-symbols-outlined">
						check
					</span>
				</button>
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

.error {
	font-size: 12px;
	color: red;
	margin-top: 4px;
	text-align: left;
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
	margin-bottom: 16px;
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

/* Extras para los toggles */
.pass-row {
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
}

.toggle-visibility-btn {
	position: absolute;
	right: 8px;
	background: transparent;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	color: #6B7280;
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
}

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
