import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  GitBranch,
  BarChart3,
  Grid3X3,
  Bell,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  LogOut,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employees', icon: Users, label: 'Employees' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/allocations', icon: GitBranch, label: 'Allocations' },
  { path: '/capacity', icon: Target, label: 'Capacity' },
  { path: '/heatmap', icon: Grid3X3, label: 'Skills Heatmap' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: UserRound, label: 'Profile' },
  { path: '/settings', icon: Settings2, label: 'Settings' },
]

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to log out of the app?')
      if (!confirmed) {
        return
      }
    }

    logout()
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[240px]',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'flex h-16 w-full items-center border-b border-border px-4 text-left transition-colors hover:bg-secondary/40',
            collapsed ? 'justify-center' : 'gap-3',
          )}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 stroke-[2.75] text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-black leading-tight text-foreground">ResourceHub</h1>
              <p className="text-[10px] text-muted-foreground">Capacity Planning</p>
            </div>
          )}
        </Button>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            const Icon = item.icon

            const linkContent = (
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  collapsed && 'justify-center px-2',
                )}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0 stroke-[2.5]" />
                {!collapsed && <span className="font-bold">{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.path}>{linkContent}</div>
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center justify-center gap-2 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive',
              collapsed && 'px-2',
            )}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 stroke-[2.5]" />
            {!collapsed && <span>Logout</span>}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="flex w-full items-center justify-center"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

export { Sidebar }
export default Sidebar
