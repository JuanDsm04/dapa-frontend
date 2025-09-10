<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import UserForm from '@/components/UserForm.vue';
import TableUsers from '@/components/Table.vue';
import NotificationModal from '@/components/NotificationModal.vue';

import type { HighlightConfig } from '@/types/table';
import type { User } from '@/types/user';

import { 
  getUsers as fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '@/services/userService';

// Estado
const showModal = ref(false);
const users = ref<User[]>([]);
const selectedUser = ref<User | undefined>();
const loading = ref(false);

const activeUsers = computed<User[]>(() => 
  users.value.filter(user => user.isActive)
);

// Función para resaltar filas según fecha de licencia
const highlightUser = (item: User): HighlightConfig | undefined => {
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

// Modals
const openModal = () => {
  selectedUser.value = undefined;
  showModal.value = true;
};

const closeModal = () => {
  selectedUser.value = undefined;
  showModal.value = false;
};

const handleEditUser = (user: User) => {
  selectedUser.value = { ...user };
  showModal.value = true;
};

// Modal de confirmación
const showConfirmModal = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmAction = ref<(() => Promise<void>) | null>(null);

// Eliminar usuario
const handleDeleteUser = (user: User) => {
  confirmTitle.value = '¿Eliminar usuario?';
  confirmMessage.value = `¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`;

  confirmAction.value = async () => {
    if (!user.id) return;
    loading.value = true;

    try {
      await deleteUser(user.id);
      await loadUsers();
      toast.warning('Usuario eliminado exitosamente');
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      toast.error('Error eliminando usuario');
    } finally {
      loading.value = false;
    }
  };

  showConfirmModal.value = true;
};

// Obtener usuarios
const loadUsers = async () => {
  loading.value = true;
  try {
    const data: User[] = await fetchUsers();
    users.value = data;

    // Detectar licencias vencidas
    const hoy = new Date();
    const vencidos = users.value.filter((u) => {
      if (u.role !== 'driver' || !u.licenseExpirationDate) return false;
      return new Date(u.licenseExpirationDate) < hoy;
    });

    if (vencidos.length > 0) {
      toast.warning(`Advertencia: Hay ${vencidos.length} usuario(s) con la licencia vencida`, {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    toast.error("Error al obtener los usuarios");
  }finally{
    loading.value = false;
  }
};

// Crear o actualizar usuarios
const handleCreationOrUpdate = async (payload: Partial<User>) => {
  loading.value = true;
  try {
    if (payload.id) {
      await updateUser(payload.id, payload);
      toast.info('Usuario actualizado exitosamente');
    } else {
      await createUser(payload);
      toast.success('Usuario registrado exitosamente');
    }

    await loadUsers();
    closeModal();
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al guardar usuario:', error.message);
      toast.error(`Error: ${error.message}`);
    } else {
      toast.error('Error: No se pudo guardar el usuario');
    }
  }finally{
    loading.value = false;
  }
};

// Montar el componente
onMounted(async () => {
  await loadUsers();
});
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

  <!-- Modal de registro/edición -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <article>
      <header>
        <h3>{{ selectedUser ? 'Editar Usuario' : 'Agregar Usuario' }}</h3>
        <button class="close-btn" @click="closeModal">
          <span class="material-symbols-outlined md-icon">close</span>
        </button>
      </header>

      <section>
        <UserForm 
          :initialData="selectedUser" 
          @submit="handleCreationOrUpdate" 
          :updating="!!selectedUser"
          :loading="loading"
        />
      </section>
    </article>
  </div>

  <!-- Modal de confirmación -->
  <NotificationModal
    v-if="showConfirmModal"
    :show="showConfirmModal"
    :title="confirmTitle"
    :message="confirmMessage"
    confirmText="Confirmar"
    cancelText="Cancelar"
    @close="showConfirmModal = false"
    @confirm="() => { 
      if (confirmAction) confirmAction()
      showConfirmModal = false
    }"
  />
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
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
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
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
  background-color: var(--principal-primary);
  color: var(--neutral-white);
  border: none;
  border-radius: 6px;
  font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  background-color: var(--principal-primary-hover);
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
  background-color: var(--neutral-gray-50);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid var(--border-light);
  border-top: 0.25rem solid var(--principal-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--shadow-dark);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

article {
  background: var(--neutral-white);
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px var(--shadow-dark);
  display: flex;
  flex-direction: column;
}

article header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-base);
}

article header h3 {
  font-size: clamp(1.1rem, 1vw + 0.5rem, 1.5rem);
  font-weight: 500;
  margin: 0;
}

article section {
  padding: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--neutral-gray-400);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--neutral-gray-600);
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
    margin-left: 0;
    text-align: center;
  }
}
</style>
