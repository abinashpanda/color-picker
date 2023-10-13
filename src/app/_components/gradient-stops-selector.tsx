'use client'

import invariant from 'tiny-invariant'
import { GradientStop, PickerValue } from '../_types/color'
import { clamp, createGradientStringFromValue, getNewStopAtPosition } from '../_utils/color'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type GradientStopSelectorProps = {
  value: PickerValue
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onStopAdded: (stop: GradientStop) => void
  onStopRemoved: (index: number) => void
  onStopPositionChange: (position: number) => void
  className?: string
  style?: React.CSSProperties
}

export default function GradientStopsSelector({
  value,
  activeIndex,
  onActiveIndexChange,
  onStopAdded,
  onStopRemoved,
  onStopPositionChange,
  className,
  style = {},
}: GradientStopSelectorProps) {
  invariant(value.type === 'gradient', 'GradientStopsSelector must be used with a gradient value')

  const container = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const measurement = useRef<DOMRect | null>(null)

  useEffect(
    function addClickHandler() {
      function calculatePosition(event: MouseEvent) {
        if (!measurement.current) return

        const pageX = event.pageX
        const x = clamp(pageX - (measurement.current.left + window.scrollX), 0, measurement.current.width)
        onStopPositionChange((x / measurement.current.width) * 100)
      }

      function handleMouseUp(event: MouseEvent) {
        isDragging.current = false
      }

      function handleMouseMove(event: MouseEvent) {
        if (isDragging.current) {
          calculatePosition(event)
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
          window.removeEventListener('mouseup', handleMouseUp)
          window.removeEventListener('mousemove', handleMouseMove)
        }
      }
    },
    [onStopPositionChange],
  )

  return (
    <div
      tabIndex={0}
      className={cn('relative h-3 w-full select-none border border-border/50 focus-visible:outline-none', className)}
      style={{
        background:
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center',
        ...style,
      }}
      onMouseDown={(event) => {
        measurement.current = container.current?.getBoundingClientRect() ?? null
        const target = event.target as HTMLElement
        if (target === container.current && measurement.current) {
          const x = clamp(event.pageX - (measurement.current.left + window.scrollX), 0, measurement.current.width)
          const position = (x / measurement.current.width) * 100
          const stop = getNewStopAtPosition(value.stops, position)
          onStopAdded(stop)
        }
      }}
      onKeyDown={(event) => {
        console.log(event)
        if (event.key === 'Delete' || event.key === 'Backspace') {
          onStopRemoved(activeIndex)
        }
      }}
      ref={container}
    >
      <div
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
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
          <button
            key={index}
            className={cn(
              'absolute left-[var(--left)] top-1/2 aspect-square h-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 transform select-none rounded-full border bg-background p-0.5 shadow-lg focus-visible:outline-none',
              index === activeIndex ? 'scale-150' : 'scale-100',
            )}
            style={
              {
                '--left': `${stop.position}%`,
              } as React.CSSProperties
            }
            onMouseDown={() => {
              onActiveIndexChange(index)
              isDragging.current = true
            }}
          >
            <div
              className="pointer-events-none h-full w-full rounded-full bg-current"
              style={{
                color: stop.color,
                opacity: stop.opacity / 100,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
