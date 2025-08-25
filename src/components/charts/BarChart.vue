<script setup lang="ts">
import { computed } from 'vue';

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
      speed: 200,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
    toolbar: {
      show: true
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
  xaxis: {
    categories: props.categories,
  },
  plotOptions: {
    bar: {
      horizontal: false, // 👈 Verticales
      columnWidth: '60%',
      borderRadius: 6
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '0.9rem',
    }
  },
  legend: {
    show: true
  },
  theme: {
    mode: 'light',
    palette: 'palette2',
  }
}))
</script>

<template>
  <div class="chart-container">
    <apexchart
      type="bar"
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
