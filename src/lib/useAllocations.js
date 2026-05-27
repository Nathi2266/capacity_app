import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { APP_SETTINGS_KEYS, useStoredValue } from '@/lib/appSettings';

function getRefreshInterval(intervalMinutes) {
  const parsed = Number(intervalMinutes)
  if (!parsed || parsed <= 0) {
    return false
  }
  return parsed * 60 * 1000
}

export function useAllocations() {
  const [autoRefreshInterval] = useStoredValue(APP_SETTINGS_KEYS.autoRefreshInterval, '15')
  return useQuery({
    queryKey: ['allocations'],
    queryFn: () => base44.entities.Allocation.filter({ status: 'Active' }),
    initialData: [],
    refetchInterval: getRefreshInterval(autoRefreshInterval),
  });
}

export function useEmployees() {
  const [autoRefreshInterval] = useStoredValue(APP_SETTINGS_KEYS.autoRefreshInterval, '15')
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list(),
    initialData: [],
    refetchInterval: getRefreshInterval(autoRefreshInterval),
  });
}

export function useProjects() {
  const [autoRefreshInterval] = useStoredValue(APP_SETTINGS_KEYS.autoRefreshInterval, '15')
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
    refetchInterval: getRefreshInterval(autoRefreshInterval),
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
