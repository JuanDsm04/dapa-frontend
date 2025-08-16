<script setup></script>

<template>
  <section class="shipment-info">
    <div class="info-box">
      <button class="info-action">
        <span class="material-symbols-outlined">edit</span>
      </button>

      <div class="info-item">
        <label>Precio</label>
        <p>Q 150.00</p>
      </div>
      <div class="info-item">
        <label>Tipo de carga</label>
        <p><strong>Empresarial</strong></p>
      </div>
      <div class="info-item">
        <label>Origen</label>
        <p><strong>31 Avenida H, 14 calle B, Colonia Santa María, Zona 11</strong></p>
      </div>
      <div class="info-item">
        <label>Destino</label>
        <p><strong>31 Avenida H, 14 calle B, Colonia Santa María, Zona 11</strong></p>
      </div>
      <div class="info-item full-width">
        <label>Detalles</label>
        <p><strong>Entrega urgente, manejar con cuidado</strong></p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shipment-info {
  margin-bottom: 2rem;
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem 1.5rem;
  position: relative;
}

.info-item label {
  font-size: 0.9rem;
  color: #666;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-action {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.info-action:hover {
  color: #2f67f6;
}
</style>