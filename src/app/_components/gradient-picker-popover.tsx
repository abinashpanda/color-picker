import { cn } from '@/lib/utils'
import { ColorValue, GradientStop, GradientValue, PickerValue } from '../_types/color'
import { useCallback, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import ColorPalette, { ColorPaletteMethods } from './color-palette'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import GradientStopsSelector from './gradient-stops-selector'
import { addGradientStop, removeGradientStop, updateGradientStop } from '../_utils/color'
import ColorPreview from './color-preview'
import HexInput, { HexInputMethod } from './hex-input'

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

  const handleActiveIndexChange = useCallback(
    (updatedIndex: number) => {
      setActiveIndex(updatedIndex)
      if (value.stops[updatedIndex]) {
        const updatedColor: PickerValue = { type: 'color', ...value.stops[updatedIndex] }
        colorPalette.current?.updateColor(updatedColor)
        hexInput.current?.updateColor(updatedColor)
      }
    },
    [value],
  )

  const colorPalette = useRef<ColorPaletteMethods | null>(null)
  const hexInput = useRef<HexInputMethod | null>(null)

  const handleColorPaletteChange = useCallback(
    (colorSelected: PickerValue) => {
      if (colorSelected.type === 'color') {
        const updatedValue = updateGradientStop(value, activeIndex, {
          color: colorSelected.color,
          opacity: colorSelected.opacity,
        })
        onChange(updatedValue)
        hexInput.current?.updateColor({ type: 'color', ...updatedValue.stops[activeIndex] })
      }
    },
    [value, activeIndex, onChange],
  )

  const handleHexInputChange = useCallback(
    (colorSelected: PickerValue) => {
      if (colorSelected.type === 'color') {
        const updatedValue = updateGradientStop(value, activeIndex, {
          color: colorSelected.color,
          opacity: colorSelected.opacity,
        })
        onChange(updatedValue)
        colorPalette.current?.updateColor({ type: 'color', ...updatedValue.stops[activeIndex] })
      }
    },
    [value, activeIndex, onChange],
  )

  const handleStopAdded = useCallback(
    (stop: GradientStop) => {
      const { value: newValue, stopIndex } = addGradientStop(value, stop)
      onChange(newValue)
      handleActiveIndexChange(stopIndex)
    },
    [onChange, value, handleActiveIndexChange],
  )

  const handleStopPositionChange = useCallback(
    (position: number) => {
      const newValue = updateGradientStop(value, activeIndex, { position })
      onChange(newValue)
    },
    [onChange, value, activeIndex],
  )

  const handleStopRemoved = useCallback(
    (index: number) => {
      if (value.stops.length > 2) {
        const newValue = removeGradientStop(value, index)
        onChange(newValue)
        handleActiveIndexChange(activeIndex - 1)
      }
    },
    [value, handleActiveIndexChange],
  )

  console.log(value)

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
      <GradientStopsSelector
        value={value}
        activeIndex={activeIndex}
        onActiveIndexChange={handleActiveIndexChange}
        onStopAdded={handleStopAdded}
        onStopRemoved={handleStopRemoved}
        onStopPositionChange={handleStopPositionChange}
      />
      <ColorPalette value={activeColor} onChange={handleColorPaletteChange} ref={colorPalette} />
      <div className="flex w-auto items-center space-x-2">
        <div className="text-xs">Hex</div>
        <div className="flex items-center rounded-md border p-1">
          <ColorPreview value={activeColor} />
          <HexInput value={activeColor} onChange={handleHexInputChange} className="flex-1" ref={hexInput} />
        </div>
      </div>
    </div>
  )
}
