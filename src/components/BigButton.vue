<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  icon: string
  title: string
  image: string
  description: string
  onClick?: () => void
}>()
</script>

<template>
  <button class="big-btn" @click="onClick">
    <template v-if="image">
      <img :src="image" alt="" class="btn-img" />
      <div class="btn-content">
        <div class="btn-title">{{ title }}</div>
        <div v-if="description" class="btn-description">{{ description }}</div>
      </div>
      <span class="btn-arrow">&gt;</span>
    </template>
    <template v-else>
      <span class="material-symbols-outlined btn-icon">{{ icon }}</span>
      <div class="btn-title">{{ title }}</div>
      <span class="btn-arrow">&gt;</span>
    </template>
  </button>
</template>

<style scoped>
/* Botón grande */
.big-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 750px; /* ancho fijo, cambiar a % si quieres responsive */
  height: 120px;
  margin: 5px;
  border-radius: 20px;
  border: none;
  background: #f4f4f4;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  padding: 0 10px;
}

.big-btn:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  transform: translateY(-2px); /* efecto sutil al hover */
}

/* Imagen dentro del botón */
.btn-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-right: 32px;
}

/* Contenido del botón (texto) */
.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
}

/* Título del botón */
.btn-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* Descripción del botón */
.btn-description {
  font-size: 1rem;
  text-align: left;
  color: #666;
}

/* Icono dentro del botón */
.btn-icon {
  font-size: 48px;
  color: #3F74BD;
  margin-right: 16px;
}

/* Flecha a la derecha */
.btn-arrow {
  margin-left: auto;
  font-size: 2rem;
  color: #888;
  font-weight: bold;
  padding-left: 24px;
}

/* Responsive: se ajusta el ancho en pantallas pequeñas */
@media (max-width: 768px) {
  .big-btn {
    width: 100%;
    height: 100px;
    padding: 0 8px;
  }
  
  .btn-img {
    width: 70px;
    height: 70px;
    margin-right: 16px;
  }
  
  .btn-title {
    font-size: 1.1rem;
  }

  .btn-description {
    font-size: 0.9rem;
  }

  .btn-icon {
    font-size: 36px;
    margin-right: 12px;
  }

  .btn-arrow {
    font-size: 1.5rem;
    padding-left: 16px;
  }
}

@media (max-width: 480px){
  .btn-description{
    display: none;
  }

  .btn-title{
    margin: 0;
  }

  .big-btn{
    height: 140px;
  }

  .btn-img{
    margin: 0;
  }
}
</style>
