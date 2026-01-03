import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event)
      console.log('👤 Session:', session?.user?.email || 'Nenhuma sessão')

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log('📝 Dados do usuário do Google:', {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        })
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Buscando perfil para userId:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error)
        console.log('ℹ️ Isso pode significar que o perfil ainda não foi criado')
        console.log('ℹ️ Execute o script diagnose-and-fix-auth.sql no Supabase')
        throw error
      }

      console.log('✅ Perfil encontrado:', data)
      setProfile(data)
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error)
      console.log('⚠️ Usuário autenticado mas sem perfil na tabela profiles')
      console.log('⚠️ Execute: diagnose-and-fix-auth.sql no Supabase SQL Editor')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          prompt: 'select_account', // Força escolha de conta
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    // Faz logout do Supabase
    await supabase.auth.signOut()

    // Limpa estado local
    setUser(null)
    setProfile(null)
    setSession(null)

    // Limpa sessionStorage e localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Redireciona para a página de login
    window.location.href = '/login'
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
