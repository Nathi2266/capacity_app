import React from 'react';

export function InputOTP({ value = '', onChange, maxLength = 6, children, className = '', ...props }) {
  const slots = React.Children.toArray(children);
  const digits = String(value || '').slice(0, maxLength).split('');

  const handleChange = (event) => {
    onChange?.(event.target.value.replace(/\D/g, '').slice(0, maxLength));
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <input
        {...props}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
        pattern="\d*"
        maxLength={maxLength}
        className="sr-only"
      />
      {slots.map((slot, index) =>
        React.cloneElement(slot, {
          value: digits[index] || '',
          key: index,
        }),
      )}
    </div>
  );
}

export function InputOTPGroup({ children, className = '', ...props }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function InputOTPSlot({ value = '', index, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`h-12 w-12 rounded-md border border-border bg-background flex items-center justify-center text-sm font-medium ${className}`.trim()}
    >
      {value}
    </div>
  );
}
