export interface SlotMachineSlot {
  current: string
  next: string
  transitionSpeed: number
  currentTransform: string
  nextTransform: string
  timeout: ReturnType<typeof setTimeout> | null
}
