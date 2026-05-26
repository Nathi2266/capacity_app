function getVariantClass(variant) {
  switch (variant) {
    case 'outline':
      return 'badge--outline'
    case 'secondary':
      return 'badge--secondary'
    case 'success':
      return 'badge--success'
    case 'warning':
      return 'badge--warning'
    case 'destructive':
      return 'badge--destructive'
    case 'primary':
    default:
      return 'badge--primary'
  }
}

export function Badge({ variant = 'primary', className = '', ...props }) {
  return <span className={`badge ${getVariantClass(variant)} ${className}`.trim()} {...props} />
}
