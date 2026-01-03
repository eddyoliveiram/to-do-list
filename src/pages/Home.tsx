import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getGreeting } from '@/lib/utils'

export function Home() {
  const {
    tasks,
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
    statistics,
  } = useTasks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleSubmit = (
    title: string,
    description?: string,
    priority?: Task['priority'],
    dueDate?: Date,
    category?: string,
    tags?: string[]
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        priority,
        dueDate,
        category,
        tags,
      })
      setEditingTask(undefined)
    } else {
      addTask(title, description, priority, dueDate, category, tags)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTask(undefined)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold mb-2">{getGreeting()}!</h2>
        <p className="text-muted-foreground">
          Você tem {statistics.pending} tarefa{statistics.pending !== 1 ? 's' : ''} pendente
          {statistics.pending !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => setModalOpen(true)}
          className="w-full mb-6 gap-2 h-12 text-base"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </Button>
      </motion.div>

      <TaskModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        task={editingTask}
        onSubmit={handleSubmit}
      />

      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={handleEdit}
      />
    </div>
  )
}
