<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PresentationHeader from '@/components/PresentationHeader.vue'
import FormPreview from '@/components/form/FormPreview.vue'
import { type Question } from '@/types/form'
import { getQuestions } from '@/services/formService'

// Estados reactivos
const activeQuestions = ref<Question[]>([])
const loading = ref(false)
const showThankYouMessage = ref(false)

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

// Manejar envío exitoso del formulario
const handleSubmitSuccess = (data: any) => {
    showThankYouMessage.value = true
}

// Manejar error en envío
const handleSubmitError = (error: any) => {
    console.error('Error en envío desde ClientResponseFormView:', error)
}

// Reiniciar formulario para nueva cotización
const startNewQuote = () => {
    showThankYouMessage.value = false
    loadActiveQuestions()
}

// Funciones para contacto
const openWhatsApp = () => {
    window.open('https://wa.me/50250557258', '_blank')
}

const callPhone = () => {
    window.open('tel:+50266765803', '_blank')
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

            <!-- Mensaje informativo -->
            <section v-if="showThankYouMessage" class="thank-you-section">
                <div class="thank-you-card">
                    <div class="thank-you-icon">
                        <span class="material-symbols-outlined">check_circle</span>
                    </div>
                    <h2 class="thank-you-title">¡Gracias por cotizar con nosotros!</h2>
                    <p class="thank-you-message">
                        Hemos recibido tu solicitud de cotización. Nuestro equipo revisará la información 
                        y se pondrá en contacto contigo lo antes posible.
                    </p>
                    
                    <div class="thank-you-details">
                        <p>• Puedes contactarnos si tienes preguntas adicionales</p>
                        <p>• Nuestro equipo está aquí para ayudarte</p>
                        <p>• Si necesitas agregar más información evita enviar el formulario nuevamente, contáctanos directamente</p>
                    </div>

                    <!-- Medios de contacto -->
                    <div class="contact-section">
                        <h3 class="contact-title">¿Necesitas contactarnos?</h3>
                        <div class="contact-options">
                            <button @click="openWhatsApp" class="contact-btn whatsapp-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                                    <path fill="currentColor" fill-rule="evenodd" d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.996094 22.542969 28 15.953125 C 28 12.761719 26.757813 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.117188 15.945313 C 6.117188 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.054688 23.074219 8.929688 C 24.949219 10.808594 25.980469 13.300781 25.980469 15.953125 C 25.980469 21.429688 21.523438 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.625 C 18.585938 17.925781 18.015625 18.597656 17.839844 18.796875 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.40625 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.019531 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.578125 13.5625 14.363281 13.710938 14.1875 C 13.859375 14.015625 13.910156 13.890625 14.011719 13.691406 C 14.109375 13.492188 14.058594 13.316406 13.984375 13.167969 C 13.910156 13.019531 13.3125 11.546875 13.0625 10.949219 C 12.820313 10.367188 12.574219 10.449219 12.390625 10.4375 C 12.21875 10.429688 12.019531 10.429688 11.820313 10.429688 C 11.621094 10.429688 11.296875 10.503906 11.023438 10.804688 C 10.75 11.101563 9.980469 11.824219 9.980469 13.292969 C 9.980469 14.761719 11.050781 16.183594 11.199219 16.382813 C 11.347656 16.578125 13.304688 19.59375 16.300781 20.886719 C 17.011719 21.195313 17.566406 21.378906 18 21.515625 C 18.714844 21.742188 19.367188 21.710938 19.882813 21.636719 C 20.457031 21.550781 21.648438 20.914063 21.898438 20.214844 C 22.144531 19.519531 22.144531 18.921875 22.070313 18.796875 C 21.996094 18.671875 21.796875 18.597656 21.496094 18.445313 Z"></path>
                                </svg>
                                <span>WhatsApp</span>
                                <span class="contact-number">5055-7258</span>
                            </button>
                            
                            <button @click="callPhone" class="contact-btn phone-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
                                    <path fill="currentColor" d="M 14 3.9902344 C 8.4886661 3.9902344 4 8.4789008 4 13.990234 L 4 35.990234 C 4 41.501568 8.4886661 45.990234 14 45.990234 L 36 45.990234 C 41.511334 45.990234 46 41.501568 46 35.990234 L 46 13.990234 C 46 8.4789008 41.511334 3.9902344 36 3.9902344 L 14 3.9902344 z M 18.005859 12.033203 C 18.633859 12.060203 19.210594 12.414031 19.558594 12.957031 C 19.954594 13.575031 20.569141 14.534156 21.369141 15.785156 C 22.099141 16.926156 22.150047 18.399844 21.498047 19.589844 L 20.033203 21.673828 C 19.637203 22.237828 19.558219 22.959703 19.824219 23.595703 C 20.238219 24.585703 21.040797 26.107203 22.466797 27.533203 C 23.892797 28.959203 25.414297 29.761781 26.404297 30.175781 C 27.040297 30.441781 27.762172 30.362797 28.326172 29.966797 L 30.410156 28.501953 C 31.600156 27.849953 33.073844 27.901859 34.214844 28.630859 C 35.465844 29.430859 36.424969 30.045406 37.042969 30.441406 C 37.585969 30.789406 37.939797 31.366141 37.966797 31.994141 C 38.120797 35.558141 35.359641 37.001953 34.556641 37.001953 C 34.000641 37.001953 27.316344 37.761656 19.777344 30.222656 C 12.238344 22.683656 12.998047 15.999359 12.998047 15.443359 C 12.998047 14.640359 14.441859 11.879203 18.005859 12.033203 z"></path>
                                </svg>
                                <span>Teléfono</span>
                                <span class="contact-number">6676-5803</span>
                            </button>
                        </div>
                    </div>

                    <button @click="startNewQuote" class="btn-new-quote">
                        Nueva cotización
                    </button>
                </div>
            </section>

            <!-- Formulario -->
            <section v-else class="form-section">
                <div class="form-header">
                    <h2 class="title">Formulario de Cotización</h2>
                    <p class="subtitle">Completa todas las preguntas para enviar tus respuestas</p>
                </div>

                <FormPreview 
                    :questions="activeQuestions" 
                    :is-preview="false" 
                    @submit-success="handleSubmitSuccess"
                    @submit-error="handleSubmitError"
                />
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

.thank-you-section {
    width: 100%;
    max-width: 50rem;
    margin: 1rem 0;
}

.thank-you-card {
    background-color: var(--neutral-white);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.thank-you-icon {
    margin-bottom: 1.5rem;
}

.thank-you-icon .material-symbols-outlined {
    font-size: 4rem;
    color: var(--principal-secondary-500);
    background: var(--principal-secondary-100);
    border-radius: 50%;
    padding: 1rem;
    width: 6rem;
    height: 6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.thank-you-title {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: var(--neutral-gray-900);
}

.thank-you-message {
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    color: var(--neutral-gray-700);
    margin: 0 0 2rem 0;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.thank-you-details {
    background: var(--neutral-gray-50);
    border-radius: 10px;
    padding: 1.5rem;
    margin: 2rem 0;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.thank-you-details p {
    margin: 0.75rem 0;
    color: var(--neutral-gray-700);
    font-size: clamp(0.9rem, 1.2vw, 1rem);
    display: flex;
    align-items: center;
    text-align: left;
}

.contact-section {
    margin: 2rem 0;
    padding: 2rem 1.5rem;
    border-radius: 10px;
    background: var(--neutral-gray-50);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.contact-title {
    font-size: clamp(1.125rem, 1.5vw, 1.25rem);
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: var(--neutral-gray-800);
}

.contact-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--neutral-white);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: clamp(0.9rem, 1.2vw, 1rem);
    font-weight: 500;
    text-decoration: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.contact-btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.contact-number {
    margin-left: auto;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
}

.btn-new-quote {
    background: var(--principal-primary);
    color: var(--neutral-white);
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.btn-new-quote:hover {
    background: var(--principal-primary-hover);
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

    .form-section,
    .thank-you-card {
        margin: 1rem;
        padding: 1.5rem 1rem;
    }

    .title {
        font-size: 1.5rem;
    }

    .thank-you-card {
        padding: 2rem 1.5rem;
    }

    .thank-you-icon .material-symbols-outlined {
        font-size: 3rem;
        width: 5rem;
        height: 5rem;
    }

    .thank-you-details {
        padding: 1rem;
        margin: 1.5rem 0;
    }

    .contact-section {
        padding: 1.5rem 1rem;
        margin: 1.5rem 0;
    }

    .contact-options {
        gap: 0.75rem;
    }

    .contact-btn {
        padding: 0.875rem 1rem;
        gap: 0.75rem;
    }
}

@media (max-width: 480px) {
    .client-response-container {
        padding: 0.5rem;
    }

    .thank-you-card {
        padding: 1.5rem 1rem;
    }

    .contact-section {
        padding: 1rem;
    }

    .contact-btn {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem;
    }

    .contact-number {
        margin-left: 0;
        margin-top: 0.25rem;
    }
}
</style>