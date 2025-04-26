<script setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

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

const handleRegister = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                role: role.value
            }),
        })

        if (!response.ok) {
            throw new Error('Error al registrar un nuevo usuario')
        }

        alert('¡Usuario creado exitosamente!')

    } catch (e) {
        console.log(e)
        alert(e.message || 'Ocurrió un error al agregar al usuario')
    }
}
</script>

<template>
    <main>
        <form @submit.prevent="handleRegister">
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
            <div class="field">
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
            <div class="field">
                <label for="Role">Rol</label>
                <select name="Role" id="Role" v-model="role">
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button type="submit">Registrar</button>
        </form>
    </main>
</template>

<style scoped>
    main {
        max-width: 500px;
    }

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

    input, select {
        padding: 0.75rem 1rem;
        border-radius: 8px;
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
        padding: 15px 0;
        border-radius: 32px;
        background-color: var(--primary);
        font-size: 1.25rem;
        font-weight: 500;
    }

    form > button:hover {
        background-color: var(--primary-dark);
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
</style>
