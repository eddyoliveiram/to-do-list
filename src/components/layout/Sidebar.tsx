import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from './Navigation'
import { X, LogOut, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useMember } from '@/contexts/MemberContext'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth()
  const { selectMember } = useMember()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      selectMember(null)
      await signOut()
      navigate('/login')
      onClose()
    }
  }

  const handleChangeMembers = () => {
    navigate('/members')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-72 border-r bg-background md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1">
              <Navigation isMobile onNavigate={onClose} />
            </div>
            <div className="border-t p-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleChangeMembers}
              >
                <Users className="w-5 h-5" />
                <span>Trocar Pessoa</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                <span>Sair da Conta</span>
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
