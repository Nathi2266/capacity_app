import { cloneElement, createContext, isValidElement, useContext, useMemo, useState } from 'react'

const TooltipContext = createContext(null)

export function TooltipProvider({ children, delayDuration, ...props }) {
  void delayDuration
  void props
  return children
}

export function Tooltip({ children }) {
  const [open, setOpen] = useState(false)

  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <TooltipContext.Provider value={value}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ asChild = false, children }) {
  const context = useContext(TooltipContext)

  const handlers = context
    ? {
        onMouseEnter: () => context.setOpen(true),
        onMouseLeave: () => context.setOpen(false),
        onFocus: () => context.setOpen(true),
        onBlur: () => context.setOpen(false),
      }
    : {}

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...handlers,
      ...children.props,
    })
  }

  return (
    <span {...handlers} className="inline-flex">
      {children}
    </span>
  )
}

export function TooltipContent({ side = 'right', className = '', children }) {
  const context = useContext(TooltipContext)

  if (!context?.open) {
    return null
  }

  const positionClass =
    side === 'right'
      ? 'left-full top-1/2 ml-2 -translate-y-1/2'
      : side === 'left'
        ? 'right-full top-1/2 mr-2 -translate-y-1/2'
        : side === 'top'
          ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
          : 'left-1/2 top-full mt-2 -translate-x-1/2'

  return (
    <div
      role="tooltip"
      className={[
        'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md',
        positionClass,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
