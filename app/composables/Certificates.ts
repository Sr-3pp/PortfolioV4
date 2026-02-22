import type { Certificate, CertificateDocument } from '~/types/certificate'

const normalizeCertificate = (doc: CertificateDocument): Certificate | null => {
  const meta = doc.meta ?? {}
  const name = meta.name ?? doc.name
  if (!name) return null

  return {
    name,
    issuer: meta.issuer ?? doc.issuer ?? null,
    link: meta.link ?? doc.link ?? null,
    thumbnail: meta.thumbnail ?? doc.thumbnail ?? null,
    summary: meta.summary ?? doc.summary ?? null
  }
}

export const useCertificates = () => {
  const getCertificates = async () => {
    const { data } = await useAsyncData<CertificateDocument[]>('certificates', () =>
      queryCollection('certificates').all()
    )

    return (data.value ?? [])
      .map(normalizeCertificate)
      .filter((cert): cert is Certificate => cert !== null)
  }

  return {
    getCertificates
  }
}
