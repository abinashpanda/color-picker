import invariant from 'tiny-invariant'
import { PickerValue } from '../_types/color'
import ColorPreview from './color-preview'

type ColorPickerPreviewProps = {
  value: PickerValue
  className?: string
  style?: React.CSSProperties
}

export default function ColorPickerPreview({ value, className, style }: ColorPickerPreviewProps) {
  invariant(value.type === 'color', 'ColorPickerPreview only supports color type')

  return (
    <div className="flex w-full items-center">
      <ColorPreview value={value} />
      <div className="flex-1 px-2 text-left text-xs">{value.color}</div>
      <div className="border-l px-2 text-xs">{value.opacity}%</div>
    </div>
  )
}
