export const useCertificates = () => {
  const getCertificates = async () => {
    const { data } = await useAsyncData(() =>
      queryCollection('certificates').first()
    )
    return data.value?.meta?.certificates || []
  }
  return {
    getCertificates
  }
}
