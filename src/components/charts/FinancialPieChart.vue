<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  series: number[]
  labels: string[]
  title: string
  height?: number
  width?: number
}>(), {
  height: 400,
  width: 400
})

const computedOptions = computed(() => ({
  chart: {
    id: 'pie-chart',
    type: 'pie',
    animations: {
      enabled: true,
      speed: 300,
      animateGradually: {
        enabled: true,
        delay: 200
      },
      dynamicAnimation: {
        enabled: true,
        speed: 400
      }
    }
  },
  title: {
    text: props.title,
    align: 'center',
    offsetY: 12,
    style: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  },
  labels: props.labels,
  legend: {
    show: true,
    position: 'bottom'
  },
  theme: {
    mode: 'light',
    palette: 'palette3',
  }
}))
</script>

<template>
  <div class="chart-container">
    <apexchart
      type="pie"
      :options="computedOptions"
      :series="series"
      :height="props.height"
      :width="props.width"
    />
  </div>
</template>

<style scoped>
.chart-container {
  width: fit-content;
  padding: 2rem;
  background-color: #fff;
  border-radius: 1rem;
}
</style>
