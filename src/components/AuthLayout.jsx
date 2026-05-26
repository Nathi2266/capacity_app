import React from 'react';

export default function AuthLayout({ icon: Icon, title, subtitle, footer = null, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            {Icon ? (
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            ) : null}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
          </div>

          <div>{children}</div>

          {footer ? <div className="text-center text-sm pt-2">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
