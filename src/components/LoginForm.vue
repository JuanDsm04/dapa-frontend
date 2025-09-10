<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { getUserRole } from '@/utils/auth'
import { login } from '@/services/authService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    const data = await login(email.value, password.value)

    if (data?.data) {
      if (getUserRole() === 'admin') {
        router.push('/users')
      } else {
        router.push('/my-assignments')
      }
    } else {
      toast.error('Usuario o contraseña incorrectos')
    }
    
  } catch (e: any) {
    toast.error(e.message || 'Ocurrió un error al iniciar sesión')
  }
}
</script>

<template>
  <main class="login-form-container">
    <form @submit.prevent="handleLogin">
      <!-- Campo de email -->
      <div class="field">
        <label for="Email" class="email-row">Email</label>
        <input 
          type="text" 
          id="Email" 
          name="Email" 
          v-model="email" 
          placeholder="Ingresa tu correo"
        />
      </div>

      <!-- Campo de contraseña -->
      <div class="field">
        <div class="pass-row">
          <label for="Password">Contraseña</label>
          <button type="button" class="toggle-visibility-btn" @click="togglePassVisibility">
            <div class="icon-wrapper">
              <span v-if="showPassword" class="material-symbols-outlined sm-icon">
                visibility
              </span>
              <span v-else class="material-symbols-outlined sm-icon">
                visibility_off
              </span>
            </div>
            <span class="toggle-label">{{ showPassword ? 'Ocultar' : 'Ver' }}</span>
          </button>
        </div>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="Password" 
          name="Password" 
          v-model="password" 
          placeholder="Ingresa tu contraseña"
        />
      </div>

      <!-- Botón de submit -->
      <button type="submit" class="submit-btn">Iniciar sesión</button>

      <!-- Link de recuperación -->
      <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
    </form>
  </main>
</template>

<style scoped>
/* Contenedor principal del formulario */
.login-form-container {
  width: 100%;
  max-width: 25rem; /* igual que el reset-password */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Formularios y campos */
form,
.field {
  width: 100%;
  display: flex;
  flex-direction: column;
}

form {
  gap: 1.5rem; /* espacio entre campos */
}

/* Etiquetas */
label {
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  color: var(--neutral-gray-700);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

/* Inputs */
input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-base);
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  outline: none;
  transition: all 0.2s ease-in-out;
}

input:focus {
  border-color: var(--principal-primary-300);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Fila de contraseña */
.email-row,.pass-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Toggle de visibilidad de contraseña */
.toggle-visibility-btn {
  display: flex;
  gap: 10px;
  color: var(--neutral-gray-500);
  align-items: center;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  border: none;
  font-size: clamp(0.75rem, 1.1vw, 0.875rem);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  height: 1rem;
  width: 1rem;
}

.toggle-label {
  font-weight: 400;
}

/* Botón de submit */
.submit-btn {
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background-color: var(--principal-primary-hover);
}

.submit-btn:active {
  transform: translateY(1px);
}

/* Links */
a {
  color: var(--principal-primary-900);
  align-self: center;
  text-decoration: none;
  margin-top: 0.5rem;
  font-size: clamp(0.75rem, 1.1vw, 0.875rem);
}

a:hover {
  text-decoration: underline;
}

/* Responsividad */
@media (max-width: 770px) {
  .login-form-container {
    max-width: 100%;
    padding: 0 1rem;
  }

  form {
    gap: 1.25rem;
  }
}
</style>
