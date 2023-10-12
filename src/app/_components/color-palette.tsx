'use client'

import { useEffect, useRef, useState } from 'react'
import { useInteractivePosition } from '../_hooks/use-interactive-position'
import { ColorValue } from '../_types/color'
import Color from 'color'

function getXYValueFromSaturationAndLightness(saturation: number, lightness: number) {
  // as saturation is calculated using x * 100
  const x = saturation / 100
  // as lightness is calcuated using (1 - slPosition.y) * (100 - 50 * slPosition.x)
  const y = 1 - lightness / (100 - 50 * x)
  return { x, y }
}

type ColorPaletteProps = {
  value: ColorValue
  onChange: (type: ColorValue) => void
}

export default function ColorPalette({ value, onChange }: ColorPaletteProps) {
  const hslColor = Color(value.value).hsl()

  const slContainer = useRef<HTMLDivElement | null>(null)
  const slPosition = useInteractivePosition(
    slContainer,
    getXYValueFromSaturationAndLightness(hslColor.saturationl(), hslColor.lightness()),
  )

  const hContainer = useRef<HTMLDivElement | null>(null)
  const hPosition = useInteractivePosition(hContainer, { x: hslColor.hue() / 360, y: 0 })

  const oContainer = useRef<HTMLDivElement | null>(null)
  const oPosition = useInteractivePosition(oContainer)

  const rgb = Color.hsl(hPosition.x * 360, slPosition.x * 100, (1 - slPosition.y) * (100 - 50 * slPosition.x)).rgb()
  useEffect(
    function runOnChangeOnHexColorChange() {
      onChange({ type: 'color', value: rgb.toString() })
    },
    [rgb, onChange],
  )

  return (
    <div className="w-[200px] space-y-2">
      <div
        ref={slContainer}
        className="relative aspect-square w-full select-none border"
        style={{
          backgroundImage: `linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))`,
          backgroundColor: `hsl(${hPosition.x * 360}, 100%, 50%)`,
        }}
      >
        <div
          className="absolute left-[var(--left)] top-[var(--top)] h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border"
          style={
            {
              '--left': `${slPosition.x * 100}%`,
              '--top': `${slPosition.y * 100}%`,
            } as React.CSSProperties
          }
        >
          <div
            className="h-full w-full rounded-full border-2 border-white bg-current"
            style={{
              color: rgb.toString(),
            }}
          />
        </div>
      </div>
      <div
        className="relative h-3 w-full select-none"
        style={{
          background: `linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)`,
        }}
        ref={hContainer}
      >
        <div
          className="absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border"
          style={
            {
              '--left': `${hPosition.x * 100}%`,
            } as React.CSSProperties
          }
        >
          <div
            className="aspect-square h-full rounded-full border-2 border-white bg-current"
            style={{
              color: `hsl(${hPosition.x * 360}, 100%, 50%)`,
            }}
          />
        </div>
      </div>
      <div
        className="relative h-3 w-full select-none"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center',
        }}
        ref={oContainer}
      >
        <div
          className="absolute inset-0 h-full w-full select-none select-none border border-border/50"
          style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)' }}
        />
        <div
          className="absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border bg-white shadow-lg"
          style={
            {
              '--left': `${oPosition.x * 100}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  )
}
