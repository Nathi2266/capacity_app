import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const STATUSES = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const PHASES = ['Discovery', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance']
const ALL_SKILLS = [
  'React',
  'Angular',
  'Vue',
  'Node.js',
  'Java',
  'Python',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'Flutter',
  'Figma',
  'Selenium',
  'Cypress',
  'TypeScript',
  'Go',
  'Ruby',
  'GraphQL',
]

export function ProjectForm({ open, onClose, onSave, project }) {
  const [form, setForm] = useState(
    project || {
      name: '',
      client_name: '',
      project_manager: '',
      start_date: '',
      end_date: '',
      status: 'Planning',
      budget: 0,
      priority: 'Medium',
      required_skills: [],
      capacity_demand_pct: 0,
      delivery_phase: 'Discovery',
      description: '',
    }
  )
  const [newSkill, setNewSkill] = useState('')

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const addSkill = () => {
    if (!newSkill || form.required_skills?.includes(newSkill)) return
    update('required_skills', [...(form.required_skills || []), newSkill])
    setNewSkill('')
  }

  const removeSkill = (skill) => update('required_skills', form.required_skills.filter((s) => s !== skill))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Project Name *</Label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div>
              <Label>Client</Label>
              <Input value={form.client_name || ''} onChange={(e) => update('client_name', e.target.value)} />
            </div>
            <div>
              <Label>Project Manager</Label>
              <Input value={form.project_manager || ''} onChange={(e) => update('project_manager', e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => update('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date || ''} onChange={(e) => update('start_date', e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.end_date || ''} onChange={(e) => update('end_date', e.target.value)} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => update('priority', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery Phase</Label>
              <Select value={form.delivery_phase} onValueChange={(v) => update('delivery_phase', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{PHASES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Budget</Label>
              <Input type="number" value={form.budget || 0} onChange={(e) => update('budget', parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Capacity Demand %</Label>
              <Input type="number" value={form.capacity_demand_pct || 0} onChange={(e) => update('capacity_demand_pct', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} rows={3} />
          </div>

          <div>
            <Label className="mb-2 block">Required Skills</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newSkill} onValueChange={setNewSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>{ALL_SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(form.required_skills || []).map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{project ? 'Update' : 'Create'} Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectForm
