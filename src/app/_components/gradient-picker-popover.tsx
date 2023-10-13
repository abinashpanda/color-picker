import { cn } from '@/lib/utils'
import { ColorValue, GradientStop, GradientValue, PickerValue } from '../_types/color'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import ColorPalette from './color-palette'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import GradientStopsSelector from './gradient-stops-selector'

type GradientPickerPopoverProps = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  className?: string
  style?: React.CSSProperties
}

const GRADIENT_TYPE_OPTIONS: Record<GradientValue['gradientType'], string> = {
  linear: 'Linear',
  radial: 'Radial',
}
const GRADIENT_TYPES_ORDER: GradientValue['gradientType'][] = ['linear', 'radial']

export default function GradientPickerPopover({ value, onChange, className, style }: GradientPickerPopoverProps) {
  invariant(value.type === 'gradient', 'GradientPickerPopover must be used with a gradient value')

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const activeColor: ColorValue = { type: 'color', ...value.stops[activeIndex] }

  return (
    <div className={cn('w-[200px] space-y-2', className)} style={style}>
      <Select value={value.gradientType}>
        <SelectTrigger>
          <SelectValue placeholder="Gradient Type"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {GRADIENT_TYPES_ORDER.map((type) => {
            return (
              <SelectItem key={type} value={type}>
                {GRADIENT_TYPE_OPTIONS[type]}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <ColorPalette value={activeColor} onChange={() => {}} />
      <GradientStopsSelector
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        value={value}
        onChange={() => {}}
      />
    </div>
  )
}
