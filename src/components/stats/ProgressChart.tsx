import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TaskStatistics } from '@/types'

interface ProgressChartProps {
  statistics: TaskStatistics
}

export function ProgressChart({ statistics }: ProgressChartProps) {
  const items = [
    {
      label: 'Alta',
      value: statistics.byPriority.high,
      color: '#ef4444', // red-500
      textColor: 'text-red-500',
    },
    {
      label: 'Média',
      value: statistics.byPriority.medium,
      color: '#eab308', // yellow-500
      textColor: 'text-yellow-500',
    },
    {
      label: 'Baixa',
      value: statistics.byPriority.low,
      color: '#3b82f6', // blue-500
      textColor: 'text-blue-500',
    },
  ]

  const total = statistics.total
  const hasData = total > 0

  // Calcular ângulos para o gráfico de pizza
  let currentAngle = 0
  const slices = items.map((item) => {
    const percentage = hasData ? (item.value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    }
  })

  // Função para criar o path do slice do gráfico de pizza
  const createPieSlice = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(100, 100, radius, endAngle)
    const end = polarToCartesian(100, 100, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

    return [
      `M 100 100`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ')
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Tarefas por Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasData ? (
            <>
              {/* Gráfico de Pizza */}
              <div className="flex justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  {slices.map((slice, index) => (
                    slice.value > 0 && (
                      <motion.path
                        key={index}
                        d={createPieSlice(slice.startAngle, slice.endAngle, 90)}
                        fill={slice.color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    )
                  ))}
                  {/* Círculo branco no centro para criar efeito de donut */}
                  <circle cx="100" cy="100" r="50" fill="white" />
                  {/* Texto central com total */}
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-current"
                  >
                    {total}
                  </text>
                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    tarefas
                  </text>
                </svg>
              </div>

              {/* Legenda */}
              <div className="grid grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <span className={`text-lg font-bold ${item.textColor}`}>
                      {item.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {hasData ? ((item.value / total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma tarefa cadastrada ainda
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold text-primary">
                {statistics.completionRate.toFixed(0)}%
              </span>
            </div>
            <Progress value={statistics.completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
