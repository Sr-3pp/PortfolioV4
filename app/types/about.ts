import type { ContentCollectionItem } from '@nuxt/content'

export interface AboutContact {
  website?: string
  linkedin?: string
  email?: string
}

export interface AboutSkillSection {
  key?: string
  title?: string
  subtitle?: string
  items?: string[]
}

export interface AboutSocialLink {
  label: string
  href: string
  icon?: string
}

export interface AboutAlert {
  title?: string
  description?: string
}

export interface AboutCta {
  title?: string
  description?: string
  buttonLabel?: string
}

export interface AboutMeta {
  experienceNote?: string
  socials?: AboutSocialLink[]
}

export interface AboutContent extends ContentCollectionItem {
  name?: string
  headline?: string
  avatar?: string
  experienceStartYear?: number
  experienceNote?: string
  contact?: AboutContact
  skills?: AboutSkillSection[]
  socials?: AboutSocialLink[]
  alert?: AboutAlert | null
  cta?: AboutCta
  meta?: AboutMeta
}
