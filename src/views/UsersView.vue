<script setup>
import { ref } from 'vue';
import RegisterForm from '@/components/RegisterForm.vue';
import VerticalNav from '@/components/NavBarAdmin.vue';

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

</script>

<template>
  <div class="layout">
    <VerticalNav />
    <main class="users-view">
      <div class="header-container">
        <h1>Usuarios</h1>
        <button class="add-user-btn" @click="openModal">
          + Agregar Usuario
        </button>
      </div>
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Agregar usuarios</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <RegisterForm />
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

.users-view {
  width: 100%;
  min-height: 100dvh;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: 80px; 
  flex: 1;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-user-btn {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: #369f6b;
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
  background: white;
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
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
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
  color: #666;
  padding: 0 0.5rem;
}

.close-btn:hover {
  color: #333;
}
</style>