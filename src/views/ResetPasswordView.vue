<script setup>
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
  import { ref } from 'vue'

  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)	
  const showConfirmPassword = ref(false)

  const togglePassVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const toggleConfirmPassVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value
  }
</script>

<template>
  <main>
    <section>
      <div class="content-wrapper">
		<h1>Reestablecer contraseña</h1>
        <img src="@/assets/images/logo_1.png" alt="Company logo" class="logo">
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
		<div class="field">
          <div class="pass-row">
            <label for="ConfirmPassword">Confirmar contraseña</label>
            <button type="button" class="toggle-visibility-btn" @click="toggleConfirmPassVisibility">
              <div class="icon-wrapper">
                <EyeIcon v-if="showConfirmPassword" />
                <EyeSlashIcon v-else />
              </div>
              <span class="toggle-label">{{ showConfirmPassword ? 'Ocultar' : 'Ver' }}</span>
            </button>
          </div>
          <input :type="showConfirmPassword ? 'text' : 'password'" id="ConfirmPassword" name="ConfirmPassword" v-model="confirmPassword" />
        </div>
	  <button>Reestablecer</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .pass-row {
    display: flex;
  }

  input {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-input);
    font-size: 1rem;
  }

  button {
    border: 0;
    padding: 15px 35px;
    border-radius: 10px;
    background-color: var(--add-btn);
    color: var(--white);
    font-size: 1rem;
    font-weight: 500;
  }

  .toggle-visibility-btn {
    display: flex;
    gap: 10px;
    color: var(--button-secondary);
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
</style>
