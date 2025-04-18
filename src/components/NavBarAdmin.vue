<template>
  <ul class="side-nav">
    <li class="logo">
      <img src="@/assets/images/logo_2.png" class="logo-img" alt="Company Logo" />
    </li>

    <li v-for="section in sections" :key="section.id">
      <a
        :href="'#' + section.id"
        :class="{ active: activeSection === section.id }"
        @click.prevent="handleClick(section.id)"
      >
        <img :src="section.icon" class="icon" :alt="section.id" />
      </a>
    </li>
  </ul>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const sections = [
  { id: 'notifications', icon: new URL('@/assets/images/icon-notifications.png', import.meta.url).href },
  { id: 'user',          icon: new URL('@/assets/images/icon-id.png', import.meta.url).href },
  { id: 'team',          icon: new URL('@/assets/images/icon-people.png', import.meta.url).href },
  { id: 'delivery',      icon: new URL('@/assets/images/icon-truck.png', import.meta.url).href },
  { id: 'to-do',         icon: new URL('@/assets/images/icon-checklist.png', import.meta.url).href },
  { id: 'review',        icon: new URL('@/assets/images/icon-review.png', import.meta.url).href }
]

const activeSection = ref('notifications')

function handleClick(id) {
  activeSection.value = id
}

onMounted(() => {
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
  margin: 0;
  padding: 0;
  width: 80px;
  background-color: var(--sidebar-bg);
  position: fixed;
  height: 100%;
  overflow: auto;
  text-align: center;
}

.logo {
  padding: 20px 0;
}

.logo-img {
  width: 40px;
  height: auto;
}

.side-nav li a {
  display: block;
  padding: 20px 0;
  transition: background-color 0.3s ease;
}

.side-nav li a.active {
  background-color: var(--sidebar-active-bg);
}

.side-nav li a:hover:not(.active) {
  background-color: var(--sidebar-hover-bg);
}

.icon {
  height: var(--sidebar-icon-size);
  width: auto;
}
</style>
