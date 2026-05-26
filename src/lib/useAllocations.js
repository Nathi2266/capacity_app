import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useAllocations() {
  return useQuery({
    queryKey: ['allocations'],
    queryFn: () => base44.entities.Allocation.filter({ status: 'Active' }),
    initialData: [],
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list(),
    initialData: [],
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });
}

export function getEmployeeUtilization(employeeId, allocations) {
  const empAllocations = allocations.filter(a => a.employee_id === employeeId && a.status === 'Active');
  return empAllocations.reduce((sum, a) => sum + (a.allocation_pct || 0), 0);
}

export function getUtilizationStatus(utilization) {
  if (utilization > 100) return { label: 'Overallocated', color: 'destructive' };
  if (utilization >= 90) return { label: 'Near Capacity', color: 'warning' };
  if (utilization >= 50) return { label: 'Healthy', color: 'success' };
  if (utilization > 0) return { label: 'Underutilized', color: 'chart-3' };
  return { label: 'Available', color: 'muted' };
}
