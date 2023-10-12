'use client'

import { cn } from '@/lib/utils'
import { P, match } from 'ts-pattern'
import { Value } from '../_types/color'
import Color from 'color'

type ColorPickerProps = {
  value: Value
  onChange: (value: Value) => void
  className?: string
  style?: React.CSSProperties
}

export default function ColorPicker({ value, onChange, className, style }: ColorPickerProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center space-x-2 rounded border p-1 focus-within:ring-1 focus-within:ring-ring',
        className,
      )}
      style={style}
    >
      {match(value)
        .with({ type: 'color' }, ({ value }) => {
          return (
            <>
              <div className="h-4 w-4 flex-shrink-0 bg-current" style={{ color: value }}></div>
              <input
                className="min-w-0 flex-1 text-xs text-muted-foreground focus-visible:outline-none"
                value={Color(value).hex().toString()}
                onChange={() => {}}
              />
            </>
          )
        })
        .with(P._, () => null)
        .exhaustive()}
    </div>
  )
}
