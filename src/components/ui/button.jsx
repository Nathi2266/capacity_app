import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-primary text-white hover:opacity-90',
  outline: 'border border-gray-300 bg-white text-foreground hover:bg-gray-50',
  ghost: 'bg-transparent text-foreground hover:bg-secondary hover:text-foreground',
}

const sizes = {
  sm: 'h-9 px-3',
  default: 'h-10 px-4 py-2',
  icon: 'h-10 w-10 p-0',
}

export function Button({ className = '', variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-50',
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className,
      )}
      {...props}
    />
  )
}
