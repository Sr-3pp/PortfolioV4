export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contactMail } = useRuntimeConfig().public
  const { sendMail } = useNodeMailer()

  try {
    await sendMail({
      subject: body.subject || 'New contact form submission',
      text: body.message,
      to: contactMail
    })
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to send message' })
  }

  return true
})
