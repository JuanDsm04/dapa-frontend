<script setup lang="ts">
import FormPreview from '@/components/form/FormPreview.vue'
import { ref } from 'vue'
import { type Question } from '@/types/form'

// Ejemplo de preguntas: solo se mostrarán aquellas con active: true
const formQuestions = ref<Question[]>([
  {
    id: '1',
    text: '¿Cuál es tu nombre completo?',
    type: 'text',
    active: true
  },
  {
    id: '2',
    text: '¿Cuál es tu color favorito?',
    type: 'multiple',
    options: ['Rojo', 'Verde', 'Azul'],
    active: true
  },
  {
    id: '3',
    text: '¿En qué ciudad vives?',
    type: 'dropdown',
    options: ['Ciudad de Guatemala', 'Quetzaltenango', 'Escuintla', 'Otra'],
    active: true
  }
])
</script>

<template>
  <main class="main-content">
    <section class="form-response">
      <div class="form-header">
          <h2 class="title">Formulario de cotización</h2>
      </div>
      <FormPreview :questions="formQuestions" />
    </section>
  </main>
</template>

<style scoped>
.main-content{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100dvh;
  background: var(--bg-general);
}

.form-response {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-heaader{
  display: flex;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 2px solid #e9ecef;
}

.title{
  font-weight: 600;
  margin-top: 2rem;
  color: #333;
  font-size: 1.5rem;
}
</style>

