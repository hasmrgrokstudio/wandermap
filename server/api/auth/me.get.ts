import { createHmac } from 'crypto'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'wandermap_session')

  if (!token) {
    return { authenticated: false }
  }
  
  const parts = token.split('.')
  if (parts.length !== 2) {
    return { authenticated: false }
  }
  
  const [tokenData, signature] = parts as [string, string]
  const expectedSignature = createHmac('sha256', process.env.SESSION_SECRET!)
    .update(tokenData)
    .digest('hex')

  if (signature !== expectedSignature) {
    return { authenticated: false }
  }

  return { authenticated: true }
})