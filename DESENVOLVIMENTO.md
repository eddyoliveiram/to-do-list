# Guia de Desenvolvimento

## Estrutura do Projeto

```
to-do-list/
├── public/              # Arquivos estáticos
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # Service Worker
│   └── vite.svg         # Ícone
├── src/
│   ├── components/      # Componentes React
│   │   ├── layout/      # Header, Navigation, Sidebar
│   │   ├── stats/       # Componentes de estatísticas
│   │   ├── tasks/       # Componentes de tarefas
│   │   └── ui/          # Componentes UI base (shadcn)
│   ├── hooks/           # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useTasks.ts
│   │   └── useTheme.ts
│   ├── lib/             # Utilitários
│   │   └── utils.ts
│   ├── pages/           # Páginas principais
│   │   ├── Home.tsx     # Lista de tarefas
│   │   ├── Stats.tsx    # Estatísticas
│   │   └── Settings.tsx # Configurações
│   ├── styles/          # Estilos globais
│   │   └── globals.css
│   ├── types/           # Definições TypeScript
│   │   └── index.ts
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Arquitetura

### Gerenciamento de Estado

O app usa **hooks personalizados** para gerenciar estado:

**`useTasks`**
- Gerencia todas as operações de tarefas
- Persiste dados no localStorage
- Calcula estatísticas em tempo real
- Implementa filtros e ordenação

**`useLocalStorage`**
- Sincroniza estado com localStorage
- Trata erros de serialização
- Escuta mudanças entre abas

**`useTheme`**
- Gerencia tema claro/escuro/sistema
- Aplica classes CSS dinamicamente
- Persiste preferência do usuário

### Persistência de Dados

Atualmente usa **localStorage**:

```typescript
// Chave de armazenamento
const TASKS_STORAGE_KEY = 'tasks'

// Estrutura de dados
interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  category?: string
  tags?: string[]
}
```

### Integração Futura com Supabase

#### Passo 1: Instalar Supabase

```bash
npm install @supabase/supabase-js
```

#### Passo 2: Criar Cliente Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Passo 3: Schema do Banco de Dados

```sql
-- Criar tabela de usuários (se não usar Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Criar tabela de tarefas
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  completed boolean default false,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  category text,
  tags text[],
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar Row Level Security
alter table tasks enable row level security;

-- Política de acesso (usuário só vê suas tarefas)
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Índices para performance
create index tasks_user_id_idx on tasks(user_id);
create index tasks_created_at_idx on tasks(created_at desc);
create index tasks_completed_idx on tasks(completed);
```

#### Passo 4: Criar Hook `useSupabaseTasks`

```typescript
// src/hooks/useSupabaseTasks.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types'

export function useSupabaseTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar tarefas
  useEffect(() => {
    loadTasks()

    // Escutar mudanças em tempo real
    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          handleRealtimeChange(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  async function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()

    if (error) {
      console.error('Error adding task:', error)
      throw error
    }
    return data[0]
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refresh: loadTasks
  }
}
```

#### Passo 5: Adicionar Autenticação

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

#### Passo 6: Estratégia de Migração

**Opção 1: Migração Automática**
```typescript
// Migrar dados do localStorage para Supabase
async function migrateLocalToSupabase() {
  const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]')

  for (const task of localTasks) {
    await supabase.from('tasks').insert({
      ...task,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
  }

  // Limpar localStorage após migração bem-sucedida
  localStorage.removeItem('tasks')
}
```

**Opção 2: Modo Híbrido (Offline-First)**
```typescript
// Usar localStorage como cache local
// Sincronizar com Supabase quando online
export function useHybridTasks() {
  const localTasks = useLocalStorage('tasks', [])
  const { tasks: remoteTasks, loading } = useSupabaseTasks()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Sincronizar quando ficar online
  useEffect(() => {
    if (isOnline && !loading) {
      syncTasks()
    }
  }, [isOnline, loading])

  async function syncTasks() {
    // Implementar lógica de merge
    // localStorage é source of truth offline
    // Supabase é source of truth online
  }

  return isOnline ? remoteTasks : localTasks
}
```

## Componentes Customizáveis

### Adicionar Novo Campo às Tarefas

1. Atualizar tipo em `src/types/index.ts`:
```typescript
export interface Task {
  // ... campos existentes
  customField?: string  // Adicionar novo campo
}
```

2. Atualizar formulário em `src/components/tasks/TaskForm.tsx`

3. Atualizar visualização em `src/components/tasks/TaskItem.tsx`

4. Se usar Supabase, adicionar coluna na tabela

### Adicionar Nova Estatística

1. Calcular em `src/hooks/useTasks.ts` no `statistics` memo

2. Criar card em `src/pages/Stats.tsx`

3. Usar componente `StatsCard`

## Performance

### Otimizações Implementadas

- `useMemo` para cálculos pesados (filtros, estatísticas)
- `useCallback` para funções em props
- Lazy loading de rotas (pode ser adicionado)
- Code splitting automático do Vite
- Tree shaking no build

### Monitoramento

Adicionar React DevTools Profiler:
```tsx
import { Profiler } from 'react'

<Profiler id="TaskList" onRender={callback}>
  <TaskList />
</Profiler>
```

## Testes (Para Implementar)

### Instalar dependências

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Exemplo de teste

```typescript
// src/hooks/__tests__/useTasks.test.ts
import { renderHook, act } from '@testing-library/react'
import { useTasks } from '../useTasks'

describe('useTasks', () => {
  it('should add a task', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.addTask('Test Task', 'Description', 'high')
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Test Task')
  })
})
```

## Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório GitHub diretamente na dashboard da Vercel.

### Netlify

```bash
npm run build
# Fazer upload da pasta dist/
```

### Variáveis de Ambiente

Criar `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Melhorias Futuras

- [ ] Implementar testes unitários e E2E
- [ ] Adicionar Storybook para componentes
- [ ] Implementar i18n (internacionalização)
- [ ] Adicionar analytics
- [ ] Melhorar SEO com meta tags dinâmicas
- [ ] Adicionar tour guiado para novos usuários
- [ ] Implementar undo/redo
- [ ] Drag and drop para reordenar tarefas
- [ ] Modo de visualização kanban
- [ ] Exportar para diferentes formatos (PDF, CSV, etc)

## Recursos Úteis

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
