<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import UserForm from '@/components/UserForm.vue';
import VerticalNav from '@/components/NavBar.vue';
import TableUsers, { type HighlightConfig } from '@/components/Table.vue'

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

const highlightUser = (item: any): HighlightConfig | undefined => {
  const expiration = new Date(item.licenseExpirationDate)
  const now = new Date()

  const diffInMs = expiration.getTime() - now.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  if (diffInDays <= 7) {
    return { borderColor: '#CC2D44', backgroundColor: '#FFF4F4' }
  } else if (diffInDays <= 30) {
    return { borderColor: '#FFB601', backgroundColor: '#FFFEEE' }
  }

  return undefined
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
    toast.warning('Usuario eliminado')
  } catch (error) {
    console.log("Error eliminando usuario:", error)
    toast.error('Error eliminando usuario')
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
    let response
    let data

    if (payload.id) {
      response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      data = await response.json()

      if (!response.ok) {
        throw new Error(data.Message || 'Error al actualizar el usuario')
      }

      toast.info('Usuario modificado exitosamente')
    } else {
      response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      data = await response.json()

      if (!response.ok) {
        throw new Error(data.Message || 'Error al registrar el usuario')
      }

      toast.success('Usuario agregado exitosamente')
    }

    getUsers()
    closeModal()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    toast.error(`Error: ${error.message}`)
  }
}

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
        <button class="add-btn" @click="openModal">+ Agregar</button>
      </header>

      <section>
        <TableUsers
          :items="activeUsers"
          :columns="[
            { label: 'Nombre', field: 'name' },
            { label: 'Apellido', field: 'lastName' },
            { label: 'Email', field: 'email' },
            { label: 'Teléfono', field: 'phone' }
          ]"
          :highlightFn="highlightUser"
          @edit="handleEditUser"
          @delete="handleDeleteUser"
        />
      </section>
    </main>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article>
      <header>
        <h3>{{ selectedUser ? 'Editar' : 'Agregar' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <section>
        <UserForm :initialData="selectedUser" @submit="handleRegisterOrUpdate" :updating="!!selectedUser" />
      </section>
    </article>
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
    padding: 2rem;
    margin-left: 80px;
    box-sizing: border-box;
    background-color: var(--main-bg);
  }

  main header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  header h1 {
    font-weight: 600;
  }

  main section {
    width: 100%;
    min-height: calc(100vh - 150px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .add-btn {
    padding: 0.75rem 1.5rem;
    background-color: var(--add-btn);
    color: var(--text-on-add-btn);
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .add-btn:hover {
    background-color: var(--add-btn-hover);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  article {
    background: var(--modal-bg);
    border-radius: 10px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }

  article header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-input);
  }

  article header h3 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
  }

  article section {
    padding: 1.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--close-btn);
    cursor: pointer;
  }

  .close-btn:hover {
    color: var(--close-btn-hover);
  }

</style>
