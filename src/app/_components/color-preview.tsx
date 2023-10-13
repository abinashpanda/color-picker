import { cn } from '@/lib/utils'
import { PickerValue } from '../_types/color'
import Color from 'color'
import invariant from 'tiny-invariant'

type ColorPreviewProps = {
  value: PickerValue
  className?: string
  style?: React.CSSProperties
}

export default function ColorPreview({ value, className, style }: ColorPreviewProps) {
  invariant(value.type === 'color', 'ColorPreview only supports color type')

  return (
    <div className={cn('flex aspect-square h-4 border', className)} style={style}>
      <div
        className="flex-1 bg-current"
        style={{
          color: value.color,
        }}
      />
      <div
        className="relative flex-1"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center',
          backgroundSize: '50%',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: value.color,
            opacity: value.opacity / 100,
          }}
        />
      </div>
    </div>
  )
}
