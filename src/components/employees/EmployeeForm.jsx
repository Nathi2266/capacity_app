import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DEPARTMENTS = [
  'Frontend Engineering',
  'Backend Engineering',
  'Full Stack Engineering',
  'QA',
  'DevOps',
  'UX/UI',
  'Product Management',
  'Data Engineering',
  'AI/ML',
  'Security',
]
const ROLES = ['Admin', 'Delivery Manager', 'Team Lead', 'Employee']
const SENIORITY = ['Junior', 'Mid', 'Senior', 'Staff', 'Principal', 'Lead']
const EMP_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance']
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
  'Swift',
  'GraphQL',
  'Redis',
]
const PROFICIENCY = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

function EmployeeForm({ open, onClose, onSave, employee }) {
  const [form, setForm] = useState(
    employee || {
      full_name: '',
      email: '',
      phone: '',
      employee_id: '',
      department: '',
      role: 'Employee',
      seniority: 'Mid',
      skills: [],
      years_experience: 0,
      availability_pct: 100,
      employment_type: 'Full-time',
      location: '',
      status: 'Active',
    },
  )
  const [newSkill, setNewSkill] = useState('')
  const [newProficiency, setNewProficiency] = useState('Intermediate')

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const addSkill = () => {
    if (!newSkill) return
    const exists = form.skills?.some((skill) => skill.name === newSkill)
    if (exists) return
    update('skills', [...(form.skills || []), { name: newSkill, proficiency: newProficiency }])
    setNewSkill('')
  }

  const removeSkill = (name) => {
    update(
      'skills',
      (form.skills || []).filter((skill) => skill.name !== name),
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={(event) => update('full_name', event.target.value)} required />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone || ''} onChange={(event) => update('phone', event.target.value)} />
            </div>
            <div>
              <Label>Employee ID</Label>
              <Input value={form.employee_id || ''} onChange={(event) => update('employee_id', event.target.value)} />
            </div>
            <div>
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={(value) => update('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(value) => update('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Seniority</Label>
              <Select value={form.seniority} onValueChange={(value) => update('seniority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENIORITY.map((seniority) => (
                    <SelectItem key={seniority} value={seniority}>
                      {seniority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Employment Type</Label>
              <Select value={form.employment_type} onValueChange={(value) => update('employment_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMP_TYPES.map((employmentType) => (
                    <SelectItem key={employmentType} value={employmentType}>
                      {employmentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Years Experience</Label>
              <Input
                type="number"
                value={form.years_experience || 0}
                onChange={(event) => update('years_experience', parseInt(event.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location || ''} onChange={(event) => update('location', event.target.value)} />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Skills</Label>
            <div className="mb-2 flex gap-2">
              <Select value={newSkill} onValueChange={setNewSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SKILLS.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newProficiency} onValueChange={setNewProficiency}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY.map((proficiency) => (
                    <SelectItem key={proficiency} value={proficiency}>
                      {proficiency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(form.skills || []).map((skill) => (
                <Badge key={skill.name} variant="secondary" className="gap-1 pr-1">
                  {skill.name} ({skill.proficiency})
                  <button type="button" onClick={() => removeSkill(skill.name)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{employee ? 'Update' : 'Create'} Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeForm
export { EmployeeForm }
export function EmployeeForm() {
  return <div className="card">Employee form dialog placeholder</div>
}
