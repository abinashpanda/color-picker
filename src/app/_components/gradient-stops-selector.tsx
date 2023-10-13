'use client'

import invariant from 'tiny-invariant'
import { PickerValue } from '../_types/color'
import { createGradientStringFromValue } from '../_utils/color'
import Color from 'color'

type GradientStopSelectorProps = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  activeIndex: number
  setActiveIndex: (index: number) => void
  className?: string
  style?: React.CSSProperties
}

export default function GradientStopsSelector({ value, onChange, className, style }: GradientStopSelectorProps) {
  invariant(value.type === 'gradient', 'GradientStopsSelector must be used with a gradient value')

  return (
    <div
      className="relative h-3 w-full select-none border border-border/50"
      style={{
        background:
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center',
      }}
    >
      <div
        className="absolute inset-0 h-full w-full select-none "
        style={{
          background: createGradientStringFromValue({
            type: 'gradient',
            gradientType: 'linear',
            angle: 90,
            stops: value.stops,
          }),
        }}
      />
      {value.stops.map((stop, index) => {
        return (
          <div
            className="absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border shadow-lg"
            key={index}
            style={
              {
                '--left': `${stop.position}%`,
              } as React.CSSProperties
            }
          >
            <div
              className="h-full w-full rounded-full border-2 border-white bg-current"
              style={{
                color: Color(stop.color)
                  .alpha(stop.opacity / 100)
                  .rgb()
                  .toString(),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
