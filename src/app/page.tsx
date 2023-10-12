'use client'

import ColorPicker from './_components/color-picker'
import ColorPalette from './_components/color-palette'
import { useState } from 'react'
import { ColorValue } from './_types/color'

export default function Page() {
  const [color, setColor] = useState<ColorValue>({ type: 'color', value: '#ff0000' })

  return (
    <div className="space-y-4 p-8">
      <div className="grid w-80 grid-cols-2 items-center gap-x-2 gap-y-4 rounded-md border p-2">
        <div className="text-sm text-foreground">Color</div>
        <ColorPicker
          className=""
          value={color}
          onChange={(value) => {
            if (value.type === 'color') {
              setColor(value)
            }
          }}
        />
      </div>
      <ColorPalette value={color} onChange={setColor} />
    </div>
  )
}
