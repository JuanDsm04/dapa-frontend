<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUserRole } from '@/utils/auth'
import { useNotificationStore } from '@/stores/notifications'
import { storeToRefs } from 'pinia'

// Tipo para cada sección del menú
type Section = {
  id: string
  icon: string
  description: string
  auth: string[]
}

const route = useRoute()
const loggedRole = getUserRole()

// Computar la sección activa según la ruta
const activeSection = computed(() => {
  const path = route.path.replace('/', '')
  return path || 'quotes'
})

// Store de notificaciones
const notificationStore = useNotificationStore()
const { vehicleAlert } = storeToRefs(notificationStore)

// Definición de secciones
const sections: Section[] = [
  { id: 'quotes', icon: 'notifications', description: 'Cotizaciones', auth: ['admin'] },
  { id: 'assignments', icon: 'pin_drop', description: 'Asignaciones', auth: ['admin'] },
  { id: 'users', icon: 'people', description: 'Usuarios', auth: ['admin']},
  { id: 'vehicles', icon: 'local_shipping', description: 'Vehículos', auth: ['admin'] },
  { id: 'reports', icon: 'monitoring', description: 'Reportes', auth: ['admin'] },
  { id: 'forms', icon: 'description', description: 'Formularios', auth: ['admin'] },
  { id: 'my-assignments', icon: 'pin_drop', description: 'Mis Asignaciones', auth: ['driver'] }
]

// Estado del menú
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div>
    <button
      class="menu-toggle"
      :class="{ open: isMenuOpen }"
      @click="toggleMenu"
    >
      ☰
    </button>

    <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>

    <ul class="side-nav" :class="{ open: isMenuOpen }">

      <li>
        <img src="@/assets/images/logo_2.png" alt="Company Logo" />
      </li>

      <li v-for="section in sections" :key="section.id">
        <router-link
          v-if="section.auth.includes(loggedRole)"
          :to="'/' + section.id"
          class="nav-link"
          :class="{ active: activeSection === section.id }"
          @click="closeMenu()"
        >
          <span
            class="material-symbols-outlined"
            :class="{ active: activeSection === section.id }"
          >
            {{ section.icon }}
            <span v-if="section.id === 'vehicles' && vehicleAlert" class="notification-badge"></span>
          </span>
          <p :class="{ active: activeSection === section.id }">
            {{ section.description }}
          </p>
        </router-link>
      </li>

      <li>
        <router-link to="/profile" class="nav-link" @click="closeMenu()">
          <span class="material-symbols-outlined">account_circle</span>
          <p>Perfil</p>
        </router-link>
      </li>

    </ul>
  </div>
</template>

<style scoped>
/* Contenedor principal de la barra lateral */
.side-nav {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  background-color: var(--neutral-white);
  position: fixed;
  height: 100dvh; /* altura completa de la ventana */
  overflow-y: auto;
  text-align: center;
  width: 5rem; /* 80px */
}

/* Primer elemento (logo o icono principal) */
.side-nav li:first-child {
  margin: 1.25rem auto; /* 20px */
}
.side-nav li:first-child img {
  width: 2.5rem; /* 40px */
}

/* Último elemento al fondo (ej. logout) */
.side-nav li:last-child {
  margin-top: auto;
}

/* Links de la barra lateral */
li a {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s ease;
}

li a.active {
  background-color: var(--principal-primary-600);
}

li a:hover:not(.active) {
  background-color: var(--neutral-gray-100);
}

/* Iconos y badges */
li span {
  color: var(--principal-primary-900);
  margin: 1.25rem 0; /* 20px */
}
li span.active {
  color: var(--neutral-white);
}

/* Texto asociado al icono */
li p {
  display: none;
  color: var(--principal-primary-900);
  margin: 0 auto;
  padding-bottom: 0.625rem; /* 10px */
}
li p.active {
  color: var(--neutral-white);
}

/* Botón de menú para mobile */
.menu-toggle {
  display: none;
  position: absolute;
  top: 1.8rem;
  left: 1rem;
  font-size: 1.75rem; /* 28px */
  background: none;
  border: none;
  color: var(--neutral-gray-900);
  transition: color 0.3s ease;
  z-index: 1001;
}
.menu-toggle.open {
  color: var(--neutral-white);
}

/* Overlay cuando la barra está abierta en móvil */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

/* Badge de notificación */
.notification-badge {
  position: absolute;
  top: 0.625rem; /* 10px */
  right: 1.25rem; /* 20px */
  background-color: var(--principal-error);
  color: var(--neutral-white);
  border-radius: 50%;
  width: 0.625rem; /* 10px */
  height: 0.625rem; /* 10px */
}

/* Responsive: mobile */
@media (max-width: 770px) {
  .menu-toggle {
    display: block;
  }

  .side-nav {
    left: -100%;
    width: 15.625rem; /* 250px */
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .side-nav.open {
    left: 0;
  }

  li a {
    display: flex;
    align-items: center;
    padding-left: 1.25rem; /* 20px */
  }

  li p {
    display: block;
    margin: 0;
    margin-left: 0.625rem; /* 10px */
    font-size: 1rem; /* 16px */
    padding: 0;
  }

  .side-nav li:last-child {
    padding-bottom: 0.625rem; /* 10px */
  }
}
</style>