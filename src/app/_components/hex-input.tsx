import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Color from 'color'
import { PickerValue } from '../_types/color'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import invariant from 'tiny-invariant'
import { clamp, fixHexColor } from '../_utils/color'

const validationSchema = z.object({
  value: z.string(),
  opacity: z.number(),
})

export type HexInputProps = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  className?: string
  style?: React.CSSProperties
}

export type HexInputMethod = {
  updateColor: (value: PickerValue) => void
}

const HexInput = forwardRef<HexInputMethod, HexInputProps>(({ value, onChange, className, style }, ref) => {
  invariant(value.type === 'color', 'HexInput only supports color type')

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      value: Color(value.color).hex().toString(),
      opacity: value.opacity,
    },
  })
  const formElement = useRef<HTMLFormElement | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      updateColor: (value) => {
        if (value.type === 'color') {
          const colorValue = Color(value.color).hex().toString()
          form.setValue('value', colorValue)
          form.setValue('opacity', value.opacity)
        }
      },
    }),
    [],
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
      style={style}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          // trigger submit event on pressing enter
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
})

HexInput.displayName = 'HexInput'
export default HexInput
