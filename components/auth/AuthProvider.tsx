'use client'

import { createContext, useContext, useEffect, useMemo, useState, useRef, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)
  const initializedRef = useRef(false)

  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), [hasSupabaseEnv])

  const fetchProfile = async (userId: string) => {
    if (!supabase || !mountedRef.current) return null

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (mountedRef.current) {
        setProfile(data)
      }
      return data
    } catch {
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    mountedRef.current = true

    if (!supabase) {
      setSession(null)
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    // Prevent double initialization in React Strict Mode
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    let isSubscribed = true

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!isSubscribed || !mountedRef.current) return

        if (error) {
          // Handle AbortError silently - it's expected during unmount
          if (error.name === 'AbortError' || error.message?.includes('aborted')) {
            return
          }
          console.error('Auth init error:', error)
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error: unknown) {
        // Handle AbortError silently
        if (error instanceof Error && (error.name === 'AbortError' || error.message?.includes('aborted'))) {
          return
        }
        console.error('Auth initialization failed:', error)
      } finally {
        if (isSubscribed && mountedRef.current) {
          setLoading(false)
        }
      }
    }

    // Start auth initialization
    initializeAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isSubscribed || !mountedRef.current) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      isSubscribed = false
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
