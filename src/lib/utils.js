import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top

export function getEmployeeUtilization(employeeId, allocations = []) {
  return allocations
    .filter((allocation) => allocation.employee_id === employeeId)
    .reduce((total, allocation) => total + Number(allocation.allocation_pct ?? 0), 0)
}

export function getUtilizationStatus(value) {
  if (value < 50) return { label: 'Bench', color: 'success' }
  if (value < 80) return { label: 'Healthy', color: 'primary' }
  if (value <= 100) return { label: 'Utilized', color: 'warning' }
  return { label: 'Overallocated', color: 'destructive' }
}
