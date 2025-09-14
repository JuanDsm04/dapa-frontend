<script setup lang="ts">
import router from '@/router';
import UserForm from '@/components/UserForm.vue';
import { getUserID } from '@/utils/auth';
import { ref, onMounted } from 'vue';
import { getUserById, updateUser } from '@/services/userService';
import type { User } from '@/types/user';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const user = ref<User | undefined>(undefined);
const loading = ref(false);

// Obtener datos del usuario actual
const getCurrentUserData = async () => {
  loading.value = true;
  const id = getUserID()
  if (!id) {
    console.warn("No se encontró el ID del usuario.")
    return
  }

  try {
    user.value = await getUserById(Number(id))
  } catch (error) {
    console.error("Error obteniendo al usuario loggeado:", error)
    toast.error("No se pudo cargar la información del perfil.")
  }finally{
    loading.value = false;
  }
}

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

  loading.value = true;
  try {
    await updateUser(Number(id), payload);
    toast.success("Perfil actualizado exitosamente.");

    // Actualizar los datos para reflejar los cambios
    await getCurrentUserData();
  } catch (error) {
    console.error("Error al editar perfil:", error);
    toast.error("Hubo un error al actualizar el perfil.");
  }finally{
    loading.value = false;
  }
};

// Montar el componente
onMounted(() => {
  getCurrentUserData();
});
</script>

<template>
  <div class="profile-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Cargando perfil...</p>
      </div>
    </div>

    <!-- Header Section -->
    <header class="profile-header">
      <div class="header-content">
        <div class="header-left">
          <div class="avatar-section">
            <div class="avatar">
              <span class="material-symbols-outlined">person</span>
            </div>
            <div class="user-info">
              <h1 class="page-title">Mi Perfil</h1>
              <p class="user-subtitle" v-if="user">{{ user.name || 'Usuario' }}</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="logout-btn" @click="handleLogout" title="Cerrar sesión">
            <span class="material-symbols-outlined">logout</span>
            <span class="btn-text">Salir</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="profile-main">
      <div class="profile-card">
        <div class="card-img">
          <img src="../assets/images/profile-truck.jpg" alt="Imagen de perfil" />
        </div>
        <div class="card-body">
          <div class="card-header">
            <h2>Información del perfil</h2>
            <p class="card-subtitle">Actualiza tu información personal</p>
          </div>
          
          <div class="card-content">
            <UserForm 
              :initialData="user" 
              :updating="user != null" 
              :isProfile="true" 
              @submit="handleEditProfile"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: var(--bg-general);
  position: relative;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--border-light);
  border-top: 3px solid var(--principal-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--principal-gray-700);
  font-size: 0.875rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-header {
  background: var(--neutral-white);
  border-bottom: 1px solid var(--border-light);
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 4rem;
  height: 4rem;
  background: var(--neutral-gray-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar span {
  color: var(--neutral-white);
  font-size: 1.5rem;
}

.user-info h1 {
  margin: 0;
  font-weight: 600;
  color: var(--principal-gray-700);
}

.user-subtitle {
  margin: 0.25rem 0 0 0;
  color: var(--neutral-gray-500);
  font-size: 0.875rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--principal-error);
  color: var(--neutral-white);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--principal-error-hover);
}

.logout-btn .material-symbols-outlined {
  font-size: 1.25rem;
}

.profile-main {
  margin: 0 auto;
  padding: 3rem 2rem;
}

.profile-card {
  background: var(--neutral-white);
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: row;
  width: fit-content; 
  margin: 0 auto;
}

.card-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 2rem;
}

.card-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-gray-900);
}

.card-subtitle {
  margin: 0;
  color: var(--neutral-gray-600);
  font-size: 0.875rem;
}

.card-content {
  padding: 0 2rem 2rem 2rem;
}

.card-img {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;
}

.card-img img {
  display: block;
  width: 400px;
}

@media (max-width: 1200px) {
  .card-img img {
    width: 250px;
  }
}

@media (max-width: 1000px) {
  .card-img {
    margin-left: 0rem;
  }
  .card-img img {
    display: none;
    width: 400px;
  }
}

@media (max-width: 770px) {
  .profile-card {
    flex-direction: column;
    width: 100%;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .profile-main {
    padding: 2rem 1rem;
  }

  .profile-card {
    border-radius: 16px;
  }

  .card-header,
  .card-content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .logout-btn .btn-text {
    display: none;
  }

  .logout-btn {
    width: 3rem;
    height: 3rem;
    padding: 0;
    border-radius: 50%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 1rem;
  }

  .profile-main {
    padding: 1.5rem 1rem;
  }

  .card-header,
  .card-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>