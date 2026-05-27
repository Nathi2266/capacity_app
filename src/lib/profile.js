import { useCallback, useEffect, useState } from 'react'

const PROFILE_STORAGE_KEY = 'capacity_app_profile'
const PROFILE_CHANGED_EVENT = 'capacity-app-profile-changed'

export const DEFAULT_PROFILE = {
  avatar_url: '',
  full_name: '',
  email: '',
  role: '',
  job_title: '',
  department: '',
  seniority: '',
  phone: '',
  location: '',
  timezone: 'Africa/Johannesburg',
  work_mode: 'Hybrid',
  manager_name: '',
  preferred_hours: '08:00 - 17:00',
  bio: '',
  skills_summary: '',
  focus_areas: '',
  linkedin: '',
  github: '',
  website: '',
  emergency_name: '',
  emergency_phone: '',
  onboarding_status: 'In Progress',
  pronouns: '',
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function parseProfile(value) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function notifyProfileChanged() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT))
}

export function getStoredProfile() {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  return parseProfile(storage.getItem(PROFILE_STORAGE_KEY))
}

export function setStoredProfile(profile) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  notifyProfileChanged()
}

export function mergeProfile(baseProfile, overrideProfile = {}) {
  return {
    ...DEFAULT_PROFILE,
    ...baseProfile,
    ...overrideProfile,
  }
}

export function getInitialProfile(user) {
  return mergeProfile(
    {
      full_name: user?.full_name || '',
      email: user?.email || '',
      role: user?.role || '',
    },
    getStoredProfile() || {},
  )
}

export function useProfile(user) {
  const [profile, setProfile] = useState(() => getInitialProfile(user))

  useEffect(() => {
    const syncProfile = () => {
      setProfile(getInitialProfile(user))
    }

    window.addEventListener(PROFILE_CHANGED_EVENT, syncProfile)
    window.addEventListener('storage', syncProfile)
    syncProfile()

    return () => {
      window.removeEventListener(PROFILE_CHANGED_EVENT, syncProfile)
      window.removeEventListener('storage', syncProfile)
    }
  }, [user])

  const updateProfile = useCallback((nextValue) => {
    setProfile((current) => {
      const resolvedValue = typeof nextValue === 'function' ? nextValue(current) : nextValue
      const mergedProfile = mergeProfile(current, resolvedValue)
      setStoredProfile(mergedProfile)
      return mergedProfile
    })
  }, [])

  return [profile, updateProfile]
}
