import { Children, createContext, useContext, useMemo } from 'react'
import { cn } from '../../lib/utils'

const SelectContext = createContext(null)

function collectOptions(children) {
  const options = []

  Children.forEach(children, (child) => {
    if (!child) return
    if (child.type === SelectContent) {
      Children.forEach(child.props.children, (item) => {
        if (item?.type === SelectItem) {
          options.push({ value: item.props.value, label: item.props.children })
        }
      })
    }
  })

  return options
}

export function Select({ value, onValueChange, children }) {
  const options = useMemo(() => collectOptions(children), [children])

  return (
    <SelectContext.Provider value={{ value, onValueChange, options }}>
      <div className="grid gap-1">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className = '', children, ...props }) {
  const context = useContext(SelectContext)
  const placeholder = children?.props?.placeholder || 'Select'

  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary',
        className,
      )}
      value={context?.value ?? ''}
      onChange={(event) => context?.onValueChange?.(event.target.value)}
      {...props}
    >
      <option value="">{placeholder}</option>
      {(context?.options || []).map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function SelectValue({ placeholder = 'Select' }) {
  return <span>{placeholder}</span>
}

export function SelectContent({ children }) {
  return null
}

export function SelectItem({ value, children }) {
  return null
}
