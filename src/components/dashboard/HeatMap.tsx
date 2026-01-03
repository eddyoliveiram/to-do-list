import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { DailyStats } from '@/types'
import { format, parseISO, getDay, startOfWeek, differenceInWeeks } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface HeatMapProps {
  data: DailyStats[]
}

export function HeatMap({ data }: HeatMapProps) {
  const maxCompleted = Math.max(...data.map((d) => d.completed), 1)

  const getIntensity = (completed: number) => {
    if (completed === 0) return 'bg-secondary'
    const intensity = completed / maxCompleted
    if (intensity <= 0.25) return 'bg-primary/25'
    if (intensity <= 0.5) return 'bg-primary/50'
    if (intensity <= 0.75) return 'bg-primary/75'
    return 'bg-primary'
  }

  // Organize em um grid de 7 linhas (dias da semana) x ~53 colunas (semanas)
  // Calcular quantas semanas temos
  const firstDate = data.length > 0 ? parseISO(data[0].date) : new Date()
  const lastDate = data.length > 0 ? parseISO(data[data.length - 1].date) : new Date()
  const numWeeks = Math.ceil(differenceInWeeks(lastDate, firstDate)) + 1

  // Criar matriz: 7 linhas (dias) x numWeeks colunas
  const grid: (DailyStats | null)[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: numWeeks }, () => null)
  )

  // Preencher a matriz
  const baseDate = startOfWeek(firstDate, { weekStartsOn: 0 })
  data.forEach((day) => {
    const date = parseISO(day.date)
    const dayOfWeek = getDay(date) // 0 = domingo, 6 = sábado
    const weekIndex = differenceInWeeks(date, baseDate)

    if (weekIndex >= 0 && weekIndex < numWeeks) {
      grid[dayOfWeek][weekIndex] = day
    }
  })

  // Identificar os meses para mostrar labels
  const monthLabels: { month: string; colIndex: number }[] = []
  let lastMonth = ''

  // Percorrer todas as colunas para encontrar as mudanças de mês
  for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
    // Procurar o primeiro dia não-nulo nesta coluna
    let dayData: DailyStats | null = null
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      if (grid[rowIndex][colIndex]) {
        dayData = grid[rowIndex][colIndex]
        break
      }
    }

    if (dayData) {
      const monthName = format(parseISO(dayData.date), 'MMM', { locale: ptBR })
      if (monthName !== lastMonth) {
        monthLabels.push({ month: monthName, colIndex })
        lastMonth = monthName
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Atividades (365 dias)</CardTitle>
          <CardDescription>
            Visualize sua consistência ao longo do ano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Grid com labels de meses */}
            <div className="flex gap-1 relative justify-center">
              <div className="overflow-x-auto overflow-y-visible pb-2">
                {/* Month labels acima do grid */}
                <div className="flex gap-1 md:gap-[5px] relative h-6 mb-1">
                  {monthLabels.map(({ month, colIndex }) => (
                    <>
                      {/* Mobile: 10px + 4px = 14px (aprox 13px) */}
                      <div
                        key={`${month}-${colIndex}-mobile`}
                        className="text-[10px] text-muted-foreground absolute md:hidden"
                        style={{ left: `${colIndex * 13}px` }}
                      >
                        {month}
                      </div>
                      {/* Desktop: 14px + 5px = 19px */}
                      <div
                        key={`${month}-${colIndex}-desktop`}
                        className="text-xs text-muted-foreground absolute hidden md:block"
                        style={{ left: `${colIndex * 19}px` }}
                      >
                        {month}
                      </div>
                    </>
                  ))}
                </div>

                {/* Grid de quadradinhos */}
                <div className="flex gap-1 md:gap-[5px]">
                  {grid[0].map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-1 md:gap-[5px]">
                      {grid.map((row, rowIndex) => {
                        const day = row[colIndex]
                        if (!day) {
                          return (
                            <div
                              key={rowIndex}
                              className="w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-sm bg-secondary/30"
                            />
                          )
                        }

                        return (
                          <div
                            key={day.date}
                            className="relative group"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: colIndex * 0.001 }}
                              className={`w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-[2px] md:rounded-[3px] ${getIntensity(day.completed)} cursor-pointer hover:ring-2 hover:ring-primary transition-all hover:scale-110`}
                              title={`${format(parseISO(day.date), 'dd/MM/yyyy', { locale: ptBR })}: ${day.completed} tarefa${day.completed !== 1 ? 's' : ''}`}
                            />
                            <div className="fixed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[9999] bg-popover border rounded text-xs whitespace-nowrap px-2 py-1 shadow-lg -translate-y-full -translate-x-1/2 left-1/2 -top-2">
                              <div className="font-semibold">{format(parseISO(day.date), 'dd MMM yyyy', { locale: ptBR })}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {day.completed} concluída{day.completed !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-secondary rounded-sm" />
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/25 rounded-sm" />
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/50 rounded-sm" />
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/75 rounded-sm" />
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-sm" />
              </div>
              <span>Mais</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
