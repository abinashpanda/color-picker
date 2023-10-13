import Color from 'color'
import { ColorValue, GradientStop, GradientValue, ImageValue, PickerValue } from '../_types/color'
import { match } from 'ts-pattern'

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
    angle: 180,
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

export function createGradientStringFromValue(value: GradientValue) {
  return match(value)
    .returnType<string>()
    .with({ gradientType: 'linear' }, (value) => {
      const stops = [...value.stops].sort((a, b) => a.position - b.position)
      return `linear-gradient(${value.angle}deg, ${stops
        .map(
          (stop) =>
            `${Color(stop.color)
              .alpha(stop.opacity / 100)
              .rgb()
              .toString()} ${stop.position}%`,
        )
        .join(', ')})`
    })
    .with({ gradientType: 'radial' }, (value) => {
      const stops = [...value.stops].sort((a, b) => a.position - b.position)
      return `radial-gradient(circle, ${stops
        .map(
          (stop) =>
            `${Color(stop.color)
              .alpha(stop.opacity / 100)
              .rgb()
              .toString()} ${stop.position}%`,
        )
        .join(', ')})`
    })
    .exhaustive()
}

export function fixHexColor(color: string): string {
  // Remove the '#' if it exists
  if (color.startsWith('#')) {
    color = color.substring(1)
  }

  // Pad or trim to a valid length
  if (color.length > 6) {
    color = color.substring(0, 6)
  } else if (color.length < 6 && color.length !== 3) {
    color = color.padEnd(6, '0')
  } else if (color.length > 3 && color.length < 6) {
    color = color.substring(0, 3)
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

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function addGradientStop(value: GradientValue, stop: GradientStop): { value: GradientValue; stopIndex: number } {
  const newValue = {
    ...value,
    stops: [...value.stops, stop].sort((a, b) => a.position - b.position),
  }
  return { value: newValue, stopIndex: newValue.stops.findIndex((_stop) => stop.position === _stop.position) }
}

export function removeGradientStop(value: GradientValue, index: number): GradientValue {
  return {
    ...value,
    stops: value.stops.filter((_stop, stopIndex) => {
      return stopIndex !== index
    }),
  }
}

export function updateGradientStop(value: GradientValue, index: number, data: Partial<GradientStop>): GradientValue {
  return {
    ...value,
    stops: value.stops.map((stop, stopIndex) => (stopIndex === index ? { ...stop, ...data } : stop)),
  }
}

export function getNewStopAtPosition(stops: GradientStop[], position: number): GradientStop {
  // Sort gradient stops by position
  const colorStops = [...stops].sort((a, b) => a.position - b.position)

  for (let i = 0; i < colorStops.length - 1; i++) {
    let start = colorStops[i]
    let end = colorStops[i + 1]

    // If the position is between two stops, interpolate the color
    if (start.position <= position && end.position >= position) {
      const t = (position - start.position) / (end.position - start.position)

      const startColor = Color(start.color)
      const endColor = Color(end.color)

      const r = Math.round((1 - t) * startColor.red() + t * endColor.red())
      const g = Math.round((1 - t) * startColor.green() + t * endColor.green())
      const b = Math.round((1 - t) * startColor.blue() + t * endColor.blue())

      const a = (1 - t) * start.opacity + t * end.opacity

      return {
        position,
        opacity: a,
        color: Color.rgb(r, g, b).hex().toString(),
      }
    }
  }

  // If the position is outside the range of the stops, just return the closest stop's color
  if (position <= colorStops[0].position) {
    return {
      ...colorStops[0],
      position,
    }
  }

  return {
    ...colorStops[colorStops.length - 1],
    position,
  }
}
