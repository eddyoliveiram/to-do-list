# Guia de Uso - To-Do List App

## Começando

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### 2. Build para Produção

```bash
npm run build
npm run preview
```

## Funcionalidades Principais

### Gerenciamento de Tarefas

**Criar uma Nova Tarefa**
1. Clique no botão "Nova Tarefa" na página inicial
2. Preencha os campos:
   - **Título** (obrigatório)
   - **Descrição** (opcional)
   - **Prioridade**: Baixa, Média ou Alta
   - **Data de Vencimento** (opcional)
   - **Categoria** (ex: Trabalho, Pessoal)
   - **Tags** (separadas por vírgula)
3. Clique em "Adicionar Tarefa"

**Editar uma Tarefa**
- Clique no ícone de lápis na tarefa
- Modifique os campos desejados
- Clique em "Salvar Alterações"

**Marcar como Concluída**
- Clique no círculo à esquerda da tarefa

**Excluir uma Tarefa**
- Clique no ícone da lixeira

**Limpar Tarefas Concluídas**
- Role até o fim da lista
- Clique em "Limpar X tarefas concluídas"

### Filtros e Busca

**Filtrar Tarefas**
- **Todas**: Mostra todas as tarefas
- **Pendentes**: Apenas tarefas não concluídas
- **Concluídas**: Apenas tarefas finalizadas

**Ordenar Tarefas**
- **Data**: Mais recentes primeiro
- **Prioridade**: Alta → Média → Baixa
- **Título**: Ordem alfabética

**Buscar Tarefas**
- Digite no campo de busca
- Busca em: título, descrição, categoria e tags

### Estatísticas

Acesse a página de Estatísticas para visualizar:

**Cards de Métricas**
- Total de tarefas criadas
- Tarefas concluídas (taxa de conclusão)
- Tarefas pendentes
- Concluídas hoje
- Concluídas esta semana
- Tempo médio de conclusão

**Gráficos**
- Distribuição por prioridade
- Tarefas por categoria
- Progresso geral

### Configurações

**Temas**
- **Claro**: Fundo claro
- **Escuro**: Fundo escuro
- **Sistema**: Segue as preferências do sistema

**Gerenciamento de Dados**

**Exportar Dados**
1. Vá em Configurações
2. Clique em "Exportar"
3. Um arquivo JSON será baixado com backup completo

**Importar Dados**
1. Vá em Configurações
2. Clique em "Importar"
3. Selecione um arquivo JSON de backup
4. A página será recarregada com os dados importados

**Limpar Todos os Dados**
1. Vá em Configurações
2. Clique em "Limpar Todos os Dados"
3. Confirme a ação (irreversível)

## Otimização Mobile

### Navegação Mobile
- Barra de navegação inferior no mobile
- Menu hambúrguer no canto superior esquerdo
- Gestos nativos funcionam normalmente

### PWA (Progressive Web App)

**Instalar como App**

**Android (Chrome)**
1. Abra o site no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

**iOS (Safari)**
1. Abra o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme

**Desktop (Chrome/Edge)**
1. Clique no ícone de instalação na barra de endereços
2. Clique em "Instalar"

### Funcionalidades PWA
- Funciona offline (após primeira visita)
- Ícone na tela inicial
- Tela cheia (sem barra de navegação do navegador)
- Notificações (futuro)

## Dicas de Uso

### Organização Eficiente

**Use Prioridades**
- **Alta**: Urgente e importante
- **Média**: Importante mas não urgente
- **Baixa**: Pode esperar

**Use Categorias**
- Separe tarefas por contexto (Trabalho, Casa, Compras, etc)
- Visualize quantas tarefas tem em cada categoria nas estatísticas

**Use Tags**
- Para filtros mais específicos
- Ex: #urgente, #reunião, #email, #código

**Defina Datas de Vencimento**
- Priorize tarefas com prazos
- Visualize o que precisa ser feito primeiro

### Produtividade

**Revise as Estatísticas**
- Veja quantas tarefas completa por dia/semana
- Identifique padrões de produtividade
- Ajuste sua carga de trabalho

**Limpe Regularmente**
- Remova tarefas concluídas antigas
- Mantenha apenas o necessário visível

**Backup Regular**
- Exporte seus dados periodicamente
- Guarde os arquivos JSON em local seguro

## Atalhos e Dicas

- A busca funciona em tempo real
- Múltiplos filtros podem ser combinados com busca
- Toque longo em mobile para ações rápidas (navegadores suportados)
- O tema é salvo automaticamente
- Todos os dados são salvos localmente no navegador

## Resolução de Problemas

**Dados não aparecem após importação**
- Verifique se o arquivo JSON está no formato correto
- Recarregue a página manualmente

**App não funciona offline**
- Acesse o site pelo menos uma vez com internet
- Limpe o cache e tente novamente

**Tema não muda**
- Verifique se o navegador suporta modo escuro
- Tente usar modo "Sistema" ou "Claro"/"Escuro" manualmente

## Próximas Features (Planejadas)

- [ ] Integração com Supabase
- [ ] Sincronização entre dispositivos
- [ ] Notificações de tarefas próximas ao vencimento
- [ ] Compartilhamento de listas
- [ ] Modo colaborativo
- [ ] Relatórios avançados
- [ ] Exportar para PDF/CSV
- [ ] Temas personalizados
- [ ] Widgets para tela inicial
- [ ] Integração com calendário

## Suporte

Para reportar bugs ou sugerir funcionalidades:
- Abra uma issue no repositório do projeto
- Entre em contato com o desenvolvedor

---

**Versão**: 1.0.0
**Última atualização**: Janeiro 2026
