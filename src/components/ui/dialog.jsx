import { createContext, useContext } from 'react'
import { cn } from '../../lib/utils'

const DialogContext = createContext(null)

export function Dialog({ open, onOpenChange, children }) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{open ? children : null}</DialogContext.Provider>
}

export function DialogContent({ className = '', children, ...props }) {
  const context = useContext(DialogContext)

  if (!context?.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={cn('w-full rounded-xl bg-white p-6 shadow-xl', className)}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className = '', ...props }) {
  return <div className={cn('mb-4 space-y-2', className)} {...props} />
}

export function DialogTitle({ className = '', ...props }) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}
