import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProductivityMetrics } from '@/types'
import { Calendar, Clock, Target, Sparkles } from 'lucide-react'

interface ProductivityInsightsProps {
  metrics: ProductivityMetrics
}

export function ProductivityInsights({ metrics }: ProductivityInsightsProps) {
  const insights = [
    {
      icon: Calendar,
      label: 'Dia mais produtivo',
      value: metrics.mostProductiveDay,
      color: 'text-blue-500',
    },
    {
      icon: Clock,
      label: 'Horário de pico',
      value: `${metrics.mostProductiveHour}:00`,
      color: 'text-purple-500',
    },
    {
      icon: Target,
      label: 'Média diária',
      value: `${metrics.averageTasksPerDay.toFixed(1)} tarefas`,
      color: 'text-green-500',
    },
    {
      icon: Sparkles,
      label: 'Total concluídas',
      value: metrics.totalTasksCompleted,
      color: 'text-orange-500',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Insights de Produtividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-background ${insight.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {insight.label}
                    </p>
                    <p className="font-semibold text-lg truncate">
                      {insight.value}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <TrendingIcon trend={metrics.completionTrend} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">
                  {getTrendTitle(metrics.completionTrend)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getTrendDescription(metrics.completionTrend)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TrendingIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }
  if (trend === 'down') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  )
}

function getTrendTitle(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') return 'Tendência Positiva! 📈'
  if (trend === 'down') return 'Produtividade em Queda 📉'
  return 'Produtividade Estável'
}

function getTrendDescription(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') {
    return 'Você está completando mais tarefas esta semana em comparação com a semana passada. Continue assim!'
  }
  if (trend === 'down') {
    return 'Sua produtividade caiu um pouco. Que tal revisar suas prioridades e estabelecer metas menores?'
  }
  return 'Sua produtividade está consistente. Mantenha o ritmo!'
}
