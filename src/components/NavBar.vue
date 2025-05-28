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

<script setup>
import { getUserRole } from '@/utils/auth';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { vehicleAlert } = storeToRefs(notificationStore)

const route = useRoute()
const loggedRole = getUserRole()

const sections = [
  { id: 'quotes', icon: 'notifications', description: 'Cotizaciones', auth: ['admin'] },
  { id: 'assignments', icon: 'pin_drop', description: 'Asignaciones', auth: ['admin', 'driver'] },
  { id: 'users', icon: 'people', description: 'Usuarios', auth: ['admin']},
  { id: 'vehicles', icon: 'local_shipping', description: 'Vehículos', auth: ['admin'] },
  { id: 'reports', icon: 'monitoring', description: 'Reportes', auth: ['admin'] },
  { id: 'reviews', icon: 'reviews', description: 'Reseñas', auth: ['admin'] },
  { id: 'forms', icon: 'description', description: 'Formularios', auth: ['admin']}
];

const activeSection = ref(route.path.replace('/', '') || 'quotes')
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

onMounted(() => {
  console.log(loggedRole)
  window.addEventListener('scroll', () => {
    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          activeSection.value = section.id
          break
        }
      }
    }
  })
})
</script>

<style scoped>
  .side-nav {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;

    background-color: var(--sidebar-bg);
    position: fixed;
    height: 100dvh;
    overflow: auto;
    text-align: center;
    z-index: 1000;
  }

  .side-nav li:first-child {
    padding: 20px;
  }

  .side-nav li:first-child img {
    width: 40px;
    height: auto;
  }

  .side-nav li:last-child {
    margin-top: auto;
  }

  li a {
    display: block;
    transition: background-color 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  li a.active {
    background-color: var(--sidebar-active-bg);
  }

  li a:hover:not(.active) {
    background-color: var(--sidebar-hover-bg);
  }

  li span {
    font-size: 32px;
    color: var(--sidebar-icon-color);
    padding: 20px;
  }

  li span.active {
    color: var(--sidebar-active-icon-color);
  }

  li p {
    display: none;
    font-size: 10px;
    color: var(--sidebar-text-color);
    margin: 0 auto;
    padding-bottom: 10px
  }

  li p.active {
    color: var(--sidebar-active-text-color);
  }

  .menu-toggle {
    display: none;
    position: fixed;
    top: 2.2rem;
    left: 1rem;
    font-size: 28px;
    background: none;
    border: none;
    color: var(--black);
    transition: color 0.3s ease;
    z-index: 1001;
  }

  .menu-toggle.open {
    color: var(--white);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }

  .notification-badge {
  position: absolute;
  top: 10px;
  right: 20px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
 }

  @media (max-width: 770px) {
    .menu-toggle {
      display: block;
    }

    .side-nav {
      position: fixed;
      left: -100%;
      top: 0;
      width: 250px;
      transition: left 0.3s ease;
      z-index: 1000;
    }

    .side-nav.open {
      left: 0;
    }

    li a {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 20px;
    }

    li span {
      padding: 10px 0;
    }

    li p {
      display: block;
      padding: 0;
      margin: 0;
      margin-left: 10px;
      font-size: 16px;
    }

    .side-nav li:last-child {
      padding-bottom: 10px;
    }
  }
</style>