# To-Do List - Gerenciador de Tarefas

Aplicativo web moderno de gerenciamento de tarefas com interface responsiva e otimizada para mobile.

## Características

- **Interface Moderna**: Design clean e intuitivo com componentes shadcn/ui
- **Dashboard Completo**: Visualização avançada de progresso com gráficos interativos
- **Modo Escuro**: Sistema de temas (claro/escuro/sistema)
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Estatísticas Avançadas**: Acompanhe sua produtividade com múltiplas métricas
- **Sistema de Streaks**: Acompanhe sequências de dias produtivos
- **Mapa de Calor**: Visualize 30 dias de atividade em formato de calendário
- **Prioridades**: Organize tarefas por prioridade (baixa/média/alta)
- **Categorias e Tags**: Organize suas tarefas com categorias e tags personalizadas
- **Filtros e Busca**: Encontre rapidamente suas tarefas
- **Animações**: Transições suaves com Framer Motion
- **PWA Ready**: Funciona offline e pode ser instalado como app
- **Persistência Local**: Dados salvos no localStorage

## Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **React Router** - Navegação
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Funcionalidades

### Gerenciamento de Tarefas
- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Adicionar descrições detalhadas
- Definir prioridades (baixa/média/alta)
- Adicionar datas de vencimento
- Organizar por categorias
- Adicionar tags personalizadas

### Filtros e Organização
- Filtrar por status (todas/pendentes/concluídas)
- Ordenar por data, prioridade ou título
- Busca em tempo real
- Limpar tarefas concluídas

### Dashboard e Estatísticas
- **Visão Geral**: Cards com métricas principais
- **Sistema de Streaks**: Acompanhe dias consecutivos de produtividade
- **Gráfico de Atividade**: Últimos 7 dias com tarefas criadas e concluídas
- **Mapa de Calor**: 30 dias de histórico em formato visual
- **Comparação Semanal**: Progresso das últimas 4 semanas
- **Insights de Produtividade**:
  - Dia da semana mais produtivo
  - Horário de pico de produtividade
  - Média diária de tarefas
  - Tendências de conclusão
- **Gráficos por Prioridade**: Visualize distribuição de tarefas
- **Análise por Categoria**: Organize por contexto
- **Mensagens Motivacionais**: Feedback personalizado baseado no progresso

### Configurações
- Alternar entre temas (claro/escuro/sistema)
- Exportar dados em JSON
- Importar backup
- Limpar todos os dados

## Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/       # Componentes do dashboard (gráficos, streaks, insights)
│   ├── layout/          # Header, Navigation, Sidebar
│   ├── stats/           # Componentes de estatísticas
│   ├── tasks/           # Componentes de tarefas
│   └── ui/              # Componentes UI base (shadcn)
├── hooks/               # Custom hooks (useTasks, useProductivity, useTheme)
├── lib/                 # Utilitários
├── pages/               # Páginas (Home, Dashboard, Stats, Settings)
├── styles/              # Estilos globais
└── types/               # Definições TypeScript
```

## Próximos Passos

- [ ] Integração com Supabase para sync na nuvem
- [ ] Notificações push
- [ ] Compartilhamento de tarefas
- [ ] Modo offline completo
- [ ] Temas customizáveis

## Licença

MIT
