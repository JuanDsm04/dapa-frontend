<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  series: Array<any>
  categories: string[]
  title: string
  height?: number
  width?: number
}>(), {
  height: 400,
  width: 600
})

const computedOptions = computed(() => ({
  chart: {
    id: 'bar-chart',
    type: 'bar',
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
  xaxis: { categories: props.categories },
  theme: {
    mode: 'light',
    palette: 'palette1',
  },
  legend: {
    show: true
  },
  responsive: [
    {
      breakpoint: 770,
      options: {
        chart: {
          toolbar: {
            show: false
          },
          width: '100%',
          height: 'auto',
        },
        legend: {
          show: false
        }
      }
    }
  ]

}))
</script>

<template>
  <div class="chart-container">
    <apexchart type="bar" :options="computedOptions" :series="series" :height="props.height" :width="props.width" />
  </div>
</template>

<style scoped>
.chart-container {
  width: fit-content;
  padding: 2rem;
  background-color: #ffff;
  border-radius: 1rem;
}

@media (max-width: 770px) {
  .chart-container {
    width: 100%;
    padding: 1.5rem;
  }
}
</style>
