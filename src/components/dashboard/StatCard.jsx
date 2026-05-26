import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export function StatCard({ title, value, subtitle, icon: Icon, gradient = '', delay = 0 }) {
  return (
    <div style={{ animationDelay: `${delay}s` }}>
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className={`p-4 text-white ${gradient}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs/none opacity-90">{title}</p>
              <strong className="text-2xl font-bold">{value}</strong>
              {subtitle ? <span className="mt-1 block text-[10px] opacity-90">{subtitle}</span> : null}
            </div>
            {Icon ? <Icon className="h-5 w-5 opacity-90" /> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
