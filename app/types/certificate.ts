export interface Certificate {
  name: string
  issuer?: string | null
  link?: string | null
  thumbnail?: string | null
  summary?: string | null
}

export interface CertificateDocument extends Partial<Certificate> {
  meta?: Partial<Certificate>
}
