import React, { useState, useMemo } from 'react';
import { useEmployees } from '@/lib/useAllocations';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

const DEPARTMENTS = ['All', 'Frontend Engineering', 'Backend Engineering', 'Full Stack Engineering', 'QA', 'DevOps', 'UX/UI', 'Product Management', 'Data Engineering', 'AI/ML', 'Security'];
const ALL_SKILLS = ['React', 'Angular', 'Vue', 'Node.js', 'Java', 'Python', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Flutter', 'Figma', 'Selenium', 'Cypress', 'TypeScript', 'Go', 'Ruby', 'GraphQL', 'Redis', 'Swift'];
const PROFICIENCY_WEIGHT = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };

export default function SkillsHeatmap() {
  const { data: employees } = useEmployees();
  const [deptFilter, setDeptFilter] = useState('All');
  const [seniorityFilter, setSeniorityFilter] = useState('All');

  const filtered = useMemo(() => {
    return employees.filter(e => {
      if (deptFilter !== 'All' && e.department !== deptFilter) return false;
      if (seniorityFilter !== 'All' && e.seniority !== seniorityFilter) return false;
      return e.status === 'Active';
    });
  }, [employees, deptFilter, seniorityFilter]);

  // Build heatmap: departments (rows) x skills (columns)
  const heatmapData = useMemo(() => {
    const deptList = deptFilter === 'All'
      ? [...new Set(filtered.map(e => e.department).filter(Boolean))]
      : [deptFilter];

    const skillCounts = {};
    deptList.forEach(dept => {
      skillCounts[dept] = {};
      ALL_SKILLS.forEach(skill => {
        const empsWithSkill = filtered.filter(e =>
          e.department === dept && (e.skills || []).some(s => s.name === skill)
        );
        const totalWeight = empsWithSkill.reduce((sum, e) => {
          const s = (e.skills || []).find(s => s.name === skill);
          return sum + (PROFICIENCY_WEIGHT[s?.proficiency] || 0);
        }, 0);
        skillCounts[dept][skill] = { count: empsWithSkill.length, weight: totalWeight };
      });
    });
    return { deptList, skillCounts };
  }, [filtered, deptFilter]);

  const getColor = (count, maxCount) => {
    if (count === 0) return 'bg-muted';
    const ratio = maxCount > 0 ? count / maxCount : 0;
    if (ratio >= 0.7) return 'bg-emerald-500';
    if (ratio >= 0.4) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getOpacity = (count, maxCount) => {
    if (count === 0) return 'opacity-30';
    const ratio = maxCount > 0 ? count / maxCount : 0;
    if (ratio >= 0.7) return 'opacity-100';
    if (ratio >= 0.4) return 'opacity-80';
    return 'opacity-70';
  };

  const maxCount = Math.max(1, ...Object.values(heatmapData.skillCounts).flatMap(dept => Object.values(dept).map(v => v.count)));

  // Skills with at least one employee
  const activeSkills = ALL_SKILLS.filter(skill =>
    heatmapData.deptList.some(dept => heatmapData.skillCounts[dept]?.[skill]?.count > 0)
  );
  const displaySkills = activeSkills.length > 0 ? activeSkills : ALL_SKILLS;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Skills Heatmap</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual skills distribution across departments</p>
        </div>

        <div className="flex gap-3">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Seniority</SelectItem>
              {['Junior', 'Mid', 'Senior', 'Staff', 'Principal', 'Lead'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span className="font-medium">Coverage:</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-red-400" /> Shortage</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-amber-400" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-500" /> Strong</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-muted opacity-30" /> None</span>
        </div>

        {/* Heatmap Grid */}
        <Card className="border-0 shadow-sm overflow-x-auto">
          <CardContent className="p-4">
            <div className="min-w-[800px]">
              {/* Header row */}
              <div className="flex">
                <div className="w-48 flex-shrink-0" />
                {displaySkills.map(skill => (
                  <div key={skill} className="flex-1 min-w-[52px] text-center">
                    <span className="text-[10px] font-medium text-muted-foreground writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'inline-block', height: '80px' }}>
                      {skill}
                    </span>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {heatmapData.deptList.map((dept, di) => (
                <motion.div
                  key={dept}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: di * 0.05 }}
                >
                  <div className="w-48 flex-shrink-0 py-2 pr-3">
                    <span className="text-xs font-medium text-foreground truncate block">{dept}</span>
                  </div>
                  {displaySkills.map(skill => {
                    const data = heatmapData.skillCounts[dept]?.[skill] || { count: 0, weight: 0 };
                    return (
                      <Tooltip key={skill}>
                        <TooltipTrigger asChild>
                          <div className="flex-1 min-w-[52px] p-0.5">
                            <div className={`h-10 rounded-md ${getColor(data.count, maxCount)} ${getOpacity(data.count, maxCount)} transition-all hover:scale-105 cursor-pointer flex items-center justify-center`}>
                              {data.count > 0 && <span className="text-[10px] font-bold text-white">{data.count}</span>}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{skill} — {dept}</p>
                          <p className="text-xs">{data.count} employee{data.count !== 1 ? 's' : ''}</p>
                          <p className="text-xs text-muted-foreground">Weighted score: {data.weight}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displaySkills.slice(0, 8).map(skill => {
            const total = heatmapData.deptList.reduce((sum, dept) => sum + (heatmapData.skillCounts[dept]?.[skill]?.count || 0), 0);
            return (
              <Card key={skill} className="border-0 shadow-sm p-4">
                <p className="text-sm font-semibold">{skill}</p>
                <p className="text-2xl font-bold mt-1">{total}</p>
                <p className="text-xs text-muted-foreground">across {heatmapData.deptList.filter(d => heatmapData.skillCounts[d]?.[skill]?.count > 0).length} departments</p>
              </Card>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

export { SkillsHeatmap };
