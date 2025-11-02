<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  series: Array<any> | undefined
  labels: string[] | undefined
  title: string
  height?: number
  width?: number
}>(), {
  height: 400,
  width: 600
})

const computedOptions = computed(() => ({
  chart: {
    id: 'pie-chart',
    type: 'pie',
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
  responsive: [
    {
      breakpoint: 770,
      options: {
        chart: {
          width: '100%',
          height: 'auto',
        },
        toolbar: {
          show: false
        },
        legend: {
          show: false,
        }
      }
    }
  ]
}))

const hasData = computed(() => {
  return Array.isArray(props.series) &&
         props.series.length > 0 &&
         Array.isArray(props.labels) &&
         props.labels.length > 0
})
</script>

<template>
  <div v-if="hasData">
    <div class="chart-container" id="pie-chart">
      <apexchart type="pie" :options="computedOptions" :series="series" :height="props.height" :width="props.width" />
    </div>
  </div>
  <div v-else>
    <div class="chart-container no-data" id="pie-chart">
      <h3>{{props.title}}</h3>
      <p>No hay datos suficientes</p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: fit-content;
  padding: 2rem;
  background-color: var(--neutral-white);
  border-radius: 1rem;
}

.no-data {
  min-height: 464px;
  min-width: 664px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.no-data h3 {
  font-weight: bold;
  font-size: 1.5rem;
}

@media (max-width: 770px) {
  .chart-container {
    width: 100%;
    padding: 1.5rem;
  }
}
</style>
