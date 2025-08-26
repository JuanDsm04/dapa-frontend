<script setup>
import { ref } from "vue";
import OrderForm from "@/components/assignments/OrderForm.vue";

// Estado que indica si se está en modo formulario
const showOrderForm = ref(false);

const aceptar = () => {
    showOrderForm.value = true;
};

const volver = () => {
    showOrderForm.value = false;
};
</script>

<template>
    <div class="information-quote">
        <!-- Encabezado -->
        <header>
            <h2 v-if="!showOrderForm">Respuestas del formulario</h2>
            <h2 v-else>Ingresar información</h2>
        </header>

        <!-- Respuestas del formulario -->
        <section v-if="!showOrderForm" class="answer-container">
            <div v-for="i in 30" :key="i">Respuesta {{ i }}</div>
        </section>

        <!-- Formulario de información -->
        <section v-else class="order-form-container">
            <OrderForm :isEdit="false" @volver="volver" />
        </section>

        <!-- Botones -->
        <section v-if="!showOrderForm" class="action-container">
            <button>
                <span class="material-symbols-outlined">close</span>
                Rechazarla
            </button>
            <button @click="aceptar">
                <span class="material-symbols-outlined">check</span>
                Aceptarla
            </button>
        </section>
    </div>
</template>

<style scoped>
.information-quote {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    border-radius: 10px;
    background-color: white;
    height: 100%;
    max-height: 100%;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

header h2 {
    font-weight: 600;
}

.answer-container {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 2rem;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.order-form-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.action-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.action-container button {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    color: white;
}

.action-container button:first-child {
    background-color: #ff5a70;
}

.action-container button:first-child:hover {
  background-color: #f0566a;
}

.action-container button:last-child {
    background-color: #53d86c;
}

.action-container button:last-child:hover {
  background-color: #53cd69;
}

button span {
    margin-right: 0.5rem;
}
</style>
