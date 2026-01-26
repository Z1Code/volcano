'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { SectionsConfig, defaultConfig } from '@/lib/sections-config'

interface SectionsContextType {
  config: SectionsConfig
  loaded: boolean
}

const SectionsContext = createContext<SectionsContextType>({
  config: defaultConfig,
  loaded: false,
})

export function SectionsProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SectionsConfig>(defaultConfig)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/sections')
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        setLoaded(true)
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [])

  return (
    <SectionsContext.Provider value={{ config, loaded }}>
      {children}
    </SectionsContext.Provider>
  )
}

export function ConditionalSection({
  section,
  children,
}: {
  section: keyof SectionsConfig
  children: ReactNode
}) {
  const { config, loaded } = useContext(SectionsContext)

  // Show section while loading to prevent layout shift
  if (!loaded) {
    return <>{children}</>
  }

  // After loaded, conditionally render based on config
  if (!config[section]) {
    return null
  }

  return <>{children}</>
}
