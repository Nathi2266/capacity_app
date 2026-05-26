import React from 'react';
import { useEmployees, useProjects, useAllocations, getEmployeeUtilization } from '@/lib/useAllocations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['hsl(234, 89%, 62%)', 'hsl(172, 66%, 50%)', 'hsl(43, 96%, 56%)', 'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)', 'hsl(152, 69%, 45%)'];

export default function Analytics() {
  const { data: employees } = useEmployees();
  const { data: projects } = useProjects();
  const { data: allocations } = useAllocations();

  const activeEmployees = employees.filter(e => e.status === 'Active');

  // Utilization distribution
  const utilizationBuckets = [
    { range: '0%', count: 0 }, { range: '1-25%', count: 0 }, { range: '26-50%', count: 0 },
    { range: '51-75%', count: 0 }, { range: '76-100%', count: 0 }, { range: '>100%', count: 0 },
  ];
  activeEmployees.forEach(e => {
    const u = getEmployeeUtilization(e.id, allocations);
    if (u === 0) utilizationBuckets[0].count++;
    else if (u <= 25) utilizationBuckets[1].count++;
    else if (u <= 50) utilizationBuckets[2].count++;
    else if (u <= 75) utilizationBuckets[3].count++;
    else if (u <= 100) utilizationBuckets[4].count++;
    else utilizationBuckets[5].count++;
  });

  // Skills gap - most common vs least
  const skillCounts = {};
  employees.forEach(e => (e.skills || []).forEach(s => {
    skillCounts[s.name] = (skillCounts[s.name] || 0) + 1;
  }));
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

  // Seniority distribution
  const seniorityCounts = {};
  employees.forEach(e => { seniorityCounts[e.seniority || 'Unknown'] = (seniorityCounts[e.seniority || 'Unknown'] || 0) + 1; });
  const seniorityData = Object.entries(seniorityCounts).map(([name, value]) => ({ name, value }));

  // Project status
  const statusCounts = {};
  projects.forEach(p => { statusCounts[p.status || 'Unknown'] = (statusCounts[p.status || 'Unknown'] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Radar data - department skill depth
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))].slice(0, 8);
  const radarData = departments.map(dept => {
    const deptEmps = employees.filter(e => e.department === dept);
    const avgSkills = deptEmps.length > 0 ? Math.round(deptEmps.reduce((s, e) => s + (e.skills || []).length, 0) / deptEmps.length) : 0;
    return { department: dept.replace(' Engineering', '').substring(0, 10), skills: avgSkills };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Workforce insights and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Utilization Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Utilization Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationBuckets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Skills</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSkills} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="name" type="category" width={80} fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Seniority Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Seniority Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={seniorityData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                      {seniorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Project Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export { Analytics };
