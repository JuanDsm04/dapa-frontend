<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  series: Array<any>
  labels: string[]
  title: string
  height?: number
  width?: number
}>(), {
  height: 400,
  width: 600
})

const computedOptions = computed(() => ({
  chart: {
    id: 'donut-chart',
    type: 'donut',
    animations: {
      enabled: true,
      speed: 100,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
  },
  title: {
    text: props.title,
    align: 'center',
    offsetX: 0,
    offsetY: 12,
    style: {
      fontSize:  '1.25rem',
      fontWeight:  'bold',
    },
  },
  labels: props.labels,
  theme: {
    mode: 'light',
    palette: 'palette1',
  },
  legend: {
    show: true
  },
}))
</script>

<template>
  <div class="chart-container">
    <apexchart type="donut" :options="computedOptions" :series="series" :height="props.height" :width="props.width" />
  </div>
</template>

<style scoped>
.chart-container {
  width: fit-content;
  padding: 2rem;
  background-color: #ffff;
  border-radius: 1rem;
}
</style>
