import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function UtilizationChart({ employees = [], allocations = [] }) {
  const getUtilization = (empId) => {
    return allocations
      .filter((allocation) => allocation.employee_id === empId && allocation.status === 'Active')
      .reduce((sum, allocation) => sum + (allocation.allocation_pct || 0), 0)
  }

  const data = employees.slice(0, 12).map((employee) => ({
    name: employee.full_name?.split(' ')[0] || 'N/A',
    utilization: getUtilization(employee.id),
  }))

  const getBarColor = (value) => {
    if (value > 100) return 'hsl(0, 84%, 60%)'
    if (value >= 90) return 'hsl(43, 96%, 56%)'
    if (value >= 50) return 'hsl(152, 69%, 45%)'
    return 'hsl(215, 20%, 65%)'
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Employee Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.utilization)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default UtilizationChart
export { UtilizationChart }
