import Color from 'color'
import { ColorValue, GradientValue, ImageValue, PickerValue } from '../_types/color'

export function createInitialColorValue(value?: string): ColorValue {
  return {
    type: 'color',
    color: value || '#000000',
    opacity: 100,
  }
}

export function createInitialGradientValue(value?: string): GradientValue {
  const initialColor = value ?? '#000000'

  return {
    type: 'gradient',
    gradientType: 'linear',
    angle: 0,
    stops: [
      {
        position: 0,
        color: initialColor,
        opacity: 100,
      },
      {
        position: 100,
        color: initialColor,
        opacity: 0,
      },
    ],
  }
}

export function createInitialImageValue(url?: string): ImageValue {
  return {
    type: 'image',
    url: '',
  }
}

export function isPickerValueEqual(a: PickerValue, b: PickerValue) {
  if (a.type !== b.type) {
    return false
  }

  if (a.type === 'color' && b.type === 'color') {
    return (
      Color(a.color)
        .alpha(a.opacity / 100)
        .hex() ===
      Color(b.color)
        .alpha(b.opacity / 100)
        .hex()
    )
  }

  return false
}