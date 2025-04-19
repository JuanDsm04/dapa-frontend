<script setup>
  import { ref } from 'vue'
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)

  const togglePassVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        }),
      })

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos')
      }

      const data = await response.json()
      console.log(data)
      //Guardar el token en localStorage
      localStorage.setItem("token", data.data)

    } catch (e) {
      console.log(e)
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
              <EyeIcon v-if="showPassword" />
              <EyeSlashIcon v-else />
            </div>
            <span class="toggle-label">{{ showPassword ? 'Ocultar' : 'Ver' }}</span>
          </button>
        </div>
        <input :type="showPassword ? 'text' : 'password'" id="Password" name="Password" v-model="password" />
      </div>
      <button type="submit" class="submit-btn">Iniciar sesión</button>
      <a href="">¿Olvidaste tu contraseña?</a>
    </form>
  </main>
</template>

<style scoped>
  main {
    width: 500px;
  }

  form, .field {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  form {
    gap: 1.75rem;
  }

  label {
    margin-bottom: 0.1rem;
  }

  .pass-row {
    display: flex;
    justify-content: space-between;
  }

  input {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  button {
    border: 0;
    padding: 15px 0;
    border-radius: 32px;
    background-color: var(--color-form-button);
    font-size: 1.25rem;
    font-weight: 500;
  }

  .toggle-visibility-btn {
    display: flex;
    gap: 10px;
    color: gray;
    align-items: center;
    margin-right: 10px;
    background-color: transparent;
    padding: 0;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    height: 1rem;
    width: 1rem;
  }

  .toggle-label {
    font-weight: lighter;
    font-size: 0.90rem;
  }

  .submit-btn {
    cursor: pointer;
  }

  a {
    color: black;
    align-self: center;
  }
</style>
