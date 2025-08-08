<script></script>

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

<style>
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
    font-size: 25px;
}

article {
    background-color: white;
    width: 100%;
    padding: 25px;
    border-radius: 10px;
    height: calc(100vh - 150px);
}

article section:nth-of-type(2) {
    margin-top: 30px;
}

.info-card {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: white;
  max-width: 100%;
  height: 200px;
}

.info-card p {
    margin: 0 auto;
    text-align: center;
}

@media (max-width: 1000px) {}

@media (max-width: 770px) {
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
    margin-left: 50px;
  }

  h2 {
    font-size: 20px;
  }

  .info-card p {
    font-size: 15px;
  }
}
</style>