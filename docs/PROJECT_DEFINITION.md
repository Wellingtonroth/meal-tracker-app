# Definições Do Projeto – Meal Tracker

## 1. Identificação da Feature

- Nome do Produto: Meal Tracker
- Tipo: PWA (Progressive Web App)
- Público-alvo: Nutricionistas e pacientes
- Plataformas: Web (PWA), app Android e iOS

## 2. Visão Geral do Projeto

O Meal Tracker é uma aplicação focada no acompanhamento de refeições e aderência a planos alimentares.
O grande diferencial do produto é a geração de um relatório de aderência, que consolida o quanto o paciente seguiu o plano prescrito pelo nutricionista em determinado período.

## 3. Problema a Ser Resolvido

Hoje, nutricionistas enfrentam dificuldades como:

- Falta de dados objetivos sobre a aderência do paciente
- Relatos manuais e subjetivos
- Uso de múltiplas ferramentas desconectadas (WhatsApp, planilhas, PDFs)

Pacientes enfrentam dificuldades como:

- Esquecem de registrar refeições
- Não têm clareza se estão seguindo corretamente o plano
- Não conseguem visualizar seu próprio progresso

## 4. Objetivo do Projeto

Criar uma solução simples e objetiva para:

- Registrar refeições diárias
- Acompanhar aderência ao plano alimentar
- Gerar um relatório de aderência exportável
- Facilitar a comunicação nutricionista ↔ paciente

## 5. Diferencial Competitivo

O principal diferencial do Meal Tracker é o Relatório de Aderência, que:

- Mostra percentualmente o cumprimento do plano
- Pode ser exportado (PDF)
- Pode ser enviado diretamente ao nutricionista ou paciente
- Serve como base objetiva para ajustes no plano alimentar

## 6. Funcionalidades Principais (MVP)

### 6.1 Autenticação

- Cadastro via e-mail
- Login (email e senha ou Google)
- Logout
- Recuperação de senha

### 6.2 Perfis de Usuário

- Paciente
- Nutricionista

Regras iniciais:

- Um paciente pode estar vinculado a um nutricionista
- Um nutricionista pode acompanhar vários pacientes

### 6.3 Plano Alimentar

- Criação de plano alimentar pelo nutricionista
- Definição de refeições por período (café, almoço, jantar, lanches)
- Definição de alimentos esperados por refeição

### 6.4 Registro de Refeições (Paciente)

- Marcar refeição como realizada
- Registrar substituições
- Registrar observações opcionais

### 6.5 Acompanhamento Diário

- Visualização diária do plano x realizado
- Indicadores simples (feito / parcialmente feito / não feito)

### 6.6 Relatório de Aderência (Core Feature)

- Cálculo automático da aderência
- Período configurável (semanal, quinzenal, mensal)

Métricas:

- % de refeições realizadas
- % de refeições parcialmente realizadas
- % de refeições não realizadas
- Exportação em PDF
- Compartilhamento do relatório

## 7. Regras de Negócio

- Nutricionistas podem visualizar, criar e editar planos de alimentação
- Pacientes podem registrar refeições e criar e editar planos caso não tenham uma nutricionista vinculada
- Alterações no plano não afetam relatórios já gerados
- Relatórios são imutáveis após exportação
- Um paciente pode estar vinculado a apenas um nutricionista por vez
- Planos alimentares são específicos por paciente
- Um nutricionista pode acompanhar vários pacientes
- Um paciente pode estar vinculado a um nutricionista por vez

## 8. Arquitetura Geral (Alto Nível)

- Frontend: PWA (Progressive Web App) e apps nativos (Android e iOS)
- Framework: Vue 3 / Nuxt 3
- Linguagem: TypeScript
- State Management: Pinia
- Estilização: SCSS (Sass)
- Internacionalização: i18n (pt-BR, en-US)
- Backend: Node.js (Nuxt Server API)
- API própria
- Comunicação com banco exclusivamente via API
- Banco de Dados: Supabase
- Nenhuma chamada direta do frontend para o Supabase
- Autenticação via Firebase Auth
- PWA: Service Workers, cache offline, instalação
- Loja Android: Google Play
- Loja iOS: App Store (v2)

## 9. Estrutura de Rotas (Frontend)

- / → Página inicial / Landing
- /login → Login
- /register → Cadastro
- /paywall → Planos de assinatura
- /app → Redirecionamento para /app/home
- /app/home → Dashboard (protegida)
- /app/meals → Registro de refeições
- /app/reports → Relatórios de aderência
- /app/settings → Configurações
- /app/plans → Planos de alimentação

## 10. Modelo de Negócio / Monetização (Revisar)

- Modelo: Assinatura mensal
- Planos disponíveis:
  - Plano Básico: R$ 9,90/mês
    - Recursos básicos
    - Suporte por email
  - Plano Premium: R$ 19,90/mês
    - Todos os recursos
    - Suporte prioritário
    - Relatórios avançados
- Versão MVP: Funcionalidades básicas disponíveis (modelo de monetização pode ser implementado posteriormente)

## 11. Internacionalização (i18n)

- Idiomas suportados:
  - Português (Brasil) - pt-BR (padrão)
  - Inglês (Estados Unidos) - en-US
- Estratégia: Prefixo de idioma na URL (exceto padrão)
- Detecção automática do idioma do navegador
- Persistência da preferência via cookie

## 12. Funcionalidades PWA

- Instalação como app nativo
- Service Workers para cache offline
- Funcionalidade offline básica
- Atualização automática
- Ícones adaptáveis (maskable icons)
- Manifest configurado para standalone

## 13. Estrutura de Dados (Entidades Principais)

- Usuário (User)
  - uid (Firebase Auth)
  - email
  - displayName
  - role (paciente/nutricionista)
  - nutricionistaId (se paciente vinculado)
- Plano Alimentar (MealPlan)
  - id
  - userId (paciente)
  - nutricionistaId (se criado por nutricionista)
  - refeições por período
  - alimentos esperados por refeição
- Registro de Refeição (MealRecord)
  - id
  - userId (paciente)
  - data
  - refeição
  - status (realizada/parcial/não realizada)
  - substituições
  - observações
- Relatório de Aderência (AdherenceReport)
  - id
  - userId (paciente)
  - período (início/fim)
  - métricas calculadas
  - data de geração
  - imutável após exportação

## 14. Requisitos Não Funcionais

- Performance:
  - Carregamento inicial < 3s
  - Navegação fluida entre páginas
  - Cache inteligente de recursos estáticos
- Segurança:
  - Autenticação via Firebase Auth
  - Tokens em cookies httpOnly
  - HTTPS obrigatório em produção
  - Validação de dados no backend
- Acessibilidade:
  - Suporte a leitores de tela
  - Navegação por teclado
  - Contraste adequado (WCAG)
- Compatibilidade:
  - Navegadores modernos (Chrome, Firefox, Safari, Edge)
  - Dispositivos móveis (iOS, Android)
  - Responsive design

## 15. Limitações Conhecidas do MVP

- Não inclui:
  - Upload de fotos de refeições
  - Notificações push
  - Chat em tempo real
  - Dashboard analítico avançado
  - Integração com wearables
  - Contagem de macros detalhada
  - Múltiplos planos simultâneos por paciente
  - Funcionalidades offline limitadas (cache básico)

## 16. Métricas de Sucesso (v2.0)

- Taxa de registro diário de refeições
- Quantidade de relatórios gerados
- Retenção semanal de usuários
- Uso recorrente por nutricionistas

## 17. Visão de Evolução (v?.?)

- Notificações inteligentes
- Upload opcional de foto da refeição
- Comparação de períodos
- Dashboard analítico para nutricionistas
- App nativo (Android/iOS)
- IA para sugestões alimentares
- Contagem avançada de macros
- Integração com smartwatches
- Chat em tempo real
