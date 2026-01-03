import { motion } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import { StatsCard } from '@/components/stats/StatsCard'
import { ProgressChart } from '@/components/stats/ProgressChart'
import { CategoryChart } from '@/components/stats/CategoryChart'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  Calendar,
  Zap,
} from 'lucide-react'

export function Stats() {
  const { statistics } = useTasks()

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${Math.round(minutes)}min`
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}min`
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold mb-2">Estatísticas</h2>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e produtividade
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total de Tarefas"
          value={statistics.total}
          icon={ListTodo}
          description="Tarefas criadas"
          delay={0}
        />
        <StatsCard
          title="Concluídas"
          value={statistics.completed}
          icon={CheckCircle2}
          description={`${statistics.completionRate.toFixed(0)}% de conclusão`}
          delay={0.1}
        />
        <StatsCard
          title="Pendentes"
          value={statistics.pending}
          icon={Clock}
          description="Aguardando conclusão"
          delay={0.2}
        />
        <StatsCard
          title="Hoje"
          value={statistics.completedToday}
          icon={Zap}
          description="Concluídas hoje"
          delay={0.3}
        />
        <StatsCard
          title="Esta Semana"
          value={statistics.completedThisWeek}
          icon={Calendar}
          description="Concluídas nos últimos 7 dias"
          delay={0.4}
        />
        <StatsCard
          title="Tempo Médio"
          value={formatTime(statistics.averageCompletionTime)}
          icon={TrendingUp}
          description="Para conclusão"
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart statistics={statistics} />
        <CategoryChart statistics={statistics} />
      </div>
    </div>
  )
}
