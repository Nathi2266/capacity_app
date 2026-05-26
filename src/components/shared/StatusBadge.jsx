import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  Active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'On Leave': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Inactive: 'bg-muted text-muted-foreground border-border',
  Planning: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'On Hold': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const priorityStyles = {
  Low: 'bg-muted text-muted-foreground border-border',
  Medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  High: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", statusStyles[status] || 'bg-muted text-muted-foreground')}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium border", priorityStyles[priority] || 'bg-muted text-muted-foreground')}>
      {priority}
    </Badge>
  );
}
