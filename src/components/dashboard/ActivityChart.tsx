import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DailyStats } from '@/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ActivityChartProps {
  data: DailyStats[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const last7Days = data.slice(-7)

  // Calculate max value from both completed and created across all days
  const maxValue = Math.max(
    ...last7Days.map((d) => Math.max(d.completed, d.created)),
    1 // Minimum value of 1 to avoid division by zero
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3 h-48 px-2">
              {last7Days.map((day, index) => {
                const dayName = format(parseISO(day.date), 'EEE', { locale: ptBR })

                // Calculate heights as percentage of max value
                const completedPercent = (day.completed / maxValue) * 100
                const createdPercent = (day.created / maxValue) * 100

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                      {/* Barra de Concluídas */}
                      <div className="flex-1 flex flex-col justify-end h-full">
                        {day.completed > 0 ? (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${completedPercent}%` }}
                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                            className="w-full bg-primary rounded-t-md relative group"
                            style={{ minHeight: '4px' }}
                            title={`${day.completed} concluída${day.completed !== 1 ? 's' : ''}`}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background px-1.5 py-0.5 rounded shadow-sm border">
                              {day.completed}
                            </span>
                          </motion.div>
                        ) : (
                          <div className="w-full h-0" />
                        )}
                      </div>
                      {/* Barra de Criadas */}
                      <div className="flex-1 flex flex-col justify-end h-full">
                        {day.created > 0 ? (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${createdPercent}%` }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                            className="w-full bg-secondary border-2 border-primary/30 rounded-t-md relative group"
                            style={{ minHeight: '4px' }}
                            title={`${day.created} criada${day.created !== 1 ? 's' : ''}`}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background px-1.5 py-0.5 rounded shadow-sm border">
                              {day.created}
                            </span>
                          </motion.div>
                        ) : (
                          <div className="w-full h-0" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize font-medium">
                      {dayName}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-sm" />
                <span className="text-sm text-muted-foreground">Concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary border-2 border-primary/30 rounded-sm" />
                <span className="text-sm text-muted-foreground">Criadas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
