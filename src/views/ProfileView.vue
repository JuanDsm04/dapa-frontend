<script setup>
import router from '@/router'
import UserForm from '@/components/UserForm.vue'
import VerticalNav from '@/components/NavBar.vue'
import { getUserID } from "@/utils/auth";
import { ref, onMounted } from 'vue';

const user = ref(null)
const getCurrentUserData = async () => {
  const id = getUserID()
  if (!id) {
    console.warn("No UserID found");
    return;
  }
  try {
    const token = localStorage.getItem('token') 
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
    })
    const data = await response.json()
    const currentUser = {
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: data.role,
    }
    user.value = currentUser
  } catch (error) {
    console.log("Error obteniendo al usuario loggeado:", error)
  }
}
const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
}
const handleEditProfile = async (payload) => {
  const id = getUserID()
  console.log(payload)
  if (!id) {
    console.warn("No UserID found");
    return;
  }
  const token = localStorage.getItem('token')
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
      body: JSON.stringify(payload),
    })
    console.log('Perfil Editado exitosamente')
  } catch (error) {
    console.error('Error al editar perfil:', error)
  }
};
onMounted(() => {
  getCurrentUserData()
})

</script>

<template>
	<VerticalNav />
	<main class="content">
		<header>
			<h1>Mi perfil</h1>
		</header>
		<UserForm :initialData="user" :updating="user" @submit="handleEditProfile"/>
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
