<script setup>
defineProps({
  icon: String,
  title: String,
  image: String,
  description: String,
  onClick: Function
})
</script>

<template>
  <button class="big-btn" @click="onClick">
    <template v-if="image">
      <img :src="image" alt="" class="btn-img" />
      <div class="btn-content">
        <div class="btn-title">{{ title }}</div>
        <div v-if="description" class="btn-description">{{ description }}</div>
      </div>
      <span class="btn-arrow">&gt;</span>
    </template>
    <template v-else>
      <span class="material-symbols-outlined btn-icon">{{ icon }}</span>
      <div class="btn-title">{{ title }}</div>
      <span class="btn-arrow">&gt;</span>
    </template>
  </button>
</template>

<style scoped>
.big-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 750px;
  height: 120px;
  margin: 5px;
  border-radius: 20px;
  border: none;
  background: #f4f4f4;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  padding: 0 10px;
}
.big-btn:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.btn-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-right: 32px;
}
.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
}
.btn-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.btn-description {
  font-size: 1rem;
  color: #666;
}
.btn-icon {
  font-size: 48px;
  color: #3F74BD;
  margin-right: 16px;
}
.btn-arrow {
  margin-left: auto;
  font-size: 2rem;
  color: #888;
  font-weight: bold;
  padding-left: 24px;
}
</style>
