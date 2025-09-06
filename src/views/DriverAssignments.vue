<script setup lang="ts">
// VISTA PARA QUE LOS CONDUCTORES PUEDAN VER SUS FLETES ASIGNADOS
</script>

<template>
    <main>
        <header>
        <h1>Pedidos</h1>
        </header>
        <article>
            <section>
                <h2>Pedidos por completar</h2>
                <div class="info-card">
                    <p>Inicia tu próximo pedido asignado para darle seguimiento.</p>
                </div>
            </section>
            <section>
                <h2>Otros pedidos asignados</h2>
                <div class="info-card">
                    <p>Por el momento no tienes pedidos asignados.</p>
                </div>
            </section>
        </article>
    </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
}

h2 {
  font-weight: 600;
  font-size: 1.5625rem; /* 25px → rem */
}

article {
  background-color: white;
  width: 100%;
  padding: 1.5625rem; /* 25px → rem */
  border-radius: 10px;
  height: calc(100vh - 9.375rem); /* 150px → rem */
}

article section:nth-of-type(2) {
  margin-top: 1.875rem; /* 30px → rem */
}

.info-card {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0; /* 8px → rem */
  background-color: white;
  max-width: 100%;
  height: 12.5rem; /* 200px → rem */
}

.info-card p {
  margin: 0 auto;
  text-align: center;
}

@media (max-width: 62.5rem) {} /* 1000px → rem */

@media (max-width: 48.125rem) { /* 770px → rem */
  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }

  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  h1 {
    margin-left: 3.125rem; /* 50px → rem */
  }

  h2 {
    font-size: 1.25rem; /* 20px → rem */
  }

  .info-card p {
    font-size: 0.9375rem; /* 15px → rem */
  }
}
</style>

