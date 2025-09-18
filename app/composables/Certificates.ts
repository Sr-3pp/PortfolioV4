import type { Certificate, CertificatesDocument } from '~/types/certificate'

const extractCertificates = (document: CertificatesDocument | null): Certificate[] => {
  const list = document?.meta?.certificates
  return Array.isArray(list) ? list : []
}

export const useCertificates = () => {
  const getCertificates = async () => {
    const { data } = await useAsyncData<CertificatesDocument | null>('certificates', () =>
      queryCollection('certificates').first()
    )

    return extractCertificates(data.value ?? null)
  }

  return {
    getCertificates
  }
}
