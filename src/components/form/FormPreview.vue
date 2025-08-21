<script setup lang="ts">
import { ref } from 'vue'
import { type Question } from '@/types/form'
import QuestionPreview from './QuestionPreview.vue'
import { createSubmission } from '@/services/submissionService'
import { EyeIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/solid'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps<{
    questions: Question[]
    isPreview?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit-success', data: any): void
    (e: 'submit-error', error: any): void
}>()

const formData = ref<Record<number, any>>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)
const formKey = ref(0)
const questionErrors = ref<Record<number, string>>({}) // Errores por pregunta

const handleQuestionChange = (questionId: number, value: any) => {
    formData.value[questionId] = value
    submitError.value = null
    submitSuccess.value = false
    
    // Limpiar error de la pregunta específica cuando el usuario empiece a escribir
    if (questionErrors.value[questionId]) {
        delete questionErrors.value[questionId]
        questionErrors.value = { ...questionErrors.value }
    }
}

const validateForm = (): boolean => {
    questionErrors.value = {}
    let hasErrors = false
    
    for (const question of props.questions) {
        const value = formData.value[question.id!]
        let isValid = true
        
        if (value === undefined || value === null || value === '') {
            isValid = false
        }
        
        // Validación específica para arrays (preguntas de selección múltiple)
        if (Array.isArray(value) && value.length === 0) {
            isValid = false
        }
        
        if (!isValid) {
            questionErrors.value[question.id!] = 'Este campo es obligatorio'
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

    if (!validateForm()) {
        toast.error(submitError)
        return
    }

    // Modo preview no se envía nada
    if (props.isPreview) {
        console.log('Datos del formulario (Preview):', formData.value)
        toast.success('Formulario enviado (Preview)')
        resetForm()
        return
    }

    isSubmitting.value = true

    try {
        const answers = Object.entries(formData.value).map(([questionIdStr, value]) => {
            const questionId = parseInt(questionIdStr)
            const question = props.questions.find(q => q.id === questionId)

            if (!question) {
                console.warn(`Pregunta con ID ${questionId} no encontrada`)
                return null
            }

            if (question.options && question.options.length > 0) {
                let selectedOptionIds: number[] = []

                if (Array.isArray(value)) {
                    // Caso: checkboxes (múltiples opciones seleccionadas)
                    selectedOptionIds = question.options
                        .filter(opt => value.includes(opt.option))
                        .map(opt => opt.id)
                } else {
                    // Caso: radio o select (una sola opción seleccionada)
                    const selected = question.options.find(opt => opt.option === value.option)
                    if (selected) {
                        selectedOptionIds = [selected.id]
                    }
                }

                return {
                    questionId,
                    optionsId: selectedOptionIds 
                }
            }

            // Caso preguntas abiertas o de texto
            return {
                questionId,
                answer: value
            }
        }).filter(Boolean)

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
            <!-- Indicador de modo -->
            <div v-if="isPreview" class="preview-mode-indicator">
                <EyeIcon class="icon"/>
                Modo Vista Previa
            </div>

            <form @submit.prevent="submitForm" class="form-content">
                <!-- Estado vacío -->
                <div v-if="questions.length === 0" class="empty-state">
                    <WrenchScrewdriverIcon class="empty-icon"/>
                    <h3>No hay preguntas activas</h3>
                    <p>{{ isPreview ? 'Activa al menos una pregunta para ver la vista previa' : 'Intenta de nuevo más tarde' }}</p>
                </div>

                <!-- Preguntas -->
                <div v-else class="questions-container" :key="formKey">
                    <QuestionPreview 
                        v-for="question in questions" 
                        :key="question.id" 
                        :question="question"
                        :value="formData[question.id]" 
                        :error="questionErrors[question.id]"
                        @change="handleQuestionChange" 
                    />
                </div>

                <!-- Acciones del formulario -->
                <div v-if="questions.length > 0" class="form-actions">
                    <button 
                        type="submit" 
                        class="btn-submit"
                        :disabled="isSubmitting"
                        :class="{ 'submitting': isSubmitting }"
                    >
                        <span v-if="isSubmitting" class="spinner"></span>
                        {{ isSubmitting ? 'Enviando...' : (isPreview ? 'Prueba de envío' : 'Enviar formulario') }}
                    </button>
                    
                    <button 
                        type="button" 
                        @click="resetForm" 
                        class="btn-reset"
                        :disabled="isSubmitting"
                    >
                        Limpiar respuestas
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.form-viewer-container {
    background: white;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.form-viewer-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.preview-mode-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    color: #0369a1;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.form-content {
    max-width: 700px;
    margin: 0 auto;
}

.empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: #6c757d;
}

.empty-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.icon{
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
}

.alert-error {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
}

.alert-success {
    background: #f0fdf4;
    border: 1px solid #86efac;
    color: #16a34a;
}

.empty-state h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #374151;
}

.empty-state p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.8;
}

.questions-container {
    margin-bottom: 2rem;
}

.form-actions {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-submit {
    background: var(--add-btn, #3b82f6);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-submit.submitting {
    cursor: wait;
}

.btn-reset {
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-reset:hover:not(:disabled) {
    border-color: var(--on-delete-btn, #ef4444);
    color: var(--on-delete-btn, #ef4444);
    background: #fef2f2;
}

.btn-reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

@media (max-width: 768px) {
    .form-viewer-container {
        width: 95%;
        margin: 1rem;
    }

    .form-viewer-body {
        padding: 1rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-submit,
    .btn-reset {
        width: 100%;
        min-width: auto;
    }

    .preview-mode-indicator {
        font-size: 0.8rem;
        padding: 0.5rem 0.75rem;
    }
}
</style>