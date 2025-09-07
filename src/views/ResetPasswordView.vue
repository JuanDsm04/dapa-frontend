<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { resetPassword } from '@/services/authService';
import { toast } from 'vue3-toastify';
import type { ResetPasswordErrors as Errors } from '@/types/form';

const route = useRoute()
const token = route.query.token as string
const password = ref<string>('')
const confirmPassword = ref<string>('')
const showPassword = ref<boolean>(false)	
const showConfirmPassword = ref<boolean>(false)
const errors = ref<Errors>({})

// Alternar la visibilidad de las contraseñas
const togglePassVisibility = (): void => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassVisibility = (): void => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Validar del formulario
const validateForm = (): boolean => {
  errors.value = {}

  if (!password.value.trim()) {
    errors.value.password = 'La contraseña es requerida *'
  }
  if (!confirmPassword.value.trim()) {
    errors.value.confirmPassword = 'La confirmación es requerida *'
  }
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  ) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden *'
  }

  return Object.keys(errors.value).length === 0
}

// Manejar el restablecimiento de contraseña
const handleResetButton = async (): Promise<void> => {
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
								<span v-if="showPassword" class="material-symbols-outlined sm-icon">
									visibility
								</span>
								<span v-else class="material-symbols-outlined sm-icon">
									visibility_off
								</span>
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
								<span v-if="showConfirmPassword" class="material-symbols-outlined sm-icon">
									visibility
								</span>
								<span v-else class="material-symbols-outlined sm-icon">
									visibility_off
								</span>
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
	padding: 1.25rem;
}

.main-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--gradient-black);
	z-index: 1;
}

.form-container {
	position: relative;
	z-index: 2;
	background: var(--neutral-white);
	border-radius: 0.75rem; 
	padding: 2rem;
	width: 100%;
	max-width: 25rem; 
	display: flex;
	flex-direction: column;
	min-height: 31.25rem; 
}

.error {
	font-size: clamp(0.6875rem, 0.8vw, 0.75rem);
	color: var(--principal-error);
	margin-top: 0.25rem;
	text-align: left;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	margin-bottom: 1.25rem;
}

.logo-container {
	margin-bottom: 1.5rem;
}

.logo {
	width: 4rem;
	height: auto;
	object-fit: contain;
}

.title {
	font-size: clamp(1.125rem, 2vw, 1.375rem);
	font-weight: 600;
	color: var(--neutral-gray-900);
	margin-bottom: 0.75rem;
	line-height: 1.3;
}

.subtitle {
	font-size: clamp(0.8125rem, 1.5vw, 0.9375rem);
	color: var(--neutral-gray-600);
	margin-bottom: 1.5rem;
	line-height: 1.4;
}

.field {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 1rem;
}

.email-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: 1px solid var(--border-base);
	border-radius: 0.5rem;
	font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
	transition: all 0.2s;
	outline: none;
}

.email-input:focus {
	border-color: var(--principal-primary-200);
}

.action-button-container {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 1.25rem;
}

.action-button {
	background: var(--principal-primary);
	color: var(--neutral-white);
	border: none;
	border-radius: 0.5rem;
	padding: 0.75rem 1.5rem;
	font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: background-color 0.2s;
}

.action-button:hover {
	background: var(--principal-primary-hover);
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
	right: 0.5rem;
	background: transparent;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	color: var(--neutral-gray-600);
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.25rem;
	height: 1.25rem;
}

@media (max-width: 770px) {
	.form-container {
		padding: 1.5rem;
		margin: 0.625rem;
	}

	.title {
		font-size: clamp(1rem, 4vw, 1.125rem);
	}

	.subtitle {
		font-size: clamp(0.75rem, 3vw, 0.875rem);
	}
}

</style>
