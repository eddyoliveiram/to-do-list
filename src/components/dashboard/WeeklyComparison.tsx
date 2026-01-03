import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface WeeklyComparisonProps {
  data: Array<{
    week: string
    completed: number
    created: number
  }>
}

export function WeeklyComparison({ data }: WeeklyComparisonProps) {
  const maxCompleted = Math.max(...data.map(w => w.completed), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Progresso Semanal</CardTitle>
          <CardDescription>
            Últimas 4 semanas de atividade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((week, index) => {
              const percentage = (week.completed / maxCompleted) * 100
              const weekLabel = format(parseISO(week.week), 'dd MMM', { locale: ptBR })
              const isCurrentWeek = index === data.length - 1

              return (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Semana de {weekLabel}
                      </span>
                      {isCurrentWeek && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Atual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {week.completed}/{week.created}
                      </span>
                      <span className="font-semibold text-primary">
                        {week.created > 0 ? Math.round((week.completed / week.created) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </motion.div>
              )
            })}
          </div>

          {data.length > 1 && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Crescimento vs semana anterior
                </span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const current = data[data.length - 1]?.completed || 0
                    const previous = data[data.length - 2]?.completed || 0
                    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0

                    return (
                      <>
                        <span className={`text-sm font-semibold ${
                          growth > 0 ? 'text-green-500' :
                          growth < 0 ? 'text-red-500' :
                          'text-muted-foreground'
                        }`}>
                          {growth > 0 ? '+' : ''}{growth.toFixed(0)}%
                        </span>
                        {growth !== 0 && (
                          <span className="text-xs">
                            {growth > 0 ? '↑' : '↓'}
                          </span>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
