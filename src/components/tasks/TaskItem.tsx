import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task, Priority } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Trash2, Edit3, Calendar, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
}

const priorityLabels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(task.id), 300)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: 0,
        x: isDeleting ? -100 : 0,
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "p-4 hover:shadow-md transition-all duration-200",
        task.completed && "opacity-60"
      )}>
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              "mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              task.completed
                ? "bg-primary border-primary"
                : "border-muted-foreground hover:border-primary"
            )}
          >
            {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-base mb-1",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <Badge
                variant="outline"
                className={priorityColors[task.priority]}
              >
                {priorityLabels[task.priority]}
              </Badge>

              {task.category && (
                <Badge variant="secondary" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {task.category}
                </Badge>
              )}

              {task.dueDate && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(new Date(task.dueDate))}
                </Badge>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex gap-1">
                  {task.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
