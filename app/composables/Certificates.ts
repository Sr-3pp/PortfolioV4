import type { Certificate, CertificateDocument } from '~/types/certificate'

const normalizeCertificate = (doc: CertificateDocument): Certificate | null => {
  const source = doc.meta ?? doc
  if (!source?.name) return null

  return {
    name: source.name,
    issuer: source.issuer ?? null,
    link: source.link ?? null,
    thumbnail: source.thumbnail ?? null,
    summary: source.summary ?? null
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
