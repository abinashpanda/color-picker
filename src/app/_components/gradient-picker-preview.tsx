import invariant from 'tiny-invariant'
import { PickerValue } from '../_types/color'
import { cn } from '@/lib/utils'
import GradientPreview from './gradient-preview'
import { match } from 'ts-pattern'

type GradientPickerPreviewProps = {
  value: PickerValue
  className?: string
  style?: React.CSSProperties
}

export default function GradientPickerPreview({ value, className, style }: GradientPickerPreviewProps) {
  invariant(value.type === 'gradient', 'GradientPickerPreview must be used with a gradient value')

  return (
    <div className={cn('flex items-center space-x-2', className)} style={style}>
      <GradientPreview value={value} />
      <div className="text-xs">
        {match(value)
          .returnType<string>()
          .with({ gradientType: 'linear' }, () => 'Linear')
          .with({ gradientType: 'radial' }, () => 'Gradient')
          .exhaustive()}
      </div>
    </div>
  )
}
