<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  title: string
  value: number
  goal: number
  readonly?: boolean
}>(), {
  readonly: false
})

const emit = defineEmits(['update:goal'])

const isEditingGoal = ref(false);
const editableGoal = ref(props.goal);

const goalComparison = computed(() => {
  if (props.goal === 0 && props.value === 0) return 0;
  if (props.goal === 0) return 0;
  return Math.abs(props.goal - props.value) / props.goal * 100;
});

watch(() => props.goal, (newGoal) => {
  editableGoal.value = newGoal;
});

const saveGoal = () => {
  emit('update:goal', editableGoal.value);
  isEditingGoal.value = false;
};
</script>

<template>
  <div class="card">
    <header>
      <span class="title">{{ props.title }}</span>
      <div class="edit-goal-controls" v-if="!readonly">
        <button
          v-if="!isEditingGoal"
          @click="isEditingGoal = true"
          class="edit-button"
        >
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button
          v-else
          @click="saveGoal"
          class="save-button"
        >
          <span class="material-symbols-outlined">save</span>
        </button>
      </div>
    </header>
    <span class="value">{{ props.value }}</span>
    <div class="metrics">
      <div class="metric">
        <span>
          Objetivo: 
          <span v-if="!isEditingGoal">{{ props.goal }}</span>
          <input
            class="goal-input"
            v-else
            type="number"
            v-model.number="editableGoal"
            @keyup.enter="saveGoal"
          />
        </span>
        <div>
          <span
            :class="(props.value - props.goal) > 0
              ? 'trend-up'
              : (props.value - props.goal) < 0
                ? 'trend-down'
                : 'trend-neutral'"
          >
            {{ goalComparison.toFixed(2) }}%
          </span>
          <span v-if="(props.value - props.goal) > 0">▲</span>
          <span v-else-if="(props.value - props.goal) < 0">▼</span>
          <span v-else>||</span>
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
  position: relative;
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
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.edit-goal-controls {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.edit-button,
.save-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--principal-primary-300);
}

.edit-button:hover,
.save-button:hover {
  color: var(--principal-primary-300);
}

.edit-button .material-symbols-outlined,
.save-button .material-symbols-outlined {
  font-size: 1.8rem;
}

.goal-input {
  width: 80px;
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

  @media (max-width: 770px) {
    .edit-goal-controls {
      top: 1.25rem;
      right: 1.25rem;
    }
  }
}
</style>
