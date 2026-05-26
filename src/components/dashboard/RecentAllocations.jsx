import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecentAllocations({ allocations = [] }) {
  const recent = [...allocations]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 6);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent Allocations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No allocations yet</p>
          )}
          {recent.map((alloc) => (
            <div key={alloc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{alloc.employee_name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">{alloc.project_name || 'Unknown Project'}</p>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {alloc.allocation_pct}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
