<script setup lang="ts">

const props = defineProps<{
  title: string
  icon: any
  value: number
  lastMonth: number
  goal: number
}>()

const lastMonthComparasion = props.value - props.lastMonth
const lastMonthPercent = Math.abs(lastMonthComparasion) / props.lastMonth * 100
const goalComparasion =  Math.abs(props.goal - props.value) / props.goal * 100

</script>

<template>
  <div class="card">
    <header>
        <span class="title">{{props.title}}</span>
      <component v-if="props.icon" :is="props.icon" class="icon" />
    </header>
    <span class="value">{{props.value}}</span>
    <div class="metrics">
      <div class="metric">
        <span>Mes pasado: {{props.lastMonth}}</span>
        <div>
          <span :class="lastMonthComparasion > 0 ? 'trend-up' : lastMonthComparasion < 0 ? 'trend-down' : 'trend-neutral'">{{lastMonthComparasion}} | {{lastMonthPercent.toFixed(2)}}%</span>
          <span v-if="lastMonthComparasion > 0"> ▲</span>
          <span v-else-if="lastMonthComparasion < 0"> ▼</span>
          <span v-else> ||</span>
        </div>
      </div>
      <div class="metric">
        <span>Objetivo: {{props.goal}}</span>
        <div>
          <span :class="(props.value - props.goal) > 0 ? 'trend-up' : (props.value - props.goal) < 0 ? 'trend-down' : 'trend-neutral'">{{goalComparasion.toFixed(2)}}%</span>
          <span v-if="(props.value - props.goal) > 0"> ▲</span>
          <span v-else-if="(props.value - props.goal) < 0"> ▼</span>
          <span v-else> ||</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: fit-content;
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
  border-radius: 8px;
  flex-direction: column;
  background-color: white;
}

header {
  display: flex;
  justify-content: space-between;
}

.title {
  color: grey;
}

.icon {
  color: skyblue;
  width: 24px;
  height: 24px;
}

.value {
  align-self: center;
  font-size: 3rem;
  font-weight: 500;
}

.trend-down {
  color: darkred;
}

.trend-up {
  color: darkgreen;
}

.trend-neutral {
  color: black;
}

.metrics {
  display: flex;
  justify-content: space-between;
}

.metric {
  display: flex;
  flex-direction: column;
}

</style>
