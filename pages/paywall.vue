<template>
  <div class="paywall-page">
    <h1>Paywall</h1>
    <p>Escolha seu plano e comece a usar o Meal Tracker!</p>
    <div class="plans">
      <div class="plan-card">
        <h2>Plano Básico</h2>
        <p class="price">R$ 9,90/mês</p>
        <ul>
          <li>Recursos básicos</li>
          <li>Suporte por email</li>
        </ul>
        <button class="btn">Escolher Plano</button>
      </div>
      <div class="plan-card featured">
        <h2>Plano Premium</h2>
        <p class="price">R$ 19,90/mês</p>
        <ul>
          <li>Todos os recursos</li>
          <li>Suporte prioritário</li>
          <li>Relatórios avançados</li>
        </ul>
        <button class="btn">Escolher Plano</button>
      </div>
    </div>
    <NuxtLink to="/login" class="back-link" target="_blank">Já tem conta? Entrar</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty',
});
</script>

<style scoped lang="scss">
.paywall-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--color-background);
  color: var(--color-text);

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
    text-align: center;
  }

  > p {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    color: var(--color-text-muted);
    text-align: center;
  }

  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 800px;
    width: 100%;
    margin-bottom: 2rem;
  }

  .plan-card {
    background: var(--color-surface-elevated);
    border: 1px solid var(--color-divider);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-soft);
    }

    &.featured {
      border: 2px solid var(--color-primary);
      background: var(--color-ghost);
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--color-text);
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 1.5rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
      text-align: left;

      li {
        padding: 0.5rem 0;
        color: var(--color-text-muted);

        &::before {
          content: '✓ ';
          color: var(--color-success);
          font-weight: bold;
          margin-right: 0.5rem;
        }
      }
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      background: var(--color-primary);
      color: var(--color-on-primary);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .back-link {
    color: var(--color-primary);
    text-decoration: none;
    margin-top: 2rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
