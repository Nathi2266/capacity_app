import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  'hsl(234, 89%, 62%)',
  'hsl(172, 66%, 50%)',
  'hsl(43, 96%, 56%)',
  'hsl(0, 84%, 60%)',
  'hsl(262, 83%, 58%)',
  'hsl(152, 69%, 45%)',
  'hsl(200, 80%, 50%)',
  'hsl(340, 65%, 55%)',
  'hsl(30, 80%, 55%)',
  'hsl(180, 50%, 50%)',
]

function DepartmentBreakdown({ employees = [] }) {
  const deptCounts = {}

  employees.forEach((emp) => {
    const dept = emp.department || 'Unknown'
    deptCounts[dept] = (deptCounts[dept] || 0) + 1
  })

  const data = Object.entries(deptCounts).map(([name, value]) => ({ name, value }))

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Department Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] flex items-center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[280px]">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DepartmentBreakdown
export { DepartmentBreakdown }
