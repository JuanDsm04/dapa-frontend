<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
    initialData?: {
        id?: number
        name?: string
        lastName?: string
        phone?: string
        email?: string
        password?: string
        role?: string
        licenseExpirationDate?: string
    },
    updating?: boolean
    isProfile?: boolean
}>()

const emit = defineEmits<{
    (e: 'submit', payload: any): void
    (e: 'cancel'): void
}>()

// Validar el formulario y emitir el submit
const handleSubmit = () => {
    errors.value = {}

    if (!name.value.trim()) {
        errors.value.name = 'El nombre es requerido *'
    }

    if (!lastName.value.trim()) {
        errors.value.lastName = 'El apellido es requerido *'
    }

    if (!/^\d{8}$/.test(phone.value)) {
        errors.value.phone = 'El teléfono debe tener 8 dígitos numéricos *'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = 'Correo no válido *'
    }

    if (password.value.length < 8) {
        errors.value.password = 'La contraseña debe tener al menos 8 caracteres *'
    }

    if (role.value === 'driver' && !licenseExpirationDate.value) {
        errors.value.licenseExpirationDate = 'Fecha de licencia requerida para pilotos *'
    }

    if (Object.keys(errors.value).length > 0) return

    // Convertir fecha a formato requerido
    const licenseDate = licenseExpirationDate.value
        ? new Date(licenseExpirationDate.value).toISOString()
        : undefined

    emit('submit', {
        id: props.initialData?.id,
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        role: role.value,
        licenseExpirationDate: role.value === 'driver' ? licenseDate : undefined,
    })
}

// Variables para cada campo del formulario y estado de errores
const name = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const role = ref('driver')
const showPassword = ref(false)
const licenseExpirationDate = ref('')
const errors = ref<Record<string, string>>({})

// Cambiar el estado de visibilidad de la contraseña
const togglePassVisibility = () => {
    showPassword.value = !showPassword.value
}

// Controlar que el campo teléfono solo tenga números al ser ingresado
const onPhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    phone.value = input.value.replace(/\D/g, '')
}

// Observar cambios en initialData para llenar el formulario cuando se edita
watch(() => props.initialData, (newData) => {
    if (newData) {
        name.value = newData.name || ''
        lastName.value = newData.lastName || ''
        phone.value = newData.phone || ''
        email.value = newData.email || ''
        password.value = newData.password || ''
        role.value = newData.role || 'driver'
        licenseExpirationDate.value = newData.licenseExpirationDate
            ? newData.licenseExpirationDate.split('T')[0]
            : ''
    }
}, { immediate: true })

</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="field-group">
            <div class="field">
                <label for="Name">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" v-model="name">
                <p v-if="errors.name" class="error">{{ errors.name }}</p>
            </div>
            <div class="field">
                <label for="LastName">Apellido</label>
                <input type="text" id="LastName" name="LastName" v-model="lastName">
                <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>
            </div>
        </div>

        <div class="field">
            <label for="Phone">Teléfono</label>
            <input type="tel" id="Phone" name="Phone" v-model="phone" @input="onPhoneInput">
            <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <div class="field">
            <label for="Email">Email</label>
            <input type="text" id="Email" name="Email" v-model="email">
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
        </div>

        <div class="field" v-if="!updating">
            <div class="pass-row">
                <label for="Password">Contraseña</label>
                <button type="button" class="toggle-visibility-btn" @click="togglePassVisibility">
                    <div class="icon-wrapper">
                        <EyeIcon v-if="showPassword" />
                        <EyeSlashIcon v-else />
                    </div>
                    <span class="toggle-label">{{ showPassword ? 'Ocultar' : 'Ver' }}</span>
                </button>
            </div>
            <input :type="showPassword ? 'text' : 'password'" id="Password" name="Password" v-model="password" />
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <div class="field" v-if="!isProfile">
            <label for="Role">Rol</label>
            <select name="Role" id="Role" v-model="role">
                <option value="driver">Piloto</option>
                <option value="admin">Administrador</option>
            </select>
        </div>

        <div class="field" v-if="role === 'driver'">
            <label for="LicenseExpiration">Fecha de vencimiento de licencia</label>
            <input type="date" id="LicenseExpiration" v-model="licenseExpirationDate">
            <p v-if="errors.licenseExpirationDate" class="error">{{ errors.licenseExpirationDate }}</p>
        </div>

        <button type="submit">{{ (!updating && !isProfile) ? 'Confirmar' : 'Actualizar' }}</button>
    </form>
</template>

<style scoped>
.field-group {
    display: flex;
    gap: 5px;
}

.field {
    width: 100%;
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}

label {
    margin-bottom: 0.1rem;
}

div p {
    font-size: 10px;
    color: red;
    margin-left: 5px;
}

.pass-row {
    display: flex;
    justify-content: space-between;
}

input,
select {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border-input);
    font-size: 1rem;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    height: 1rem;
    width: 1rem;
}

button {
    border: 0;
    padding: 15px 35px;
    border-radius: 10px;
    background-color: var(--add-btn);
    color: var(--white);
    font-size: 1rem;
    font-weight: 500;
    margin: 0 auto;
    cursor: pointer;
}

form>button:hover {
    background-color: var(--add-btn-hover);
}

.toggle-visibility-btn {
    display: flex;
    gap: 10px;
    color: var(--button-secondary);
    align-items: center;
    margin-right: 10px;
    background-color: transparent;
    padding: 0;
}

.toggle-label {
    font-weight: lighter;
    font-size: 0.90rem;
}

@media screen and (max-width: 770px) {
    .field-group {
        flex-direction: column;
        gap: 1.75rem;
    }
}
</style>