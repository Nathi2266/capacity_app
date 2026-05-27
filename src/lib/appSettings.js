import { useCallback, useEffect, useState } from 'react'

const SETTINGS_CHANGED_EVENT = 'capacity-app-settings-changed'

export const APP_SETTINGS_KEYS = {
  theme: 'capacity_app_theme',
  sidebarCollapsed: 'capacity_app_sidebar_collapsed',
  compactLayout: 'capacity_app_compact_layout',
  showNotificationBadge: 'capacity_app_show_notification_badge',
  enableAnimations: 'capacity_app_enable_animations',
  tableDensity: 'capacity_app_table_density',
  defaultLandingPage: 'capacity_app_default_landing_page',
  notificationSortOrder: 'capacity_app_notification_sort_order',
  persistFilters: 'capacity_app_persist_filters',
  autoRefreshInterval: 'capacity_app_auto_refresh_interval',
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

function notifySettingsChanged() {
  if (typeof window === 'undefined') {
    return
  }
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT))
}

export function getStoredValue(key, defaultValue = '') {
  const storage = getStorage()
  if (!storage) {
    return defaultValue
  }

  const storedValue = storage.getItem(key)
  return storedValue ?? defaultValue
}

export function setStoredValue(key, value) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  if (value === null || value === undefined) {
    storage.removeItem(key)
  } else {
    storage.setItem(key, String(value))
  }

  notifySettingsChanged()
}

export function getBooleanSetting(key, defaultValue = false) {
  return getStoredValue(key, defaultValue ? 'true' : 'false') === 'true'
}

export function setBooleanSetting(key, value) {
  setStoredValue(key, value ? 'true' : 'false')
}

/**
 * @param {string} key
 * @param {string} [defaultValue='']
 * @returns {[string, (nextValue: string | ((current: string) => string)) => void]}
 */
export function useStoredValue(key, defaultValue = '') {
  const [value, setValue] = useState(() => getStoredValue(key, defaultValue))

  useEffect(() => {
    const syncValue = () => {
      setValue(getStoredValue(key, defaultValue))
    }

    window.addEventListener(SETTINGS_CHANGED_EVENT, syncValue)
    window.addEventListener('storage', syncValue)
    syncValue()

    return () => {
      window.removeEventListener(SETTINGS_CHANGED_EVENT, syncValue)
      window.removeEventListener('storage', syncValue)
    }
  }, [defaultValue, key])

  const updateValue = useCallback((nextValue) => {
    const resolvedValue = typeof nextValue === 'function' ? nextValue(getStoredValue(key, defaultValue)) : nextValue
    setStoredValue(key, resolvedValue)
    setValue(String(resolvedValue))
  }, [defaultValue, key])

  return [value, updateValue]
}

/**
 * @param {string} key
 * @param {boolean} [defaultValue=false]
 * @returns {[boolean, (nextValue: boolean | ((current: boolean) => boolean)) => void]}
 */
export function useBooleanSetting(key, defaultValue = false) {
  const [value, setValue] = useState(() => getBooleanSetting(key, defaultValue))

  useEffect(() => {
    const syncValue = () => {
      setValue(getBooleanSetting(key, defaultValue))
    }

    window.addEventListener(SETTINGS_CHANGED_EVENT, syncValue)
    window.addEventListener('storage', syncValue)
    syncValue()

    return () => {
      window.removeEventListener(SETTINGS_CHANGED_EVENT, syncValue)
      window.removeEventListener('storage', syncValue)
    }
  }, [defaultValue, key])

  const updateValue = useCallback((nextValue) => {
    const resolvedValue = typeof nextValue === 'function' ? nextValue(getBooleanSetting(key, defaultValue)) : nextValue
    setBooleanSetting(key, resolvedValue)
    setValue(Boolean(resolvedValue))
  }, [defaultValue, key])

  return [value, updateValue]
}

/**
 * @param {string} key
 * @param {string} [defaultValue='']
 * @param {boolean} [enabled=true]
 * @returns {[string, (nextValue: string | ((current: string) => string)) => void]}
 */
export function useOptionalStoredValue(key, defaultValue = '', enabled = true) {
  const [value, setValue] = useState(() => (enabled ? getStoredValue(key, defaultValue) : defaultValue))

  useEffect(() => {
    setValue(enabled ? getStoredValue(key, defaultValue) : defaultValue)
  }, [defaultValue, enabled, key])

  const updateValue = useCallback((nextValue) => {
    const resolvedValue = typeof nextValue === 'function' ? nextValue(value) : nextValue
    setValue(String(resolvedValue))
    if (enabled) {
      setStoredValue(key, resolvedValue)
    }
  }, [enabled, key, value])

  return [value, updateValue]
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function applyAnimationsEnabled(enabled) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.animations = enabled ? 'on' : 'off'
}

export function applyTableDensity(density) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.tableDensity = density || 'comfortable'
}
