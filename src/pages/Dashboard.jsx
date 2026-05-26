import React from 'react';
import { useEmployees, useProjects, useAllocations, getEmployeeUtilization } from '@/lib/useAllocations';
import { StatCard } from '@/components/dashboard/StatCard';
import UtilizationChart from '@/components/dashboard/UtilizationChart';
import DepartmentBreakdown from '@/components/dashboard/DepartmentBreakdown';
import RecentAllocations from '@/components/dashboard/RecentAllocations';
import { Users, FolderKanban, UserCheck, AlertTriangle, UserMinus, Building2 } from 'lucide-react';

export function Dashboard() {
  const { data: employees } = useEmployees();
  const { data: projects } = useProjects();
  const { data: allocations } = useAllocations();

  const activeProjects = projects.filter(p => p.status === 'Active');
  const activeEmployees = employees.filter(e => e.status === 'Active');
  
  const overallocated = activeEmployees.filter(e => getEmployeeUtilization(e.id, allocations) > 100).length;
  const underutilized = activeEmployees.filter(e => {
    const u = getEmployeeUtilization(e.id, allocations);
    return u > 0 && u < 50;
  }).length;
  const available = activeEmployees.filter(e => getEmployeeUtilization(e.id, allocations) === 0).length;
  
  const departments = new Set(employees.map(e => e.department).filter(Boolean));

  const stats = [
    { title: 'Active Projects', value: activeProjects.length, icon: FolderKanban, gradient: 'bg-gradient-to-br from-primary to-blue-600', subtitle: `${projects.length} total` },
    { title: 'Total Employees', value: activeEmployees.length, icon: Users, gradient: 'bg-gradient-to-br from-accent to-emerald-600', subtitle: `${available} available` },
    { title: 'Available Capacity', value: available, icon: UserCheck, gradient: 'bg-gradient-to-br from-success to-green-600', subtitle: 'Ready to assign' },
    { title: 'Overallocated', value: overallocated, icon: AlertTriangle, gradient: 'bg-gradient-to-br from-destructive to-red-600', subtitle: 'Needs attention' },
    { title: 'Underutilized', value: underutilized, icon: UserMinus, gradient: 'bg-gradient-to-br from-warning to-amber-600', subtitle: 'Below 50%' },
    { title: 'Departments', value: departments.size, icon: Building2, gradient: 'bg-gradient-to-br from-purple-500 to-violet-600', subtitle: 'Active teams' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resource capacity overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UtilizationChart employees={activeEmployees} allocations={allocations} />
        <DepartmentBreakdown employees={employees} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <RecentAllocations allocations={allocations} />
      </div>
    </div>
  );
}

export default Dashboard;
