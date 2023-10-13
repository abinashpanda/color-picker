'use client'

import { PickerValue } from '../_types/color'
import { cn } from '@/lib/utils'
import { useCallback, useRef } from 'react'
import ColorPalette, { ColorPaletteMethods } from './color-palette'
import HexInput, { HexInputMethod } from './hex-input'
import ColorPreview from './color-preview'

type ColorPickerPopoverProps = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  className?: string
  style?: React.CSSProperties
}

export default function ColorPickerPopover({ value, onChange, className, style }: ColorPickerPopoverProps) {
  const colorPalette = useRef<ColorPaletteMethods | null>(null)
  const hexInput = useRef<HexInputMethod | null>(null)

  const handleHexInputChange = useCallback(
    (updatedValue: PickerValue) => {
      onChange(updatedValue)
      colorPalette.current?.updateColor(updatedValue)
    },
    [onChange],
  )

  const handleColorPaletteChange = useCallback(
    (updatedValue: PickerValue) => {
      onChange(updatedValue)
      hexInput.current?.updateColor(updatedValue)
    },
    [onChange],
  )

  return (
    <div className={cn('w-[200px] space-y-2', className)} style={style}>
      <ColorPalette value={value} onChange={handleColorPaletteChange} ref={colorPalette} />
      <div className="flex w-auto items-center space-x-2">
        <div className="text-xs">Hex</div>
        <div className="flex items-center rounded-md border p-1">
          <ColorPreview value={value} />
          <HexInput value={value} onChange={handleHexInputChange} className="flex-1" ref={hexInput} />
        </div>
      </div>
    </div>
  )
}
