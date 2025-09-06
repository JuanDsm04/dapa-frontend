<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  orderStatus?: 'pickup' | 'collected' | 'delivered' | string
}>()

// Íconos
const stepIcons: string[] = ['local_shipping', 'delivery_truck_speed', 'hand_package']

// Mapear el status
const getCurrentStep = computed<number>(() => {
  switch (props.orderStatus) {
    case 'pickup':
      return 1
    case 'collected':
      return 2
    case 'delivered':
      return 3
    default:
      return 1
  }
})
</script>

<template>
  <nav class="steps">
    <div class="step" :class="{ active: getCurrentStep >= 1 }">
      <span class="material-symbols-outlined icon">{{ stepIcons[0] }}</span>
      <p>1</p>
    </div>

    <div class="line" :class="{ active: getCurrentStep >= 2 }"></div>

    <div class="step" :class="{ active: getCurrentStep >= 2 }">
      <span class="material-symbols-outlined icon">{{ stepIcons[1] }}</span>
      <p>2</p>
    </div>

    <div class="line" :class="{ active: getCurrentStep >= 3 }"></div>

    <div class="step" :class="{ active: getCurrentStep >= 3 }">
      <span class="material-symbols-outlined icon">{{ stepIcons[2] }}</span>
      <p>3</p>
    </div>
  </nav>
</template>

<style scoped>
.steps-info {
  font-size: clamp(0.8rem, 1.6vw, 0.9rem);
  color: #444;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
  min-width: 40px;
}

.step.active {
  color: #2f67f6;
}

.step .icon {
  background-color: #ccc;
  border-radius: 50%;
  padding: 0.8rem;
  color: white;
  font-size: clamp(1.3rem, 2.5vw, 1.5rem);
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.step.active .icon {
  background-color: #2f67f6;
}

.line {
  height: 4px;
  background-color: #ccc;
  flex: 1;
  margin: -25px 8px 0 8px;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.line.active {
  background-color: #2f67f6;
}
</style>