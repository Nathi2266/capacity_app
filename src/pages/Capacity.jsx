import React from 'react';
import { useEmployees, useAllocations, getEmployeeUtilization } from '@/lib/useAllocations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import UtilizationBadge from '@/components/shared/UtilizationBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, UserCheck, TrendingDown } from 'lucide-react';

export default function Capacity() {
  const { data: employees } = useEmployees();
  const { data: allocations } = useAllocations();

  const activeEmployees = employees.filter(e => e.status === 'Active');
  
  /** @type {any[]} */
  const empUtilizations = activeEmployees.map(emp => ({
    ...emp,
    utilization: getEmployeeUtilization(emp.id, allocations),
    available: Math.max(0, 100 - getEmployeeUtilization(emp.id, allocations)),
  }));

  const overallocated = empUtilizations.filter(e => e.utilization > 100);
  const healthy = empUtilizations.filter(e => e.utilization >= 50 && e.utilization <= 100);
  const underutilized = empUtilizations.filter(e => e.utilization > 0 && e.utilization < 50);
  const bench = empUtilizations.filter(e => e.utilization === 0);

  // Department capacity
  const departments = [...new Set(activeEmployees.map(e => e.department).filter(Boolean))];
  const deptData = departments.map(dept => {
    const deptEmps = empUtilizations.filter(e => e.department === dept);
    const avgUtil = deptEmps.length > 0 ? Math.round(deptEmps.reduce((s, e) => s + e.utilization, 0) / deptEmps.length) : 0;
    return { name: dept.replace(' Engineering', '').substring(0, 12), avgUtil, count: deptEmps.length };
  }).sort((a, b) => b.avgUtil - a.avgUtil);

  const getBarColor = (value) => {
    if (value > 100) return 'hsl(0, 84%, 60%)';
    if (value >= 80) return 'hsl(43, 96%, 56%)';
    if (value >= 50) return 'hsl(152, 69%, 45%)';
    return 'hsl(215, 20%, 65%)';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Capacity Planning</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor team capacity and utilization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overallocated', value: overallocated.length, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Healthy', value: healthy.length, icon: UserCheck, color: 'text-emerald-500' },
          { label: 'Underutilized', value: underutilized.length, icon: TrendingDown, color: 'text-amber-500' },
          { label: 'On Bench', value: bench.length, icon: Users, color: 'text-muted-foreground' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Department Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Department Average Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="avgUtil" radius={[0, 4, 4, 0]}>
                  {deptData.map((entry, i) => <Cell key={i} fill={getBarColor(entry.avgUtil)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Employee Capacity List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Individual Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {empUtilizations.sort((a, b) => b.utilization - a.utilization).map(emp => (
              <div key={emp.id} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-sm font-medium truncate">{emp.full_name}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.department}</p>
                </div>
                <div className="flex-1">
                  <Progress value={Math.min(emp.utilization, 100)} className="h-2" />
                </div>
                <UtilizationBadge utilization={emp.utilization} />
                <span className="text-xs text-muted-foreground w-16 text-right">{emp.available}% free</span>
              </div>
            ))}
            {empUtilizations.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No active employees</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { Capacity };
