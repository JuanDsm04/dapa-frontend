<script setup lang="ts">
import router from '@/router';
import UserForm from '@/components/UserForm.vue';
import { getUserID } from '@/utils/auth';
import { ref, onMounted } from 'vue';
import { getUserById, updateUser } from '@/services/userService';
import type { User } from '@/types/user';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const user = ref<User | null>(null);

// Obtener datos del usuario actual
const getCurrentUserData = async () => {
  const id = getUserID();
  if (!id) {
    console.warn("No se encontró el ID del usuario.");
    return;
  }

  try {
    const data = await getUserById(Number(id));

    user.value = {
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: data.password,
      licenseExpirationDate: data.licenseExpirationDate,
      role: data.role,
    };
  } catch (error) {
    console.error("Error obteniendo al usuario loggeado:", error);
    toast.error("No se pudo cargar la información del perfil.");
  }
};

// Cerrar sesión
const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
  toast.info("Sesión cerrada correctamente.");
};

// Editar perfil
const handleEditProfile = async (payload: Partial<User>) => {
  const id = getUserID();
  if (!id) {
    console.warn("No se encontró el ID del usuario.");
    return;
  }

  try {
    await updateUser(Number(id), payload);
    toast.success("Perfil actualizado exitosamente.");

    // Actualizar los datos para reflejar los cambios
    await getCurrentUserData();
  } catch (error) {
    console.error("Error al editar perfil:", error);
    toast.error("Hubo un error al actualizar el perfil.");
  }
};

// Montar el componente
onMounted(() => {
  getCurrentUserData();
});
</script>

<template>
  <div class="layout">
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
        <UserForm :initialData="user" :updating="user != null" @submit="handleEditProfile"/>
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
