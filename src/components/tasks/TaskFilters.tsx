import { FilterType, SortType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ListFilter, ArrowUpDown } from 'lucide-react'

interface TaskFiltersProps {
  filter: FilterType
  setFilter: (filter: FilterType) => void
  sortBy: SortType
  setSortBy: (sort: SortType) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
]

const sorts: { value: SortType; label: string }[] = [
  { value: 'date', label: 'Data' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'title', label: 'Título' },
]

export function TaskFilters({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar tarefas..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ListFilter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar</span>
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.value)}
                className="flex-1"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Ordenar</span>
          </div>
          <div className="flex gap-2">
            {sorts.map((s) => (
              <Button
                key={s.value}
                variant={sortBy === s.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(s.value)}
                className="flex-1"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
