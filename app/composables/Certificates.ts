import type { Certificate } from '~/types/certificate'

export const useCertificates = () => {
  const getCertificates = async () => {
    const { data } = await useAsyncData<Certificate[]>('certificates', () =>
      queryCollection('certificates').all()
    )

    return data.value ?? []
  }

  return {
    getCertificates
  }
}
