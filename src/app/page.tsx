'use client'

import Picker from './_components/picker'
import { useCallback, useState } from 'react'
import { PickerValue } from './_types/color'

export default function Page() {
  const [color, setColor] = useState<PickerValue>({ type: 'color', color: '#ff0000', opacity: 100 })
  const handleChange = useCallback((value: PickerValue) => {
    setColor(value)
  }, [])

  return (
    <div className="space-y-4 p-8">
      <div className="grid w-80 grid-cols-2 items-center gap-x-2 gap-y-4 rounded-md border p-2">
        <div className="text-sm text-foreground">Color</div>
        <Picker className="" value={color} onChange={handleChange} />
      </div>
    </div>
  )
}
