import { useState, useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Task, Priority, TaskStatistics, SortType, FilterType } from '@/types'
import { startOfDay, startOfWeek, startOfMonth, differenceInMinutes } from 'date-fns'

const TASKS_STORAGE_KEY = 'tasks'

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, [])
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [searchQuery, setSearchQuery] = useState('')

  const addTask = useCallback((
    title: string,
    description?: string,
    priority: Priority = 'medium',
    dueDate?: Date,
    category?: string,
    tags?: string[]
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      priority,
      dueDate,
      createdAt: new Date(),
      category,
      tags,
    }
    setTasks(prev => [newTask, ...prev])
  }, [setTasks])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ))
  }, [setTasks])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const completed = !task.completed
        return {
          ...task,
          completed,
          completedAt: completed ? new Date() : undefined,
        }
      }
      return task
    }))
  }, [setTasks])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [setTasks])

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed))
  }, [setTasks])

  const filteredTasks = useMemo(() => {
    let result = tasks

    if (filter !== 'all') {
      result = result.filter(task =>
        filter === 'completed' ? task.completed : !task.completed
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.category?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        case 'title':
          return a.title.localeCompare(b.title)
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [tasks, filter, sortBy, searchQuery])

  const statistics = useMemo((): TaskStatistics => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)

    const completed = tasks.filter(t => t.completed)
    const pending = tasks.filter(t => !t.completed)

    const completedToday = completed.filter(t =>
      t.completedAt && new Date(t.completedAt) >= todayStart
    ).length

    const completedThisWeek = completed.filter(t =>
      t.completedAt && new Date(t.completedAt) >= weekStart
    ).length

    const completedThisMonth = completed.filter(t =>
      t.completedAt && new Date(t.completedAt) >= monthStart
    ).length

    const byPriority = {
      low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
      medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
      high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    }

    const byCategory: Record<string, number> = {}
    tasks.forEach(task => {
      if (task.category) {
        byCategory[task.category] = (byCategory[task.category] || 0) + 1
      }
    })

    const completionTimes = completed
      .filter(t => t.completedAt)
      .map(t => differenceInMinutes(new Date(t.completedAt!), new Date(t.createdAt)))

    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : undefined

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      completedToday,
      completedThisWeek,
      completedThisMonth,
      completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
      averageCompletionTime,
      byPriority,
      byCategory,
    }
  }, [tasks])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    statistics,
  }
}
