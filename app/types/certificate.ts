export interface Certificate {
  name: string
  issuer?: string | null
  link?: string | null
  thumbnail?: string | null
}

export interface CertificatesDocument {
  meta?: {
    certificates?: Certificate[]
  }
}
