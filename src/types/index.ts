export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed'
export type FilterType = 'all' | 'pending' | 'completed'
export type SortType = 'date' | 'priority' | 'title'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  category?: string
  tags?: string[]
}

export interface TaskStatistics {
  total: number
  completed: number
  pending: number
  completedToday: number
  completedThisWeek: number
  completedThisMonth: number
  completionRate: number
  averageCompletionTime?: number
  byPriority: {
    low: number
    medium: number
    high: number
  }
  byCategory: Record<string, number>
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  defaultPriority: Priority
  showCompletedTasks: boolean
  sortBy: SortType
  filterBy: FilterType
  enableNotifications: boolean
}

export interface DailyStats {
  date: string
  completed: number
  created: number
  total: number
}

export interface WeeklyProgress {
  week: string
  completed: number
  created: number
}

export interface ProductivityMetrics {
  currentStreak: number
  longestStreak: number
  totalTasksCompleted: number
  averageTasksPerDay: number
  mostProductiveDay: string
  mostProductiveHour: number
  completionTrend: 'up' | 'down' | 'stable'
}
