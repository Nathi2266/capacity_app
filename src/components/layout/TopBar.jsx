import React from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { APP_SETTINGS_KEYS, applyTheme, useBooleanSetting, useStoredValue } from '@/lib/appSettings';

export default function TopBar() {
  const [theme, setTheme] = useStoredValue(APP_SETTINGS_KEYS.theme, 'light');
  const [showNotificationBadge] = useBooleanSetting(
    APP_SETTINGS_KEYS.showNotificationBadge,
    true,
  );

  const { data: notifications = [] } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => base44.entities.Notification.filter({ read: false }),
    initialData: [],
  });

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleDark = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search employees, projects, skills..." 
            className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDark} className="rounded-full">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-4 h-4" />
            {showNotificationBadge && notifications.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
