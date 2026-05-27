import React, { useState } from 'react';
import { useEmployees, useProjects, useAllocations, getEmployeeUtilization } from '@/lib/useAllocations';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import UtilizationBadge from '@/components/shared/UtilizationBadge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { APP_SETTINGS_KEYS, useBooleanSetting, useOptionalStoredValue } from '@/lib/appSettings';

export default function Allocations() {
  const { data: employees } = useEmployees();
  const { data: projects } = useProjects();
  const { data: allocations } = useAllocations();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [persistFilters] = useBooleanSetting(APP_SETTINGS_KEYS.persistFilters, true);
  const [selectedProject, setSelectedProject] = useOptionalStoredValue(
    'capacity_app_allocations_selected_project',
    '',
    persistFilters,
  );
  const [form, setForm] = useState({ employee_id: '', project_id: '', allocation_pct: 20, role_on_project: '', start_date: '', end_date: '' });
  const [showRecommendations, setShowRecommendations] = useState(false);

  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'Planning');

  const getRecommendations = () => {
    if (!selectedProject) return [];
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return [];
    const requiredSkills = project.required_skills || [];
    
    return employees
      .filter(e => e.status === 'Active')
      .map(emp => {
        const util = getEmployeeUtilization(emp.id, allocations);
        const empSkills = (emp.skills || []).map(s => s.name);
        const matchingSkills = requiredSkills.filter(s => empSkills.includes(s));
        const skillScore = requiredSkills.length > 0 ? matchingSkills.length / requiredSkills.length : 0;
        const capacityScore = Math.max(0, (100 - util) / 100);
        const score = (skillScore * 0.6) + (capacityScore * 0.4);
        return { ...emp, utilization: util, matchingSkills, score, availableCapacity: 100 - util };
      })
      .filter(e => e.availableCapacity > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  };

  /** @type {any[]} */
  const recommendations = getRecommendations();

  const handleCreate = async () => {
    const employee = employees.find(e => e.id === form.employee_id);
    const project = projects.find(p => p.id === form.project_id);
    const currentUtil = getEmployeeUtilization(form.employee_id, allocations);
    
    if (currentUtil + form.allocation_pct > 100) {
      toast.warning(`This will overallocate ${employee?.full_name} to ${currentUtil + form.allocation_pct}%`);
    }

    await base44.entities.Allocation.create({
      ...form,
      employee_name: employee?.full_name || '',
      project_name: project?.name || '',
      status: 'Active',
    });
    toast.success('Allocation created');
    queryClient.invalidateQueries({ queryKey: ['allocations'] });
    setFormOpen(false);
    setForm({ employee_id: '', project_id: '', allocation_pct: 20, role_on_project: '', start_date: '', end_date: '' });
  };

  const handleDelete = async (id) => {
    await base44.entities.Allocation.delete(id);
    toast.success('Allocation removed');
    queryClient.invalidateQueries({ queryKey: ['allocations'] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resource Allocations</h1>
          <p className="text-sm text-muted-foreground mt-1">{allocations.length} active allocations</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="w-4 h-4 mr-2" />New Allocation</Button>
      </div>

      {/* Smart Matching */}
      <Card className="border-0 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Smart Staff Matching</h2>
        </div>
        <div className="flex gap-3 mb-4">
          <Select value={selectedProject} onValueChange={v => { setSelectedProject(v); setShowRecommendations(true); }}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Select a project..." /></SelectTrigger>
            <SelectContent>{activeProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {showRecommendations && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendations.map((emp, i) => (
              <motion.div key={emp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-3 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => { setForm(prev => ({ ...prev, employee_id: emp.id, project_id: selectedProject })); setFormOpen(true); }}>
                  <p className="font-medium text-sm">{emp.full_name}</p>
                  <p className="text-xs text-muted-foreground">{emp.department} · {emp.seniority}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <UtilizationBadge utilization={emp.utilization} />
                    <span className="text-xs text-muted-foreground">{emp.availableCapacity}% free</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {emp.matchingSkills.map(s => (
                      <Badge key={s} className="text-[10px] bg-primary/10 text-primary border-0">{s}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">Match score: {Math.round(emp.score * 100)}%</div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {showRecommendations && recommendations.length === 0 && selectedProject && (
          <p className="text-sm text-muted-foreground">No available employees match this project's requirements.</p>
        )}
      </Card>

      {/* Allocations Table */}
      <Card className="border-0 shadow-sm p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Allocation</TableHead>
              <TableHead>Total Utilization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(alloc => {
              const totalUtil = getEmployeeUtilization(alloc.employee_id, allocations);
              return (
                <TableRow key={alloc.id}>
                  <TableCell className="font-medium text-sm">{alloc.employee_name}</TableCell>
                  <TableCell className="text-sm">{alloc.project_name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{alloc.allocation_pct}%</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UtilizationBadge utilization={totalUtil} />
                      {totalUtil > 100 && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alloc.role_on_project || '-'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(alloc.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {allocations.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No allocations yet</p>}
      </Card>

      {/* Create Allocation Dialog */}
      <Dialog open={formOpen} onOpenChange={() => setFormOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Allocation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select value={form.employee_id} onValueChange={v => setForm(prev => ({ ...prev, employee_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{employees.filter(e => e.status === 'Active').map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.full_name} ({getEmployeeUtilization(e.id, allocations)}% used)</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={v => setForm(prev => ({ ...prev, project_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>{activeProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Allocation %</Label><Input type="number" min={5} max={100} step={5} value={form.allocation_pct} onChange={e => setForm(prev => ({ ...prev, allocation_pct: parseInt(e.target.value) || 0 }))} /></div>
            <div><Label>Role on Project</Label><Input value={form.role_on_project} onChange={e => setForm(prev => ({ ...prev, role_on_project: e.target.value }))} placeholder="e.g. Lead Developer" /></div>
            {form.employee_id && (
              <div className="p-3 rounded-lg bg-secondary/50 text-sm">
                Current utilization: <strong>{getEmployeeUtilization(form.employee_id, allocations)}%</strong>
                {' → '}After: <strong>{getEmployeeUtilization(form.employee_id, allocations) + form.allocation_pct}%</strong>
                {getEmployeeUtilization(form.employee_id, allocations) + form.allocation_pct > 100 && (
                  <span className="text-destructive ml-2 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" />Will be overallocated!</span>
                )}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.employee_id || !form.project_id}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { Allocations };
