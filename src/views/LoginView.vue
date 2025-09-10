<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
  <main class="main-container">
    <section class="form-container">
      <!-- Contenido principal -->
      <div class="content">
        <!-- Logo -->
        <div class="logo-container">
          <img src="@/assets/images/logo_1.png" alt="Company logo" class="logo" />
        </div>

        <!-- Título y subtítulo -->
        <h1 class="title">Iniciar sesión</h1>
        <p class="subtitle">Ingresa tus credenciales para acceder a tu cuenta.</p>

        <!-- Formulario de login -->
        <LoginForm />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Contenedor principal */
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

/* Capa oscura sobre el fondo */
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

/* Contenedor del formulario */
.form-container {
  position: relative;
  z-index: 2;
  background: var(--neutral-white);
  border-radius: 0.75rem;
  padding: 2rem;
  /* width: 100%; */
  max-width: 35rem;
  display: flex;
  flex-direction: column;
  min-height: 31.25rem;
}

/* Contenido principal dentro del formulario */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Contenedor del logo */
.logo-container {
  margin-bottom: 1.5rem;
}

/* Imagen del logo */
.logo {
  width: 8rem;
  height: auto;
  object-fit: contain;
}

/* Título */
.title {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  font-weight: 600;
  color: var(--neutral-gray-900);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

/* Subtítulo */
.subtitle {
  font-size: clamp(0.8125rem, 1.5vw, 0.9375rem);
  color: var(--neutral-gray-600);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

/* Responsividad */
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
