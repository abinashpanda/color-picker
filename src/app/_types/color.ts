export type ColorValue = {
  type: 'color'
  value: string
}

export type GradientValue = {
  type: 'gradient'
  gradientType: 'linear' | 'radial'
  stops: GradientStop[]
}

export type GradientStop = {
  position: number
  color: string
}

export type ImageValue = {
  type: 'image'
  url: string
}

export type Value = ColorValue | GradientValue | ImageValue
