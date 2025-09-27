<template>
  <div>
    <header class="header">
      <h1>Configurações</h1>
      <p>Configure visual, idioma e preferências do aplicativo.</p>
    </header>

    <section class="section">
      <div class="container">
        <h2>Idioma</h2>
        <div class="wrapper">
          <h3>Idioma</h3>
          <p>Idioma do aplicativo.</p>
          <div class="button-languages" @click="onClickOpenLanguages">
            {{ language?.name || 'Selecionar idioma' }}
          </div>
          <div v-if="showLanguageOptions" class="languages-list">
            <ul>
              <li v-for="lang in languages" :key="lang.value" @click="onClickSelectLanguage(lang)">
                {{ lang.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container">
        <h2>Notificações</h2>
        <div class="wrapper">
          <h3>Lembrete de refeição</h3>
          <p>Lembrete nos horários das refeições.</p>
          <label>
            <input v-model="mealReminder" type="checkbox">
            {{ mealReminder ? 'Sim' : 'Não' }}
          </label>
        </div>

        <div class="wrapper">
          <h3>Relatório semanal</h3>
          <p>Envio de relatório semanal de progresso.</p>
          <label>
            <input v-model="weeklyReport" type="checkbox">
            {{ weeklyReport ? 'Sim' : 'Não' }}
          </label>
        </div>

        <div class="wrapper">
          <h3>Alerta de sequência</h3>
          <p>Avisos de sequência de dias cumpridos.</p>
          <label>
            <input v-model="streakAlert" type="checkbox">
            {{ streakAlert ? 'Sim' : 'Não' }}
          </label>
        </div>
      </div>

      <div class="container">
        <h2>Conta</h2>
        <div class="wrapper">
          <h3>Nome e Email</h3>
          <p>Informações básicas da sua conta.</p>
          <div class="form-grid">
            <label for="name">Nome</label>
            <input id="name" v-model="name" type="text" placeholder="Seu nome">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="seu@email.com">

            <div class="btn-row">
              <button class="btn btn--primary" @click="onSaveAccount">Salvar alterações</button>
            </div>
          </div>
        </div>

        <div>
          <h3>Segurança</h3>
          <div class="wrapper btn-row">
            <button class="btn btn--ghost" @click="onChangePassword">Trocar Senha</button>
            <button class="btn btn--danger" @click="onLogout">Deslogar</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')

const showLanguageOptions = ref(false)
const language = ref()
const languages = ref([
  {
    name: 'Português',
    value: 'Portuguese',
  },
  {
    name: 'Inglês',
    value: 'English',
  },
  {
    name: 'Espanhol',
    value: 'Spanish',
  },
])

const mealReminder = ref(true)
const weeklyReport = ref(false)
const streakAlert = ref(true)

function onClickOpenLanguages() {
  showLanguageOptions.value = !showLanguageOptions.value
}

function onClickSelectLanguage(selectedLanguage: object) {
  language.value = selectedLanguage
  showLanguageOptions.value = false
}

function onSaveAccount() {
  console.warn('Salvar alterações:', { name: name.value, email: email.value })
}

function onChangePassword() {
  console.warn('Trocar senha acionado')
}

function onLogout() {
  console.warn('Deslogar acionado')
}
</script>

<style scoped lang="scss">
.header {
  color: var(--color-text);
}

.container {
  margin-top: 26px;
  color: var(--color-text);

  .wrapper {
    margin: 18px 0;

    .button-languages {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-divider);
      border-radius: 10px;
      box-shadow: var(--shadow-soft);
      cursor: pointer;
      user-select: none;
      transition:
        transform 0.06s ease,
        background 0.2s ease,
        border-color 0.2s ease;

      &:hover {
        background: var(--color-ghost);
      }
      &:active {
        transform: translateY(1px);
      }
      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }

    .languages-list {
      position: absolute;
      margin-top: 8px;
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-divider);
      border-radius: 12px;
      box-shadow: var(--shadow-soft);
      padding: 6px;
      z-index: 10;
      min-width: 220px;

      ul {
        list-style: none;
        margin: 0;
        padding: 4px;
        li {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition:
            background 0.15s ease,
            color 0.15s ease;

          &:hover {
            background: var(--color-ghost);
          }
          &:active {
            background: var(--color-ghost-strong);
          }
        }
      }
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  input {
    background: var(--color-surface-elevated);
    color: var(--color-text);
    border: 1px solid var(--color-divider);
    border-radius: 10px;
    padding: 10px 12px;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-ghost);
    }
  }
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  --btn-bg: var(--color-surface-elevated);
  --btn-fg: var(--color-text);
  --btn-border: var(--color-divider);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 14px;
  min-height: 40px;
  border-radius: 12px;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-fg);
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  user-select: none;

  box-shadow: var(--shadow-soft);
  transition:
    transform 0.06s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.1);
  }

  &.btn--primary {
    --btn-bg: var(--color-primary);
    --btn-fg: var(--color-on-primary);
    --btn-border: transparent;

    &:hover {
      filter: brightness(1.05);
    }
    &:active {
      filter: brightness(0.98);
    }
  }

  &.btn--ghost {
    --btn-bg: var(--color-ghost);
    --btn-fg: var(--color-text);
    --btn-border: transparent;

    &:hover {
      background: var(--color-ghost-strong);
    }
  }

  &.btn--danger {
    --btn-bg: transparent;
    --btn-fg: var(--color-error);
    --btn-border: rgba(229, 57, 53, 0.4);

    &:hover {
      background: rgba(229, 57, 53, 0.08);
      border-color: rgba(229, 57, 53, 0.55);
    }

    &:active {
      background: rgba(229, 57, 53, 0.14);
    }
  }

  &.btn--link {
    --btn-bg: transparent;
    --btn-fg: var(--color-primary);
    --btn-border: transparent;
    box-shadow: none;
    padding: 0;
    border-radius: 8px;

    &:hover {
      background: var(--color-ghost);
    }
  }
}
</style>
