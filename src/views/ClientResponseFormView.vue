<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PresentationHeader from '@/components/PresentationHeader.vue'
import FormPreview from '@/components/form/FormPreview.vue'
import { type Question } from '@/types/form'
import { getQuestions } from '@/services/formService'

// Estados reactivos
const activeQuestions = ref<Question[]>([])
const loading = ref(false)

// Cargar preguntas activas
const loadActiveQuestions = async () => {
    loading.value = true
    try {
        const allQuestions = await getQuestions()
        activeQuestions.value = allQuestions.filter(q => q.isActive)
    } catch (error) {
        console.error('Error cargando preguntas:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadActiveQuestions()
})
</script>

<template>
    <div class="client-response-container">
        <header>
            <PresentationHeader />
        </header>

        <main class="main-content">
            <div v-if="loading" class="loading-overlay">
                <div class="spinner"></div>
            </div>

            <section class="form-section">
                <div class="form-header">
                    <h2 class="title">Formulario de Cotización</h2>
                    <p class="subtitle">Completa todas las preguntas para enviar tus respuestas</p>
                </div>

                <!-- Aquí is-preview="false" para que sea funcional -->
                <FormPreview :questions="activeQuestions" :is-preview="false" />
            </section>
        </main>
    </div>
</template>

<style scoped>
header {
    margin: 0 auto 2rem auto;
    width: 100%;
    max-width: 800px;
}

.client-response-container {
    min-height: 100vh;
    background: var(--bg-general);
    padding: 2rem;
}

.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--neutral-gray-50);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 0.25rem solid var(--border-light);
    border-top: 0.25rem solid var(--principal-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.form-section {
    width: 100%;
    max-width: 50rem;
    background-color: var(--neutral-white);
    border-radius: 8px;
    margin: 1rem 0;
    padding: 2rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.form-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 0.125rem solid var(--border-light);
}

.title {
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--neutral-gray-900);
    font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
}

.subtitle {
    margin: 0;
    color: var(--neutral-gray-600);
    font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
}

@media screen and (max-width: 1200px) {
    header {
        width: 100%;
    }
}

@media (max-width: 770px) {
    header {
        margin-bottom: 0.5rem;
    }

    .form-section {
        margin: 1rem;
        padding: 1.5rem 1rem;
    }

    .title {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .client-response-container {
        padding: 0.5rem;
    }
}
</style>