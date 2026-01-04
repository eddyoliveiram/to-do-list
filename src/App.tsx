import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { MemberProvider, useMember } from '@/contexts/MemberContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MemberRoute } from '@/components/auth/MemberRoute'
import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Login } from '@/pages/Login'
import { MemberSelection } from '@/pages/MemberSelection'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { signOut } = useAuth()
  const { selectMember } = useMember()
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false)
    selectMember(null)
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rota de seleção de membro (após login) */}
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MemberSelection />
            </ProtectedRoute>
          }
        />

        {/* Rota principal - Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MemberRoute>
                <div className="min-h-screen bg-background">
                  <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    showLogout
                    onLogout={handleLogoutClick}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="min-h-[calc(100vh-4rem)]">
                    <Home />
                  </main>
                  <Navigation />
                </div>
              </MemberRoute>
            </ProtectedRoute>
          }
        />

        {/* Rota Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MemberRoute>
                <div className="min-h-screen bg-background">
                  <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    showLogout
                    onLogout={handleLogoutClick}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="min-h-[calc(100vh-4rem)]">
                    <Dashboard />
                  </main>
                  <Navigation />
                </div>
              </MemberRoute>
            </ProtectedRoute>
          }
        />
      </Routes>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair? Você precisará fazer login novamente para acessar suas tarefas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout}>
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MemberProvider>
          <AppContent />
        </MemberProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
