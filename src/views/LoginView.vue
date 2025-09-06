<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
  <main>
    <img src="@/assets/images/demo-image.jpg" alt="Demo image of a company's truck" />
    <section>
      <div class="content-wrapper">
        <img src="@/assets/images/logo_1.png" alt="Company logo" class="logo" />
        <LoginForm />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  max-height: 100dvh;
  width: 100%;
}

main > img {
  height: 100dvh;
  width: 45%;
  object-fit: cover;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55%;
  max-height: 100dvh;
  margin: 0;
  padding: 0;
}

.content-wrapper {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0;
}

.logo {
  width: auto;
  height: clamp(6.25rem, 8vw, 9.375rem);
  margin-bottom: 3.125rem;
}

@media (max-width: 770px) {
  main > img {
    display: none;
  }

  section {
    width: 100%;
  }

  .logo {
    margin: 6.25rem 0 1.875rem 0;
  }
}
</style>
