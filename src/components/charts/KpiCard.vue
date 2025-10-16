<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number
  lastMonth: number
  goal: number
}>()

const lastMonthComparasion = props.value - props.lastMonth
const lastMonthPercent = Math.abs(lastMonthComparasion) / props.lastMonth * 100
const goalComparasion = Math.abs(props.goal - props.value) / props.goal * 100

</script>

<template>
  <div class="card">
    <header>
      <span class="title">{{ props.title }}</span>
    </header>
    <span class="value">{{ props.value }}</span>
    <div class="metrics">
      <div class="metric">
        <span>Mes pasado: {{ props.lastMonth }}</span>
        <div>
          <span :class="lastMonthComparasion > 0 ? 'trend-up' : lastMonthComparasion < 0 ? 'trend-down' : 'trend-neutral'">
            {{ lastMonthComparasion }} | {{ lastMonthPercent.toFixed(2) }}%
          </span>
          <span v-if="lastMonthComparasion > 0"> ▲</span>
          <span v-else-if="lastMonthComparasion < 0"> ▼</span>
          <span v-else> ||</span>
        </div>
      </div>
      <div class="metric">
        <span>Objetivo: {{ props.goal }}</span>
        <div>
          <span :class="(props.value - props.goal) > 0 ? 'trend-up' : (props.value - props.goal) < 0 ? 'trend-down' : 'trend-neutral'">
            {{ goalComparasion.toFixed(2) }}%
          </span>
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
  background-color: var(--neutral-white);
}

header {
  display: flex;
  justify-content: space-between;
}

.title {
  color: var(--neutral-gray-600);
}

.icon {
  color: var(--principal-primary-200);
  width: 24px;
  height: 24px;
}

.value {
  align-self: center;
  font-size: 3rem;
  font-weight: 500;
}

.trend-down {
  color: var(--principal-error-700);
}

.trend-up {
  color: var(--principal-secondary-700);
}

.trend-neutral {
  color: var(--neutral-black);
}

.metrics {
  display: flex;
  justify-content: space-between;
}

.metric {
  display: flex;
  flex-direction: column;
}

@media (max-width: 770px) {
  .card {
    width: 100%;
    background-color: var(--neutral-white);
    border-radius: 10px;
    padding: 1.25rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    transition: all 0.3s ease;
    display: block;
  }

  .card:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  .card > header,
  .card > .value,
  .card > .metrics {
    display: inline-block;
    vertical-align: top;
  }

  .card > header {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  .card > .value {
    width: 48%;
    margin-right: 4%;
  }

  .card > .metrics {
    width: 48%;
    border-left: 1.5px solid var(--neutral-gray-200);
    padding-left: 1.25rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .title {
    color: var(--neutral-gray-600);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.3;
  }

  .icon {
    color: var(--principal-primary);
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .value {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--neutral-black);
    line-height: 1;
    align-self: flex-start;
  }

  .metrics {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: center;
  }

  .metric {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .metric > span:first-child {
    font-size: 0.75rem;
    color: var(--neutral-gray-600);
    font-weight: 500;
  }

  .metric > div {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .metric > div > span:last-child {
    font-size: 0.7rem;
  }

  .trend-down {
    color: var(--principal-error-600);
  }

  .trend-up {
    color: var(--principal-secondary-500);
  }

  .trend-neutral {
    color: var(--neutral-gray-700);
  }
}
</style>
