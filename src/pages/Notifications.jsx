import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { APP_SETTINGS_KEYS, useStoredValue } from '@/lib/appSettings';

const typeIcons = {
  overallocation: AlertTriangle,
  capacity_risk: AlertTriangle,
  allocation_change: Info,
  new_project: CheckCircle,
  deadline: Clock,
  info: Info,
};

const severityColors = {
  low: 'bg-blue-500/10 text-blue-600',
  medium: 'bg-amber-500/10 text-amber-600',
  high: 'bg-orange-500/10 text-orange-600',
  critical: 'bg-destructive/10 text-destructive',
};

export default function Notifications() {
  const queryClient = useQueryClient();
  const [notificationSortOrder] = useStoredValue(APP_SETTINGS_KEYS.notificationSortOrder, '-created_date')
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', notificationSortOrder],
    queryFn: () => base44.entities.Notification.list(notificationSortOrder),
    initialData: [],
  });

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { read: true });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{notifications.filter(n => !n.read).length} unread</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const Icon = typeIcons[notif.type] || Info;
          return (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={cn(
                "border-0 shadow-sm p-4 flex items-start gap-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                !notif.read && "bg-primary/[0.02] border-l-2 border-l-primary"
              )} onClick={() => markRead(notif.id)}>
                <div className={cn("p-2 rounded-lg", severityColors[notif.severity] || 'bg-muted')}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-medium", !notif.read && "font-semibold")}>{notif.title}</p>
                    {!notif.read && <Badge className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {notif.created_date ? format(new Date(notif.created_date), 'MMM d, yyyy h:mm a') : ''}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { Notifications };
