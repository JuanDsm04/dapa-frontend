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
      licenseExpirationDate: data.licenseExpirationDate,
      role: data.role,
    }
    user.value = currentUser
    console.log(currentUser)
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
  <div class="layout">
    <VerticalNav />
    <main>
      <header class="sticky-header">
        <h1>Mi perfil</h1>
        <button @click="handleLogout">
          <span class="material-symbols-outlined">
            power_settings_new
          </span>
        </button>
      </header>
      <div class="content">
        <UserForm :initialData="user" :updating="user" @submit="handleEditProfile"/>
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-general);
}

.layout main {
  width: 100%;
  padding: 0;
  margin-left: 80px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100vh;
  z-index: 1;
}

.sticky-header {
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background-color: var(--bg-general);
  z-index: 1000;
}

.content {
  padding: 0 2rem 2rem 2rem;
}

header h1 {
  font-weight: 600;
}

button {
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 50%;
  background-color: var(--on-delete-btn);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

span {
  color: var(--white);
}

@media (max-width: 770px) {
  .layout main {
    margin-left: 0;
    padding: 0;
  }
  
  .sticky-header,
  .content {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    margin-left: 3rem;
  }
}
</style>
