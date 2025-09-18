export const useUiOverlay = (key: string) => {
  const open = useState<boolean>(`overlay:${key}:open`, () => false)

  const setOverlayState = (value: boolean) => {
    open.value = value
  }

  const openOverlay = () => setOverlayState(true)
  const closeOverlay = () => setOverlayState(false)
  const toggleOverlay = () => setOverlayState(!open.value)

  return {
    open,
    openOverlay,
    closeOverlay,
    toggleOverlay
  }
}
