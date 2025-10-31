<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'

const reportCards = ref([
  {
    id: 'control',
    title: 'Control financiero',
    description: 'Administra y visualiza el control de ingresos y egresos en tiempo real.',
    icon: 'account_balance_wallet',
    color: 'primary',
    route: '/reports/financial_control'
  },
  {
    id: 'report',
    title: 'Reporte financiero',
    description: 'Consulta reportes detallados sobre el estado financiero del negocio.',
    icon: 'assessment',
    color: 'secondary',
    route: '/reports/financial'
  },
  {
    id: 'performance',
    title: 'Reporte de desempeño',
    description: 'Analiza el desempeño y resultados de actividades y servicios.',
    icon: 'analytics',
    color: 'tertiary',
    route: '/reports/performance'
  },
  {
    id: 'history',
    title: 'Historial de servicios',
    description: 'Consulta el historial de servicios completados.',
    icon: 'history',
    color: 'error',
    route: '/reports/service-history'
  }
])

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <main>
    <header>
      <h1 class="text-title">Reportes y análisis</h1>
      <p class="subtitle">Gestiona y consulta información financiera y de desempeño</p>
    </header>

    <section class="reports-grid">
      <article 
        v-for="card in reportCards" 
        :key="card.id"
        class="report-card"
        :class="`card-${card.color}`"
        @click="navigateTo(card.route)"
      >
        <div class="card-icon">
          <span class="material-symbols-outlined">{{ card.icon }}</span>
        </div>
        
        <div class="card-content">
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
        </div>

        <div class="card-action">
          <span class="material-symbols-outlined">arrow_forward</span>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  background-color: var(--bg-general);
  min-height: 100vh;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2rem);
}

.subtitle {
  color: var(--neutral-gray-600);
  font-size: clamp(0.95rem, 2vw, 1rem);
  margin: 0;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
}

.report-card {
  background-color: var(--neutral-white);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  position: relative;
  overflow: hidden;
}

.report-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--principal-primary-400);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.report-card.card-secondary::before {
  background: var(--principal-secondary-400)
}

.report-card.card-tertiary::before {
  background: var(--principal-extra-500);
}

.report-card.card-error::before {
  background: var(--principal-error-400);
}

.report-card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--principal-primary-50);
  transition: all 0.3s ease;
}

.card-secondary .card-icon {
  background: var(--principal-secondary-50);
}

.card-tertiary .card-icon {
  background: var(--principal-extra-50);
}

.card-error .card-icon {
  background: var(--principal-error-50);
}

.card-icon .material-symbols-outlined {
  font-size: 2rem;
  color: var(--principal-primary);
}

.card-secondary .card-icon .material-symbols-outlined {
  color: var(--principal-secondary-400);
}

.card-tertiary .card-icon .material-symbols-outlined {
  color: var(--principal-extra-500);
}

.card-error .card-icon .material-symbols-outlined {
  color: var(--principal-error-400);
}

.report-card:hover .card-icon {
  transform: scale(1.1);
}

.card-content {
  flex: 1;
}

.card-content h2 {
  font-size: clamp(1.15rem, 2.5vw, 1.3rem);
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--neutral-black);
}

.card-content p {
  font-size: clamp(0.9rem, 2vw, 0.95rem);
  color: var(--neutral-gray-600);
  margin: 0;
  line-height: 1.5;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
}

.card-action .material-symbols-outlined {
  font-size: 1.5rem;
  color: var(--principal-primary-400);
  transition: transform 0.3s ease;
}

.card-secondary .card-action .material-symbols-outlined {
  color: var(--principal-secondary-400);
}

.card-tertiary .card-action .material-symbols-outlined {
  color: var(--principal-extra-500);
}

.card-error .card-action .material-symbols-outlined {
  color: var(--principal-error-400);
}

.report-card:hover .card-action .material-symbols-outlined {
  transform: translateX(4px);
}

@media (min-width: 771px) and (max-width: 1200px) {
  .reports-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 770px) {
  main {
    margin-left: 0;
    padding: 2rem 1rem;
  }

  main header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-content {
    text-align: center;
  }

  h1 {
    margin-left: 0;
    text-align: center;
  }

  .subtitle {
    text-align: center;
  }

  .reports-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .report-card {
    padding: 1.5rem;
  }

  .card-icon {
    width: 56px;
    height: 56px;
  }

  .card-icon .material-symbols-outlined {
    font-size: 1.75rem;
  }
}
</style>