<script setup>
defineProps({
  icon: String,
  title: String,
  image: String,
  onClick: Function
})
</script>

<template>
  <button class="big-btn" @click="onClick">
    <img v-if="image" :src="image" alt="" class="btn-img" />
    <span class="material-symbols-outlined btn-icon">{{ icon }}</span>
    <div class="btn-title">{{ title }}</div>
  </button>
</template>

<style scoped>
.big-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 300px;
  margin: 20px;
  border-radius: 20px;
  border: none;
  background: #f4f4f4;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
}
.big-btn:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.btn-img {
  width: 250px;
  height: 250px;
  object-fit: contain;
  margin-bottom: 20px;
}
.btn-icon {
  font-size: 48px;
  color: #3F74BD;
  margin-bottom: 10px;
}
.btn-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-top: auto;
  margin-bottom: 10px;
}
</style>
