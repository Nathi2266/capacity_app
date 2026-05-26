import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function UtilizationBadge({ utilization }) {
  const getBadgeStyle = () => {
    if (utilization > 100) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (utilization >= 90) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (utilization >= 50) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (utilization > 0) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <Badge variant="outline" className={cn("text-xs font-semibold border", getBadgeStyle())}>
      {utilization}%
    </Badge>
  );
}
