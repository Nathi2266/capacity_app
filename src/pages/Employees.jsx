import React, { useState } from 'react';
import { useEmployees, useAllocations, getEmployeeUtilization } from '@/lib/useAllocations';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import UtilizationBadge from '@/components/shared/UtilizationBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DEPARTMENTS = ['All', 'Frontend Engineering', 'Backend Engineering', 'Full Stack Engineering', 'QA', 'DevOps', 'UX/UI', 'Product Management', 'Data Engineering', 'AI/ML', 'Security'];

export default function Employees() {
  const { data: employees } = useEmployees();
  const { data: allocations } = useAllocations();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = employees.filter(e => {
    const matchSearch = e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      (e.skills || []).some(s => s.name?.toLowerCase().includes(search.toLowerCase()));
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const handleSave = async (data) => {
    if (editing) {
      await base44.entities.Employee.update(editing.id, data);
      toast.success('Employee updated');
    } else {
      await base44.entities.Employee.create(data);
      toast.success('Employee created');
    }
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.Employee.delete(id);
    toast.success('Employee deleted');
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">{employees.length} team members</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Employee
        </Button>
      </div>

      <Card className="border-0 shadow-sm p-4">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or skill..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Seniority</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp, i) => {
              const util = getEmployeeUtilization(emp.id, allocations);
              return (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{emp.full_name}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{emp.department}</TableCell>
                  <TableCell className="text-sm">{emp.role}</TableCell>
                  <TableCell className="text-sm">{emp.seniority}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(emp.skills || []).slice(0, 3).map(s => (
                        <Badge key={s.name} variant="secondary" className="text-[10px]">{s.name}</Badge>
                      ))}
                      {(emp.skills || []).length > 3 && (
                        <Badge variant="outline" className="text-[10px]">+{emp.skills.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><UtilizationBadge utilization={util} /></TableCell>
                  <TableCell><StatusBadge status={emp.status || 'Active'} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(emp); setFormOpen(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(emp.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No employees found</p>
          </div>
        )}
      </Card>

      <EmployeeForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={handleSave} employee={editing} />
    </div>
  );
}

export { Employees };
