import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import TopBar from './TopBar'
import { cn } from '@/lib/utils'
import { APP_SETTINGS_KEYS, useBooleanSetting } from '@/lib/appSettings'

export function AppLayout() {
  const [collapsed, setCollapsed] = useBooleanSetting(APP_SETTINGS_KEYS.sidebarCollapsed, false)
  const [compactLayout] = useBooleanSetting(APP_SETTINGS_KEYS.compactLayout, false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-[68px]' : 'ml-[240px]'
        )}
      >
        <TopBar />
        <main className={cn('transition-all duration-300', compactLayout ? 'p-4 md:p-5' : 'p-6')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
