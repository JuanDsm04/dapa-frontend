<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Question } from '@/types/form'
import QuestionPreview from './QuestionPreview.vue';

const props = defineProps<{
    questions: Question[]
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const formData = ref<Record<string, any>>({})

const activeQuestions = computed(() =>
    props.questions.filter(q => q.isActive)
)

const handleQuestionChange = (questionId: number, value: any) => {
    formData.value[questionId] = value
}

const submitForm = () => {
    console.log('Datos del formulario:', formData.value)
    alert('Formulario enviado (solo preview)')
}

const resetForm = () => {
    formData.value = {}
}
</script>

<template>
    <div class="preview-container">
        <div class="preview-body">
            <form @submit.prevent="submitForm" class="preview-form">
                <div v-if="activeQuestions.length === 0" class="empty-preview">
                    <p>No hay preguntas activas para mostrar</p>
                    <p class="empty-subtitle">Activa al menos una pregunta para ver la vista previa</p>
                </div>

                <div v-else class="questions-container">
                    <QuestionPreview v-for="question in activeQuestions" :key="question.id" :question="question"
                        :value="formData[question.id!]" @change="handleQuestionChange" />
                </div>

                <div v-if="activeQuestions.length > 0" class="form-actions">
                    <button type="submit" class="btn-submit">
                        Enviar formulario
                    </button>
                    <button type="button" @click="resetForm" class="btn-reset">
                        Limpiar respuestas
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.preview-container {
    background: white;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.preview-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.preview-form {
    max-width: 600px;
    margin: 0 auto;
}

.empty-preview {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
}

.empty-preview p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

.empty-subtitle {
    font-size: 0.9rem !important;
    opacity: 0.8;
}

.form-actions {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-submit {
    background: var(--add-btn);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-submit:hover {
    transform: translateY(-2px);
}

.btn-reset {
    background: white;
    color: #666;
    border: 2px solid #e0e0e0;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-reset:hover {
    border-color: var(--on-delete-btn);
    color: var(--on-delete-btn);
    background: #f8f9fa;
}

@media (max-width: 768px) {
    .preview-container {
        width: 95%;
        margin: 1rem;
    }

    .preview-header {
        padding: 1rem 1.5rem;
    }

    .preview-header h2 {
        font-size: 1.25rem;
    }

    .preview-body {
        padding: 1.5rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-submit,
    .btn-reset {
        width: 100%;
    }
}
</style>
