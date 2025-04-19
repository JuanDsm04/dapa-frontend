<script setup>
  import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
  <main>
    <img src="@/assets/images/demo-image.jpg" alt="Demo image of a company's truck" class="demo-img">
    <section class="login-form-container">
      <img src="@/assets/images/logo_1.png" alt="Company logo" class="logo-img">
      <LoginForm />
    </section>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    height: 100dvh;
    width: 100%;
  }

  .demo-img {
    height: 100%;
    width: 45%;
    object-fit: cover;
  }

  .login-form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 50px 250px;
  }

  .logo-img {
    width: auto;
    height: 400px;
    transform: translateY(50px);
  }

  @media (max-width: 770px) {
    main {
      height: 100dvh;
      width: auto;
      flex-direction: column;
      align-items: center;
    }

    .demo-img {
      display: none;
    }

    .login-form-container {
      width: 100%;
      height: 100%;
      padding: 40px 30px;
    }

    .logo-img {
      height: 300px;
      transform: translateY(0);
    }
  }
</style>
