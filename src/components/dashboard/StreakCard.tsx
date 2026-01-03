import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Flame, Trophy, TrendingUp } from 'lucide-react'
import { ProductivityMetrics } from '@/types'

interface StreakCardProps {
  metrics: ProductivityMetrics
}

export function StreakCard({ metrics }: StreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Sequências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-3">
                <div className="text-4xl font-bold text-primary">
                  {metrics.currentStreak}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Dias consecutivos
              </p>
              {metrics.currentStreak > 0 && (
                <p className="text-xs text-primary font-medium mt-1">
                  Continue assim! 🔥
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{metrics.longestStreak}</div>
                <p className="text-xs text-muted-foreground">Recorde</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <TrendingUp className={`w-5 h-5 mx-auto mb-2 ${
                  metrics.completionTrend === 'up' ? 'text-green-500' :
                  metrics.completionTrend === 'down' ? 'text-red-500' :
                  'text-muted-foreground'
                }`} />
                <div className="text-2xl font-bold capitalize">
                  {metrics.completionTrend === 'up' ? '↑' :
                   metrics.completionTrend === 'down' ? '↓' : '→'}
                </div>
                <p className="text-xs text-muted-foreground">Tendência</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
