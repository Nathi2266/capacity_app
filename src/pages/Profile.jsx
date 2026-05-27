import React from 'react'
import { Camera, Mail, MapPin, Phone, Shield, Clock3, BadgeInfo, Link2, UserRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/lib/AuthContext'
import { getInitialProfile, useProfile } from '@/lib/profile'

const TIMEZONES = [
  'Africa/Johannesburg',
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Kolkata',
]

const SENIORITIES = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead', 'Staff', 'Principal']
const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
const ONBOARDING_STATUSES = ['In Progress', 'Complete', 'Needs Review']

function FieldBlock({ icon: Icon, label, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}

function ProfileHeader({ profile }) {
  const initials = (profile.full_name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your personal details, work profile, and contact information up to date.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-medium">
          Profile completeness
        </Badge>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{initials}</Badge>
      </div>
    </div>
  )
}

function CompletionMeter({ profile }) {
  const fields = [
    profile.full_name,
    profile.email,
    profile.role,
    profile.job_title,
    profile.department,
    profile.phone,
    profile.location,
    profile.bio,
    profile.skills_summary,
    profile.linkedin,
    profile.github,
    profile.website,
    profile.emergency_name,
    profile.emergency_phone,
  ]
  const completed = fields.filter(Boolean).length
  const percent = Math.round((completed / fields.length) * 100)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Profile progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Complete {completed} of {fields.length} sections</span>
          <span className="font-semibold text-foreground">{percent}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useProfile(user)

  React.useEffect(() => {
    setProfile((current) => getInitialProfile({ ...user, ...current }))
  }, [setProfile, user])

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSave = () => {
    toast.success('Profile saved')
  }

  const handlePictureUploadSoon = () => {
    toast('Profile photo upload is coming soon')
  }

  const avatarLabel = profile.avatar_url ? 'Current image' : 'No image uploaded'

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileHeader profile={profile} />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Profile picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/40">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile avatar"
                    className="h-full w-full rounded-3xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <UserRound className="h-8 w-8 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Upload soon</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-foreground">Avatar upload</p>
                  <p className="text-xs text-muted-foreground">
                    Image upload will be wired later. For now the placeholder keeps the layout ready.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" onClick={handlePictureUploadSoon}>
                    <Camera className="mr-2 h-4 w-4" />
                    Upload photo
                  </Button>
                  <Badge variant="outline">{avatarLabel}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CompletionMeter profile={profile} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FieldBlock icon={UserRound} label="Full name">
              <Input value={profile.full_name} onChange={(e) => updateField('full_name', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Mail} label="Email">
              <Input value={profile.email} onChange={(e) => updateField('email', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Shield} label="Role">
              <Input value={profile.role} onChange={(e) => updateField('role', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Job title">
              <Input value={profile.job_title} onChange={(e) => updateField('job_title', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Department">
              <Input value={profile.department} onChange={(e) => updateField('department', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Seniority">
              <Select value={profile.seniority} onValueChange={(value) => updateField('seniority', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SENIORITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldBlock>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Contact and work</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FieldBlock icon={Phone} label="Phone">
              <Input value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={MapPin} label="Location">
              <Input value={profile.location} onChange={(e) => updateField('location', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Clock3} label="Timezone">
              <Select value={profile.timezone} onValueChange={(value) => updateField('timezone', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldBlock>
            <FieldBlock icon={Shield} label="Work mode">
              <Select value={profile.work_mode} onValueChange={(value) => updateField('work_mode', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldBlock>
            <FieldBlock icon={Shield} label="Manager">
              <Input value={profile.manager_name} onChange={(e) => updateField('manager_name', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Clock3} label="Preferred hours">
              <Input value={profile.preferred_hours} onChange={(e) => updateField('preferred_hours', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Shield} label="Onboarding status">
              <Select value={profile.onboarding_status} onValueChange={(value) => updateField('onboarding_status', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ONBOARDING_STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Pronouns">
              <Input value={profile.pronouns} onChange={(e) => updateField('pronouns', e.target.value)} />
            </FieldBlock>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">About you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldBlock icon={BadgeInfo} label="Bio">
              <Textarea
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Write a short introduction for your team..."
                className="min-h-[120px]"
              />
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Skills summary">
              <Textarea
                value={profile.skills_summary}
                onChange={(e) => updateField('skills_summary', e.target.value)}
                placeholder="Summarize your technical strengths..."
                className="min-h-[100px]"
              />
            </FieldBlock>
            <FieldBlock icon={BadgeInfo} label="Focus areas">
              <Textarea
                value={profile.focus_areas}
                onChange={(e) => updateField('focus_areas', e.target.value)}
                placeholder="What types of work do you want more of?"
                className="min-h-[100px]"
              />
            </FieldBlock>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Links and emergency contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldBlock icon={Link2} label="LinkedIn">
              <Input value={profile.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Link2} label="GitHub">
              <Input value={profile.github} onChange={(e) => updateField('github', e.target.value)} />
            </FieldBlock>
            <FieldBlock icon={Link2} label="Website">
              <Input value={profile.website} onChange={(e) => updateField('website', e.target.value)} />
            </FieldBlock>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldBlock icon={Phone} label="Emergency contact">
                <Input value={profile.emergency_name} onChange={(e) => updateField('emergency_name', e.target.value)} />
              </FieldBlock>
              <FieldBlock icon={Phone} label="Emergency phone">
                <Input value={profile.emergency_phone} onChange={(e) => updateField('emergency_phone', e.target.value)} />
              </FieldBlock>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Badge variant="outline" className="font-medium">
          Image upload coming soon
        </Badge>
        <Button type="button" variant="outline" onClick={handlePictureUploadSoon}>
          Save avatar placeholder
        </Button>
        <Button type="button" onClick={handleSave}>
          Save profile
        </Button>
      </div>
    </div>
  )
}

export { Profile }
