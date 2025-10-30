<script setup lang="ts">
import { ref, watch } from 'vue'
import { type Question, type QuestionOption, type Answer } from '@/types/form'
import QuestionPreview from './QuestionPreview.vue'
import { createSubmission } from '@/services/submissionService'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps<{
    questions: Question[]
    answers?: Answer[]
    isPreview?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit-success', data: any): void
    (e: 'submit-error', error: any): void
}>()

// Estado principal
const formData = ref<Record<number, string | number | number[]>>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)
const formKey = ref(0)
const questionErrors = ref<Record<number, string>>({})
const isReadOnly = ref(false)

// Si se reciben respuestas se activa el modo lectura
watch(
    () => props.answers,
    (newAnswers) => {
        if (Array.isArray(newAnswers) && newAnswers.length > 0) {
            const filledForm: Record<number, any> = {}

            for (const ans of newAnswers) {
                if (ans.options && ans.options.length > 0) {
                    // Pregunta de selección múltiple
                    if (ans.question.type.type === 'multiple') {
                        filledForm[ans.question.id] = ans.options.map((opt: QuestionOption) => opt.id)
                    } else {
                        // Dropdown o única selección
                        filledForm[ans.question.id] = ans.options[0]?.id ?? ''
                    }
                }else{
                    filledForm[ans.question.id] = ans.answer
                }
            }

            formData.value = filledForm
            isReadOnly.value = true
        } else {
            formData.value = {}
            isReadOnly.value = false
        }
    },
    { immediate: true }
)

const handleQuestionChange = (questionId: number, value: any) => {
    if (isReadOnly.value) return

    formData.value[questionId] = value
    submitError.value = null
    submitSuccess.value = false

    if (questionErrors.value[questionId]) {
        delete questionErrors.value[questionId]
        questionErrors.value = { ...questionErrors.value }
    }
}

const validateForm = (): boolean => {
    questionErrors.value = {}
    let hasErrors = false

    for (const question of props.questions) {
        if (!question.isRequired) continue
        const value = formData.value[question.id]
        let isValid = true

        // Si no se seleccionó nada o está vacío
        if (value === undefined || value === null || value === '') {
            isValid = false
        }

        // Validar arrays (checkboxes)
        if (Array.isArray(value) && value.length === 0) {
            isValid = false
        }

        if (!isValid) {
            questionErrors.value[question.id] = 'Este campo es obligatorio'
            hasErrors = true
        }
    }

    if (hasErrors) {
        submitError.value = 'Por favor, completa todos los campos obligatorios'
        return false
    }

    return true
}

const submitForm = async () => {
    if (isReadOnly.value || props.isPreview) return

    if (!validateForm()) {
        toast.error(submitError.value || 'Formulario incompleto')
        return
    }

    isSubmitting.value = true

    try {
        // Construir payload en el formato que tu API espera
        const answers = Object.entries(formData.value)
            .map(([questionIdStr, value]) => {
                const questionId = parseInt(questionIdStr)
                const question = props.questions.find(q => q.id === questionId)
                if (!question) return null

                // Preguntas con opciones
                if (question.options && question.options.length > 0) {
                    const selectedOptionIds = Array.isArray(value) ? value : [value]
                    return {
                        questionId,
                        optionsId: selectedOptionIds
                    }
                }

                // Preguntas abiertas
                return {
                    questionId,
                    answer: value as string
                }
            })
            .filter(Boolean)

        const payload = { answers }
        const response = await createSubmission(payload)
        emit('submit-success', response)
        toast.success('¡Formulario enviado exitosamente!')
        resetForm()
    } catch (error: any) {
        console.error('Error al enviar formulario:', error)
        emit('submit-error', error)
        toast.error('Error al enviar el formulario. Por favor, intenta nuevamente.')
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    formData.value = {}
    questionErrors.value = {}
    formKey.value++
}
</script>

<template>
    <div class="form-viewer-container">
        <div class="form-viewer-body">
            <!-- Indicador de modo preview -->
            <div v-if="isPreview && !isReadOnly" class="preview-mode-indicator">
                <span class="material-symbols-outlined">visibility</span>
                Modo Vista Previa
            </div>

            <form @submit.prevent="submitForm" class="form-content">
                <!-- Estado vacío -->
                <div v-if="questions.length === 0" class="empty-state">
                    <span class="material-symbols-outlined">construction</span>
                    <h3>No hay preguntas activas</h3>
                    <p>
                        {{
                            isPreview
                                ? 'Activa al menos una pregunta para ver la vista previa'
                                : 'Intenta de nuevo más tarde'
                        }}
                    </p>
                </div>

                <!-- Preguntas -->
                <div v-else class="questions-container" :key="formKey">
                    <QuestionPreview v-for="question in questions" :key="question.id" :question="question"
                        :value="formData[question.id]" :error="questionErrors[question.id]" :readOnly="isReadOnly"
                        @change="handleQuestionChange" />
                </div>

                <!-- Acciones - Solo si NO es preview y NO es readOnly -->
                <div v-if="questions.length > 0 && !isPreview && !isReadOnly" class="form-actions">
                    <button type="submit" class="btn-submit" :disabled="isSubmitting"
                        :class="{ submitting: isSubmitting }">
                        <span v-if="isSubmitting" class="spinner"></span>
                        {{ isSubmitting ? 'Enviando...' : 'Enviar formulario' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.form-viewer-container {
    background: var(--neutral-white);
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
}

.form-viewer-body {
    flex: 1;
    padding: 1.5rem;
}

.preview-mode-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--neutral-gray-100);
    border: 1px solid var(--principal-primary-100);
    color: var(--principal-primary-400);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
    font-weight: 500;
}

.form-content {
    max-width: 700px;
    margin: 0 auto;
}

.empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: var(--principal-primary-500);
}

.empty-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.icon {
    width: 1rem;
    height: 1rem;
}

.alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    font-weight: 500;
    font-size: clamp(0.8rem, 1.5vw, 0.875rem);
}

.alert-error {
    background: var(--neutral-gray-100);
    border: 1px solid var(--principal-primary-100);
    color: var(--principal-primary-500);
}

.alert-success {
    background: var(--neutral-gray-100);
    border: 1px solid var(--principal-secondary-100);
    color: var(--principal-secondary-500);
}

.empty-state h3 {
    margin: 0 0 0.5rem 0;
    font-size: clamp(1.1rem, 2vw, 1.25rem);
    color: var(--neutral-gray-600);
}

.empty-state p {
    margin: 0;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
    opacity: 0.8;
}

.questions-container {
    margin-bottom: 2rem;
}

.form-actions {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--neutral-gray-50);
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-submit {
    background: var(--principal-primary);
    color: var(--neutral-white);
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
    font-weight: 600;
    cursor: pointer;
    position: relative;
    min-width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
    background: var(--principal-primary-hover);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-submit.submitting {
    cursor: wait;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 770px) {
    .form-viewer-body {
        padding: 0rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-submit {
        width: 100%;
        min-width: auto;
    }

    .preview-mode-indicator {
        font-size: 0.8rem;
        padding: 0.5rem 0.75rem;
    }
}
</style>