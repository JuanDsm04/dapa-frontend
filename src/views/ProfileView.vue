<script setup>
import router from '@/router'
import UserForm from '@/components/UserForm.vue'
import VerticalNav from '@/components/NavBar.vue'
const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
}
</script>

<template>
	<VerticalNav />
	<main class="content">
		<header>
			<h1>Mi perfil</h1>
		</header>
		<UserForm />
		<section>
    		<button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
		</section>
	</main>
</template>

<style scoped>
.content {
	margin-left: 80px;
	padding: 2rem;
    display: flex;
	flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100dvh;
    width: calc(100% - 80px);
}

header {
	align-self: start;
	padding: 0 0 30px 0;
}

.btn-logout{
	width: 100%;
    color: var(--white);
    border: none;
    border-radius: 32px;
    padding: 15px 0;
    font-weight: 500;
	font-size: 1.25rem;
    cursor: pointer;
    background-color: var(--delete-btn);
}

.btn-logout:hover{
    background-color: var(--delete-btn-hover);
}

section {
	padding: 1.75rem 0;
	max-width: 500px;
	width: 100%;
}
</style>
