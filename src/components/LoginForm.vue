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
  <main>

    <form @submit.prevent="handleLogin">
      <div class="field">
        <label for="Email">Email</label>
        <input type="text" id="Email" name="Email" v-model="email">
      </div>

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
        <input :type="showPassword ? 'text' : 'password'" id="Password" name="Password" v-model="password" />
      </div>

      <button type="submit" class="submit-btn">Iniciar sesión</button>
      <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
    </form>

  </main>
</template>

<style scoped>
/* Contenedor principal */
main {
  width: 500px; /* ancho fijo del formulario */
  margin: 0 auto; /* centrado horizontal */
}

/* Formularios y campos */
form,
.field {
  width: 100%;
  display: flex;
  flex-direction: column;
}

form {
  gap: 1.75rem; /* espacio entre campos */
}

/* Etiquetas */
label {
  margin-bottom: 0.1rem;
}

/* Fila de contraseña con elementos alineados */
.pass-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Inputs */
input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-input);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: var(--add-btn);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Botones */
button {
  border: none;
  padding: 15px 35px;
  border-radius: 10px;
  background-color: var(--add-btn);
  color: var(--white);
  font-size: 1rem;
  font-weight: 500;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

form > button:hover {
  background-color: var(--add-btn-hover);
}

form > button:active {
  transform: translateY(1px);
}

/* Toggle de visibilidad de contraseña */
.toggle-visibility-btn {
  display: flex;
  gap: 10px;
  color: var(--button-secondary);
  align-items: center;
  margin-right: 10px;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  height: 1rem;
  width: 1rem;
}

.toggle-label {
  font-weight: lighter;
  font-size: 0.9rem;
}

/* Botón de submit */
.submit-btn {
  cursor: pointer;
}

/* Links */
a {
  color: var(--text-on-light);
  align-self: center;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
