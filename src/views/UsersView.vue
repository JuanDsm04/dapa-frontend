<script setup>
import { ref, onMounted, computed } from 'vue';
import UserForm from '@/components/UserForm.vue';
import VerticalNav from '@/components/NavBar.vue';
import TableUsers from '@/components/Table.vue'

const showModal = ref(false);
const selectedUser = ref(null);
const users = ref([])
const activeUsers = computed(() => users.value.filter(user => user.isActive))

const openModal = () => {
  selectedUser.value = null;
  showModal.value = true;
};

const closeModal = () => {
  selectedUser.value = null;
  showModal.value = false;
};

const handleEditUser = (user) => {
  selectedUser.value = { ...user };
  showModal.value = true;
};

const handleDeleteUser = async (user) => {
  selectedUser.value = { ...user };
  const userID = selectedUser.value.id
  try {
    const token = localStorage.getItem('token') 
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
    })

    await getUsers()
  } catch (error) {
    console.log("Error eliminando usuario:", error)
  }
};

const getUsers = async () => {
  try {
    const token = localStorage.getItem('token') 
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
    })
    const data = await response.json()
    users.value = data
  } catch (error) {
    console.log("Error obteniendo usuarios de la base de datos:", error)
  }
}

const handleRegisterOrUpdate = async (payload) => {
  const token = localStorage.getItem('token')
  try {
    if (payload.id) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
        body: JSON.stringify(payload),
      })
      console.log('Usuario actualizado')
    } else {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
        body: JSON.stringify(payload),
      })
    }

    getUsers()
    closeModal()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  }
};

onMounted(() => {
  getUsers()
})

</script>

<template>
  <div class="layout">
    <VerticalNav />
    <main>

      <header>
        <h1>Usuarios</h1>
        <button class="add-btn" @click="openModal">
          + Agregar
        </button>
      </header>

      <div class="body-container">
        <TableUsers :items="activeUsers" :columns="[
          { label: 'Nombre', field: 'name' },
          { label: 'Apellido', field: 'lastName' },
          { label: 'Email', field: 'email' },
          { label: 'Teléfono', field: 'phone' }
        ]" @edit="handleEditUser" @delete="handleDeleteUser" />
      </div>

      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ selectedUser ? 'Editar' : 'Agregar' }}</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <UserForm :initialData="selectedUser" @submit="handleRegisterOrUpdate" :updating="selectedUser" />
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

main{
  width: 100%;
  min-height: 100dvh;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: 80px;
  flex: 1;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.body-container {
  display: flex;
  width: 100%;
  height: calc(100dvh-150px);
  justify-content: center;
  align-items: center;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--secondary);
  color: var(--text-on-dark);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: var(--secondary-dark);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--modal-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-input)
}

.modal-header h3 {
  margin: 0 25px;
  font-weight: 500;
  font-size: 1.5rem;
}

.modal-body {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 25px 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--close-btn);
  padding: 0 0.5rem;
}

.close-btn:hover {
  color: var(--close-btn-hover);
}
</style>
