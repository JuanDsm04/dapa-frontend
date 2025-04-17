<script setup>
import { ref } from 'vue'

const name = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleRegister = async () => {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                phone: phone.value,
                email: email.value,
                password: password.value
            }),
        })

        if (!response.ok) {
            throw new Error('Error al registrar un nuevo usuario')
        }

        const data = await response.json()
        console.log(data)

    } catch (e) {
        console.log(e)
    }
}
</script>

<template>
    <main>
        <h3 class="title">Agregar usuario</h3>
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
                        <span class="icon">o</span>
                        <span class="toggle-label">{{ showPassword ? 'Ocultar' : 'Ver' }}</span>
                    </button>
                </div>
                <input type="password" id="Password" name="Password" v-model="password">
            </div>
            <button type="submit">Registrar</button>
        </form>
    </main>
</template>

<style scoped>
main {
    width: 500px;
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

.title{
    width: 100%;
    font-size: 1.5rem;
    text-align: center;
}

form {
    gap: 1.75rem;
}

label {
    margin-bottom: 0.1rem;
}

.pass-row {
    display: flex;
    justify-content: space-between;
}

input {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
}

button {
    border: 0;
    padding: 15px 0;
    border-radius: 32px;
    background-color: var(--color-form-button);
    font-size: 1.25rem;
    font-weight: 500;
}

.toggle-visibility-btn {
    display: flex;
    gap: 10px;
    color: gray;
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
