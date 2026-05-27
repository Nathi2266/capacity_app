import React, { useState } from 'react';
import { useProjects, useAllocations } from '@/lib/useAllocations';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, Users, Calendar } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import ProjectForm from '@/components/projects/ProjectForm';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { APP_SETTINGS_KEYS, useBooleanSetting, useOptionalStoredValue } from '@/lib/appSettings';

const STATUS_OPTIONS = ['All', 'Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'];

export default function Projects() {
  const { data: projects } = useProjects();
  const { data: allocations } = useAllocations();
  const queryClient = useQueryClient();
  const [persistFilters] = useBooleanSetting(APP_SETTINGS_KEYS.persistFilters, true);
  const [search, setSearch] = useOptionalStoredValue('capacity_app_projects_search', '', persistFilters);
  const [statusFilter, setStatusFilter] = useOptionalStoredValue('capacity_app_projects_status', 'All', persistFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = projects.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getProjectTeamSize = (projectId) => {
    return new Set(allocations.filter(a => a.project_id === projectId).map(a => a.employee_id)).size;
  };

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Project.update(editing.id, data);
      toast.success('Project updated');
    } else {
      await base44.entities.Project.create(data);
      toast.success('Project created');
    }
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.Project.delete(id);
    toast.success('Project deleted');
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />New Project
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                  {project.client_name && <p className="text-xs text-muted-foreground mt-0.5">{project.client_name}</p>}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(project); setFormOpen(true); }}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority || 'Medium'} />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{getProjectTeamSize(project.id)} members</span>
                {project.start_date && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(project.start_date), 'MMM d, yyyy')}</span>
                )}
              </div>

              {(project.required_skills || []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.required_skills.slice(0, 4).map(s => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                  {project.required_skills.length > 4 && (
                    <Badge variant="outline" className="text-[10px]">+{project.required_skills.length - 4}</Badge>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No projects found</p>
        </div>
      )}

      <ProjectForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={handleSave} project={editing} />
    </div>
  );
}

export { Projects };
