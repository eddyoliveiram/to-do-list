import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Monitor, Trash2, Download, Upload } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { allTasks, statistics } = useTasks()

  const handleExportData = () => {
    const data = {
      tasks: allTasks,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.tasks && Array.isArray(data.tasks)) {
              localStorage.setItem('tasks', JSON.stringify(data.tasks))
              window.location.reload()
            }
          } catch (error) {
            console.error('Error importing data:', error)
            alert('Erro ao importar dados. Verifique o arquivo.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearData = () => {
    if (
      confirm(
        'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.'
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold mb-2">Configurações</h2>
        <p className="text-muted-foreground">
          Personalize sua experiência
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>
                Escolha a aparência do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Sun className="w-6 h-6" />
                  <span>Claro</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Moon className="w-6 h-6" />
                  <span>Escuro</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Monitor className="w-6 h-6" />
                  <span>Sistema</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dados</CardTitle>
              <CardDescription>
                Gerencie seus dados e backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Tarefas</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Armazenamento</p>
                  <p className="text-2xl font-bold">
                    {(JSON.stringify(allTasks).length / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImportData}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={handleClearData}
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Todos os Dados
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Versão</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tecnologias</span>
                <div className="flex gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Vite</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
