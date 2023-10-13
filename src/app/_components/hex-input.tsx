import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Color from 'color'
import { PickerValue } from '../_types/color'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import invariant from 'tiny-invariant'

function fixHexColor(color: string): string {
  // Remove the '#' if it exists
  if (color.startsWith('#')) {
    color = color.substr(1)
  }

  // Pad or trim to a valid length
  if (color.length > 6) {
    color = color.substr(0, 6)
  } else if (color.length < 6 && color.length !== 3) {
    color = color.padEnd(6, '0')
  } else if (color.length > 3 && color.length < 6) {
    color = color.substr(0, 3)
  }

  // Replace invalid characters with the nearest valid hex character
  color = color
    .split('')
    .map((char) => {
      if ('0123456789abcdefABCDEF'.includes(char)) {
        return char
      }

      // Find the closest valid hex character
      const hexChars = '0123456789abcdef'
      const index = hexChars.split('').reduce((prev, curr) => {
        return Math.abs(curr.charCodeAt(0) - char.charCodeAt(0)) < Math.abs(prev.charCodeAt(0) - char.charCodeAt(0))
          ? curr
          : prev
      })

      return index
    })
    .join('')

  // If we were working with a short 3-character color, ensure it remains short
  if (color.length === 3) {
    return `#${color}`
  }

  // Expand 3-character color to 6 characters
  if (color.length === 3) {
    color = color
      .split('')
      .map((char) => char + char)
      .join('')
  }

  return `#${color}`
}

const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

const validationSchema = z.object({
  value: z.string(),
  opacity: z.number(),
})

type HexInputProps = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  className?: string
  style?: React.CSSProperties
}

export default function HexInput({ value, onChange, className, style }: HexInputProps) {
  invariant(value.type === 'color', 'HexInput only supports color type')

  const colorValue = Color(value.color).hex().toString()
  const opacity = value.opacity

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      value: Color(value.color).hex().toString(),
      opacity: value.opacity,
    },
  })
  const formElement = useRef<HTMLFormElement | null>(null)

  useEffect(
    function updateColorFieldOnPropChange() {
      form.setValue('value', colorValue)
      form.setValue('opacity', opacity)
    },
    [colorValue, opacity],
  )

  return (
    <form
      ref={formElement}
      onSubmit={form.handleSubmit(({ value: submittedColorValue, opacity }) => {
        const updatedColorValue = fixHexColor(submittedColorValue)
        const updatedOpacity = clamp(opacity, 0, 100)

        form.setValue('value', updatedColorValue)
        form.setValue('opacity', updatedOpacity)

        onChange({ ...value, color: updatedColorValue, opacity: updatedOpacity })
      })}
      className={cn('grid grid-cols-3 items-center divide-x', className)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          formElement.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
        }
      }}
    >
      <div className="col-span-2 px-2">
        <input className="block w-full min-w-0 text-xs focus-visible:outline-none" {...form.register('value')} />
      </div>
      <div className="col-span-1 px-2">
        <input
          className="block w-full min-w-0 text-xs focus-visible:outline-none"
          type="number"
          min={0}
          max={100}
          {...form.register('opacity', { valueAsNumber: true })}
        />
      </div>
    </form>
  )
}
