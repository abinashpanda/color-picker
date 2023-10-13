import invariant from 'tiny-invariant'
import { PickerValue } from '../_types/color'
import { createGradientStringFromValue } from '../_utils/color'
import { cn } from '@/lib/utils'

type GradientPreviewProps = {
  value: PickerValue
  className?: string
  style?: React.CSSProperties
}

export default function GradientPreview({ value, className, style = {} }: GradientPreviewProps) {
  invariant(value.type === 'gradient', 'GradientPreview must be used with a gradient value')

  const gradient = createGradientStringFromValue(value)

  return <div className={cn('aspect-square h-4 border')} style={{ backgroundImage: gradient, ...style }} />
}
