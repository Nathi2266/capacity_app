import React from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  GitBranch,
  BarChart3,
  Grid3X3,
  Bell,
  SlidersHorizontal,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  MonitorCog,
  ListFilter,
  Navigation2,
  TimerReset,
  Table2,
  RefreshCcw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/AuthContext'
import {
  APP_SETTINGS_KEYS,
  applyAnimationsEnabled,
  applyTableDensity,
  applyTheme,
  useBooleanSetting,
  useStoredValue,
} from '@/lib/appSettings'
import { cn } from '@/lib/utils'

const quickLinks = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', description: 'Overview and stats' },
  { path: '/employees', icon: Users, label: 'Employees', description: 'Team directory' },
  { path: '/projects', icon: FolderKanban, label: 'Projects', description: 'Project pipeline' },
  { path: '/allocations', icon: GitBranch, label: 'Allocations', description: 'Assignment workflow' },
  { path: '/capacity', icon: MonitorCog, label: 'Capacity', description: 'Utilization view' },
  { path: '/heatmap', icon: Grid3X3, label: 'Skills Heatmap', description: 'Skills coverage' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', description: 'Reports and trends' },
  { path: '/notifications', icon: Bell, label: 'Notifications', description: 'Alerts and updates' },
  { path: '/profile', icon: Navigation2, label: 'Profile', description: 'Your account profile' },
]

const landingPages = [
  { value: '/', label: 'Dashboard' },
  { value: '/employees', label: 'Employees' },
  { value: '/projects', label: 'Projects' },
  { value: '/allocations', label: 'Allocations' },
  { value: '/capacity', label: 'Capacity' },
  { value: '/heatmap', label: 'Skills Heatmap' },
  { value: '/analytics', label: 'Analytics' },
  { value: '/notifications', label: 'Notifications' },
  { value: '/profile', label: 'Profile' },
  { value: '/settings', label: 'Settings' },
]

const notificationOrders = [
  { value: '-created_date', label: 'Newest first' },
  { value: 'created_date', label: 'Oldest first' },
]

const tableDensities = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]

const refreshIntervals = [
  { value: '0', label: 'Off' },
  { value: '5', label: 'Every 5 minutes' },
  { value: '15', label: 'Every 15 minutes' },
  { value: '30', label: 'Every 30 minutes' },
  { value: '60', label: 'Every 60 minutes' },
]

function SettingCard({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4 stroke-[2.5]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SettingToggle({ active, onClick, title, description, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors hover:bg-secondary/40',
        active ? 'border-primary bg-primary/5' : 'border-border bg-card',
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border',
          active ? 'border-primary/20 bg-primary text-primary-foreground' : 'border-border bg-secondary',
        )}>
          <Icon className="h-4 w-4 stroke-[2.5]" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Badge variant={active ? 'default' : 'outline'} className="text-[10px]">
        {active ? 'On' : 'Off'}
      </Badge>
    </button>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [theme, setTheme] = useStoredValue(APP_SETTINGS_KEYS.theme, 'light')
  const [sidebarCollapsed, setSidebarCollapsed] = useBooleanSetting(APP_SETTINGS_KEYS.sidebarCollapsed, false)
  const [compactLayout, setCompactLayout] = useBooleanSetting(APP_SETTINGS_KEYS.compactLayout, false)
  const [showNotificationBadge, setShowNotificationBadge] = useBooleanSetting(APP_SETTINGS_KEYS.showNotificationBadge, true)
  const [enableAnimations, setEnableAnimations] = useBooleanSetting(APP_SETTINGS_KEYS.enableAnimations, true)
  const [tableDensity, setTableDensity] = useStoredValue(APP_SETTINGS_KEYS.tableDensity, 'comfortable')
  const [defaultLandingPage, setDefaultLandingPage] = useStoredValue(APP_SETTINGS_KEYS.defaultLandingPage, '/')
  const [notificationSortOrder, setNotificationSortOrder] = useStoredValue(APP_SETTINGS_KEYS.notificationSortOrder, '-created_date')
  const [persistFilters, setPersistFilters] = useBooleanSetting(APP_SETTINGS_KEYS.persistFilters, true)
  const [autoRefreshInterval, setAutoRefreshInterval] = useStoredValue(APP_SETTINGS_KEYS.autoRefreshInterval, '15')

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  React.useEffect(() => {
    applyAnimationsEnabled(enableAnimations)
  }, [enableAnimations])

  React.useEffect(() => {
    applyTableDensity(tableDensity)
  }, [tableDensity])

  const activeSettings = [
    theme === 'dark',
    sidebarCollapsed,
    compactLayout,
    showNotificationBadge,
    enableAnimations,
    tableDensity === 'compact',
    defaultLandingPage !== '/',
    notificationSortOrder === 'created_date',
    persistFilters,
    autoRefreshInterval !== '0',
  ].filter(Boolean).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ten working preferences that affect the live app experience.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="font-medium">
            {activeSettings}/10 active
          </Badge>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Account snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
              <p className="mt-1 text-sm font-bold text-foreground">{user?.full_name || 'Demo Admin'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-medium text-foreground">{user?.email || 'admin@example.com'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium text-foreground">{user?.role || 'Admin'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SettingCard
                icon={Sun}
                title="Light mode"
                description="Bright interface for daytime work."
              >
                <Button type="button" variant={theme === 'light' ? 'default' : 'outline'} className="w-full" onClick={() => setTheme('light')}>
                  Use light
                </Button>
              </SettingCard>
              <SettingCard
                icon={Moon}
                title="Dark mode"
                description="Low-light interface for evenings."
              >
                <Button type="button" variant={theme === 'dark' ? 'default' : 'outline'} className="w-full" onClick={() => setTheme('dark')}>
                  Use dark
                </Button>
              </SettingCard>
            </div>
            <SettingToggle
              active={enableAnimations}
              onClick={() => setEnableAnimations((current) => !current)}
              icon={Sparkles}
              title="Enable animations"
              description="Keep screen transitions and motion effects active."
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle
              active={sidebarCollapsed}
              onClick={() => setSidebarCollapsed((current) => !current)}
              icon={sidebarCollapsed ? PanelLeftOpen : PanelLeftClose}
              title="Remember sidebar state"
              description="Keep the sidebar collapsed or expanded on reload."
            />
            <SettingToggle
              active={compactLayout}
              onClick={() => setCompactLayout((current) => !current)}
              icon={Sparkles}
              title="Compact page spacing"
              description="Reduce page padding for denser screens."
            />
            <SettingCard
              icon={Table2}
              title="Table density"
              description="Changes row spacing across employees and allocations."
            >
              <Select value={tableDensity} onValueChange={setTableDensity}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tableDensities.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Data behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle
              active={showNotificationBadge}
              onClick={() => setShowNotificationBadge((current) => !current)}
              icon={Bell}
              title="Notification badge"
              description="Show unread notifications in the top bar."
            />
            <SettingCard
              icon={ListFilter}
              title="Notification order"
              description="Choose which notifications appear first."
            >
              <Select value={notificationSortOrder} onValueChange={setNotificationSortOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationOrders.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
            <SettingCard
              icon={RefreshCcw}
              title="Auto refresh interval"
              description="Refresh employee, project, and allocation data automatically."
            >
              <Select value={autoRefreshInterval} onValueChange={setAutoRefreshInterval}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {refreshIntervals.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingCard
              icon={Navigation2}
              title="Default landing page"
              description="Send users to a specific screen after login."
            >
              <Select value={defaultLandingPage} onValueChange={setDefaultLandingPage}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {landingPages.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
            <SettingToggle
              active={persistFilters}
              onClick={() => setPersistFilters((current) => !current)}
              icon={TimerReset}
              title="Persist page filters"
              description="Remember search and filter values on list screens."
            />
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-foreground">Quick navigation</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {quickLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4 stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground">{item.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { Settings }
