export interface JsonLdHeadScript {
  key: string
  type: 'application/ld+json'
  children: unknown
  [key: `data-${string}`]: string | number | boolean | null | undefined
}
