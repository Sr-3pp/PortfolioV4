export interface ContactFormState {
  name: string
  from: string
  message: string
}

export interface ContactQuickAction {
  label: string
  icon: string
  href: string
  external?: boolean
}
