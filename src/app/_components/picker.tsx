'use client'

import { cn } from '@/lib/utils'
import { P, match } from 'ts-pattern'
import { ImageIcon } from 'lucide-react'
import { ColorValue, GradientValue, ImageValue, PickerValue } from '../_types/color'
import ColorPickerPopover from './color-picker-popover'
import { cloneElement, useCallback, useEffect, useState } from 'react'
import { useSynctedState } from '../_hooks/use-synced-state'
import {
  createInitialColorValue,
  createInitialGradientValue,
  createInitialImageValue,
  isPickerValueEqual,
} from '../_utils/color'
import ColorPickerPreview from './color-picker-preview'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEventCallback } from '../_hooks/use-event-callback'

type Picker = {
  value: PickerValue
  onChange: (value: PickerValue) => void
  className?: string
  style?: React.CSSProperties
}

// TODO: Use better pattern matching
type PickerDataState = {
  color: ColorValue
  gradient: GradientValue
  image: ImageValue
}

const PICKER_CONFIG = {
  color: {
    icon: <div className="bg-current" />,
    previewComponent: ColorPickerPreview,
    popoverComponent: ColorPickerPopover,
  },
  gradient: {
    icon: <div className="to-current/0 bg-gradient-to-b from-current" />,
    previewComponent: ColorPickerPreview,
    popoverComponent: ColorPickerPopover,
  },
  image: {
    icon: <ImageIcon />,
    previewComponent: ColorPickerPreview,
    popoverComponent: ColorPickerPopover,
  },
} satisfies Record<
  PickerValue['type'],
  {
    icon: React.ReactElement<{ className?: string; style?: React.CSSProperties }>
    previewComponent: React.ComponentType<{ value: PickerValue }>
    popoverComponent: React.ComponentType<{ value: PickerValue; onChange: (value: PickerValue) => void }>
  }
>

const PICKER_TYPE_ORDER_LIST: PickerValue['type'][] = ['color', 'gradient', 'image']

export default function Picker({ value, onChange, className, style }: Picker) {
  const [activePickerType, setActivePickerType] = useState(value.type)

  const [pickerData, setPickerData] = useState<PickerDataState>({
    color: value.type === 'color' ? value : createInitialColorValue('#ffffff'),
    gradient: value.type === 'gradient' ? value : createInitialGradientValue('#000000'),
    image: value.type === 'image' ? value : createInitialImageValue(),
  })

  const handleOnChange = useCallback((value: PickerValue) => {
    setPickerData((state) => ({
      ...state,
      [value.type]: value,
    }))
  }, [])

  const onChangeCallback = useEventCallback(onChange)
  useEffect(
    function callOnChangeOnPickerDataChange() {
      if (!isPickerValueEqual(value, pickerData[activePickerType])) {
        onChangeCallback(pickerData[activePickerType])
      }
    },
    [value, pickerData, activePickerType],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn('w-full rounded border p-1 focus-within:ring-1 focus-within:ring-ring', className)}
          style={style}
        >
          {match(activePickerType)
            .with('color', () => {
              return <PICKER_CONFIG.color.previewComponent value={pickerData.color} />
            })
            .with(P._, () => null)
            .exhaustive()}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="mb-2 flex items-center space-x-2">
          {PICKER_TYPE_ORDER_LIST.map((type) => {
            return (
              <button
                key={type}
                className={cn(
                  'rounded-sm border p-1 focus-visible:outline-none',
                  activePickerType === type
                    ? 'border-border bg-muted text-foreground'
                    : 'border-border/50 text-muted-foreground',
                )}
                onClick={() => {
                  setActivePickerType(type)
                }}
              >
                {cloneElement(PICKER_CONFIG[type].icon, {
                  className: cn(PICKER_CONFIG[type].icon.props.className, 'w-4 h-4'),
                })}
              </button>
            )
          })}
        </div>
        {match(activePickerType)
          .with('color', () => {
            return <PICKER_CONFIG.color.popoverComponent value={pickerData.color} onChange={handleOnChange} />
          })
          .with(P._, () => null)
          .exhaustive()}
      </PopoverContent>
    </Popover>
  )
}
