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
    },
    updating?: boolean
    isProfile?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: any): void
  (e: 'cancel'): void
}>()

const handleSubmit = () => {
  emit('submit', {
    id: props.initialData?.id,
    name: name.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    role: role.value,
  })
}

const name = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const role = ref('driver')
const showPassword = ref(false)

const togglePassVisibility = () => {
    showPassword.value = !showPassword.value
}


watch(() => props.initialData, (newData) => {
    if (newData) {
        name.value = newData.name || ''
        lastName.value = newData.lastName || ''
        phone.value = newData.phone || ''
        email.value = newData.email || ''
        password.value = newData.password || ''
        role.value = newData.role || 'driver'
    }
}, { immediate: true })
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="field-group">
            <div class="field">
                <label for="Name">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" v-model="name">
            </div>
            <div class="field">
                <label for="LastName">Apellido</label>
                <input type="text" id="LastName" name="LastName" v-model="lastName">
            </div>
        </div>
        <div class="field">
            <label for="Phone">Teléfono</label>
            <input type="text" id="Phone" name="Phone" v-model="phone">
        </div>
        <div class="field">
            <label for="Email">Email</label>
            <input type="text" id="Email" name="Email" v-model="email">
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
        </div>
        <div class="field" v-if="!isProfile">
            <label for="Role">Rol</label>
            <select name="Role" id="Role" v-model="role">
                <option value="driver">Piloto</option>
                <option value="admin">Administrador</option>
            </select>
        </div>

        <button type="submit">{{(!updating && !isProfile) ? 'Confirmar' : 'Actualizar'}}</button>
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

    form > button:hover {
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