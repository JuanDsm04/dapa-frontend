<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import UserForm from '@/components/UserForm.vue';
import TableUsers from '@/components/Table.vue'
import type { HighlightConfig } from '@/types/table';
import type { User } from '@/types/user';

const showModal = ref(false);
const users = ref<User[]>([])
const selectedUser = ref<User | undefined>(undefined);
const loading = ref(false);
const activeUsers = computed(() => users.value.filter(user => user.isActive))

// Identificador del registro según la fecha de vencimiento de su licencia
const highlightUser = (item: any): HighlightConfig | undefined => {
  if (item.role !== 'driver' || !item.licenseExpirationDate) return undefined;

  const expiration = new Date(item.licenseExpirationDate);
  const now = new Date();

  const diffInMs = expiration.getTime() - now.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return { borderColor: '#CC2D44', backgroundColor: '#FFF4F4' };

  } else if (diffInDays <= 7) {
    return { borderColor: '#FFB601', backgroundColor: '#FFFEEE' };
  }

  return undefined;
};

// Abrir y cerrar el modal 
const openModal = () => {
  selectedUser.value = undefined;
  showModal.value = true;
};

const closeModal = () => {
  selectedUser.value = undefined;
  showModal.value = false;
};

// Preparar a un usuario para editarlo
const handleEditUser = (user: User) => {
  selectedUser.value = { ...user };
  showModal.value = true;
};

// Eliminar a un usuario después de su confirmación y actualizar la lista
const handleDeleteUser = async (user: User) => {

  if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`)) {
    return;
  }

  selectedUser.value = { ...user };
  const userID = selectedUser.value.id
  loading.value = true;

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

  } finally {
    loading.value = false;
  }
};

// Obtener los usuarios desde la API
const getUsers = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    users.value = data;

    // Verificar licencias vencidas (solo para 'driver')
    const hoy = new Date();
    const vencidos = users.value.filter((u: User) => {
      if (u.role !== 'driver' || !u.licenseExpirationDate) return false;
      const fechaLicencia = new Date(u.licenseExpirationDate);
      return fechaLicencia < hoy;
    });

    if (vencidos.length > 0) {
      toast.warning(`Advertencia: Hay ${vencidos.length} usuario(s) con la licencia vencida`, {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }

  } catch (error) {
    console.log("Error obteniendo usuarios de la base de datos:", error);
    toast.error('Error al cargar usuarios');
  } finally {
    loading.value = false;
  }
};

// Manejar el registro o actualización de un usuario según si tiene id o no
const handleRegisterOrUpdate = async (payload: Partial<User>) => {
  const token = localStorage.getItem('token')
  loading.value = true;

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
    const err = error as Error;
    console.error('Error al guardar usuario:', err)
    toast.error(`Error: ${err.message}`)

  } finally {
    loading.value = false;
  }
}

// Cargar la lista de usuarios al montar el componente
onMounted(() => {
  getUsers()
})

</script>

<template>
  <main>
    <header>
      <h1>Usuarios</h1>
      <button class="add-btn" @click="openModal" :disabled="loading">
        {{ loading ? 'Cargando...' : '+ Agregar' }}
      </button>
    </header>

    <section>
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
      
      <TableUsers
        :items="activeUsers"
        :columns="[
          { label: 'Nombre', field: 'name' },
          { label: 'Apellido', field: 'lastName' },
          { label: 'Email', field: 'email' },
          { label: 'Teléfono', field: 'phone' },
          {
            label: 'Rol',
            field: 'role',
            formatter: (value: string) => {
              if (value === 'admin') return 'Administrador'
              if (value === 'driver') return 'Piloto'
              return value
            }
          },
          {
            label: 'Vencimiento de licencia',
            field: 'licenseExpirationDate',
            formatter: (value, row) => {
              if (row.role !== 'driver') return 'No Aplica'
              if (!value) return 'Sin fecha'

              const date = new Date(value)
              date.setDate(date.getDate() + 1)
              
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()

              return `${day}/${month}/${year}`
            }
          }
        ]"
        :highlightFn="highlightUser"
        @edit="handleEditUser"
        @delete="handleDeleteUser"
      />

    </section>
  </main>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article>
      <header>
        <h3>{{ selectedUser ? 'Editar Usuario' : 'Agregar Usuario' }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <section>
        <UserForm 
          :initialData="selectedUser" 
          @submit="handleRegisterOrUpdate" 
          :updating="!!selectedUser"
          :loading="loading"
        />
      </section>
    </article>
  </div>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
}

main header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0;
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

.add-btn:hover:not(:disabled) {
  background-color: var(--add-btn-hover);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--add-btn);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
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

@media (max-width: 770px) {
  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }
  
  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-content {
    text-align: center;
  }

  h1 {
    margin-left: 50px;
  }
}
</style>