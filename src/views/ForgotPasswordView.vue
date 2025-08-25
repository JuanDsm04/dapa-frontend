<template>
  <main>
    <section>
      <div class="content-wrapper">
		<a href="">Regresar a inicio de sesión</a>
		<h1>¿Olvidaste tu contraseña?</h1>
        <img src="@/assets/images/logo_1.png" alt="Company logo" class="logo">
		<p>Escribe tu correo electrónico para restablecer tu contraseña.</p>
		<input type="text" name="Email" v-model="email" placeholder="Correo electrónico">
		<button>Siguiente</button>
      </div>
    </section>
  </main>
</template>
