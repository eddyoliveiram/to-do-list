import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useMember } from '@/contexts/MemberContext'

export function LogoutButton() {
  const { signOut } = useAuth()
  const { selectMember } = useMember()

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      selectMember(null)
      await signOut()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignOut}
      title="Sair da conta"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  )
}
