<script setup>
import router from '@/router'
const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
}
</script>

<template>
<div class="container">
    <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
</div>
</template>

<style scoped>
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
    width: 100%;
}

.btn-logout{
    color: var(--white);
    border: none;
    border-radius: 12px;
    padding: 8px 16px;
    font-weight: 500;
    cursor: pointer;
    background-color: var(--delete-btn);
}

.btn-logout:hover{
    background-color: var(--delete-btn-hover);
}
</style>