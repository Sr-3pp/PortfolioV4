import type { ContentCollectionItem } from '@nuxt/content'

export type ProjectType = 'fulltime' | 'contractor' | 'freelance'

export interface ProjectLink {
  url: string
  name: string
  icon?: string
}

export interface ProjectMeta {
  type?: string
  links?: ProjectLink[]
  role?: string
  period?: string
  technologies?: string[]
  image?: string
  cover?: string
}

export interface ProjectContent {
  title?: string
  description?: string
  meta?: ProjectMeta
  updatedAt?: string
}

export type ProjectDocument = Omit<ContentCollectionItem, 'title' | 'description' | 'meta' | 'updatedAt'> & ProjectContent
