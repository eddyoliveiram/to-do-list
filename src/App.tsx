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

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useAuth()
  const { selectMember } = useMember()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      selectMember(null)
      await signOut()
      navigate('/login')
    }
  }

  return (
    <Routes>
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

      {/* Rotas que requerem membro selecionado */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MemberRoute>
              <div className="min-h-screen bg-background">
                <Header
                  onMenuClick={() => setSidebarOpen(true)}
                  showLogout
                  onLogout={handleSignOut}
                />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="min-h-[calc(100vh-4rem)]">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </main>

                <Navigation />
              </div>
            </MemberRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
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
