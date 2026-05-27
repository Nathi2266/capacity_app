import React from 'react'
import {
  APP_SETTINGS_KEYS,
  applyAnimationsEnabled,
  applyTableDensity,
  applyTheme,
  useBooleanSetting,
  useStoredValue,
} from '@/lib/appSettings'

export default function AppPreferencesSync() {
  const [theme] = useStoredValue(APP_SETTINGS_KEYS.theme, 'light')
  const [animationsEnabled] = useBooleanSetting(APP_SETTINGS_KEYS.enableAnimations, true)
  const [tableDensity] = useStoredValue(APP_SETTINGS_KEYS.tableDensity, 'comfortable')

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  React.useEffect(() => {
    applyAnimationsEnabled(animationsEnabled)
  }, [animationsEnabled])

  React.useEffect(() => {
    applyTableDensity(tableDensity)
  }, [tableDensity])

  return null
}
