import { useMemo } from 'react'
import { Task, DailyStats, ProductivityMetrics } from '@/types'
import {
  startOfDay,
  startOfWeek,
  format,
  differenceInDays,
  eachDayOfInterval,
  subDays,
  getHours,
  isValid,
} from 'date-fns'

export function useProductivity(tasks: Task[]) {
  const dailyStats = useMemo((): DailyStats[] => {
    const now = new Date()
    const currentYear = now.getFullYear()

    // Gerar todos os dias do ano atual (1º jan a 31 dez)
    const yearDays = eachDayOfInterval({
      start: new Date(currentYear, 0, 1), // 1º de janeiro do ano atual
      end: new Date(currentYear, 11, 31), // 31 de dezembro do ano atual
    })

    return yearDays.map((day) => {
      const dayStart = startOfDay(day)
      const dayEnd = startOfDay(new Date(day.getTime() + 24 * 60 * 60 * 1000))

      // Conta tarefas com vencimento neste dia
      const created = tasks.filter((t) => {
        if (!t.dueDate) return false
        const dueDate = new Date(t.dueDate)
        return isValid(dueDate) && dueDate >= dayStart && dueDate < dayEnd
      }).length

      // Conta tarefas concluídas neste dia
      const completed = tasks.filter((t) => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        return completedDate >= dayStart && completedDate < dayEnd
      }).length

      return {
        date: format(day, 'yyyy-MM-dd'),
        completed,
        created,
        total: tasks.filter((t) => {
          if (!t.dueDate) return false
          return new Date(t.dueDate) <= dayEnd
        }).length,
      }
    })
  }, [tasks])

  const weeklyStats = useMemo(() => {
    const weeks: Record<string, { completed: number; created: number }> = {}
    const now = new Date()
    const fourWeeksAgo = subDays(now, 28)

    tasks.forEach((task) => {
      // Conta por data de vencimento
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate)
        if (isValid(dueDate) && dueDate >= fourWeeksAgo) {
          const weekStart = startOfWeek(dueDate, { weekStartsOn: 1 })
          const weekKey = format(weekStart, 'yyyy-MM-dd')

          if (!weeks[weekKey]) {
            weeks[weekKey] = { completed: 0, created: 0 }
          }
          weeks[weekKey].created++
        }
      }

      // Conta por data de conclusão
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt)
        if (completedDate >= fourWeeksAgo) {
          const weekStart = startOfWeek(completedDate, { weekStartsOn: 1 })
          const weekKey = format(weekStart, 'yyyy-MM-dd')

          if (!weeks[weekKey]) {
            weeks[weekKey] = { completed: 0, created: 0 }
          }
          weeks[weekKey].completed++
        }
      }
    })

    return Object.entries(weeks)
      .map(([week, stats]) => ({
        week,
        ...stats,
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
  }, [tasks])

  const productivityMetrics = useMemo((): ProductivityMetrics => {
    const completedTasks = tasks.filter((t) => t.completed && t.completedAt)

    // Calculate current streak (baseado em conclusões)
    let currentStreak = 0
    let checkDate = startOfDay(new Date())
    while (true) {
      const dayTasks = completedTasks.filter((t) => {
        const completedDate = startOfDay(new Date(t.completedAt!))
        return completedDate.getTime() === checkDate.getTime()
      })

      if (dayTasks.length === 0) {
        // Se hoje não tem tarefas, verifica ontem
        if (currentStreak === 0 && checkDate.getTime() === startOfDay(new Date()).getTime()) {
          checkDate = startOfDay(subDays(checkDate, 1))
          continue
        }
        break
      }

      currentStreak++
      checkDate = startOfDay(subDays(checkDate, 1))
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    let currentDate = startOfDay(subDays(new Date(), 365))

    while (currentDate <= new Date()) {
      const dayTasks = completedTasks.filter((t) => {
        const completedDate = startOfDay(new Date(t.completedAt!))
        return completedDate.getTime() === currentDate.getTime()
      })

      if (dayTasks.length > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }

      currentDate = startOfDay(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }

    // Average tasks per day (baseado em tarefas com vencimento)
    const tasksWithDueDate = tasks.filter(t => t.dueDate && t.completed)
    const oldestDueDate = tasksWithDueDate.length > 0
      ? Math.min(...tasksWithDueDate.map(t => new Date(t.dueDate!).getTime()))
      : new Date().getTime()

    const daysActive = differenceInDays(new Date(), new Date(oldestDueDate)) + 1
    const averageTasksPerDay = completedTasks.length / Math.max(daysActive, 1)

    // Most productive day of week (baseado em conclusões)
    const dayOfWeekCounts: Record<string, number> = {}
    completedTasks.forEach((t) => {
      const day = format(new Date(t.completedAt!), 'EEEE')
      dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1
    })
    const mostProductiveDay = Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    // Most productive hour (baseado em conclusões)
    const hourCounts: Record<number, number> = {}
    completedTasks.forEach((t) => {
      const hour = getHours(new Date(t.completedAt!))
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const mostProductiveHour = parseInt(
      Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '0'
    )

    // Completion trend (compara últimos 7 dias vs 7 dias anteriores)
    const last7Days = completedTasks.filter((t) => {
      const completedDate = new Date(t.completedAt!)
      return differenceInDays(new Date(), completedDate) <= 7
    }).length

    const previous7Days = completedTasks.filter((t) => {
      const completedDate = new Date(t.completedAt!)
      const daysDiff = differenceInDays(new Date(), completedDate)
      return daysDiff > 7 && daysDiff <= 14
    }).length

    let completionTrend: 'up' | 'down' | 'stable' = 'stable'
    if (last7Days > previous7Days * 1.1) completionTrend = 'up'
    else if (last7Days < previous7Days * 0.9) completionTrend = 'down'

    return {
      currentStreak,
      longestStreak,
      totalTasksCompleted: completedTasks.length,
      averageTasksPerDay,
      mostProductiveDay,
      mostProductiveHour,
      completionTrend,
    }
  }, [tasks])

  return {
    dailyStats,
    weeklyStats,
    productivityMetrics,
  }
}
