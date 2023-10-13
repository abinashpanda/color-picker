import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

/**
 * useSyncedState hook is used to sync a value with a state.
 * As the value changes, the state will be updated. This is achieved by using useEffect.
 * So make sure to have the value type to be a type which supports shallow comparison.
 *
 * @param value value to sync
 * @returns
 */
export function useSynctedState<T extends any>(value: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(value)

  useEffect(
    function updateStateOnValueChange() {
      if (state !== value) {
        setState(value)
      }
    },
    [state, value],
  )

  return [state, setState]
}
