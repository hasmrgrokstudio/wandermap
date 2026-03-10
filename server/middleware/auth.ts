import { createHmac } from 'crypto'

// Какие методы требуют авторизации
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

// Какие пути НЕ требуют авторизации (логин, публичные GET)
const PUBLIC_PATHS = ['/api/auth/login']

export default defineEventHandler(async (event) => {
  const method = event.method
  const path = getRequestURL(event).pathname

  // GET-запросы и публичные пути пропускаем
  if (!PROTECTED_METHODS.includes(method)) return
  if (!path.startsWith('/api/')) return
  if (PUBLIC_PATHS.includes(path)) return

  // Проверяем токен
  const token = getCookie(event, 'wandermap_session')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }
  
  const parts = token.split('.')
  if (parts.length !== 2) {
    throw createError({ statusCode: 401, statusMessage: 'Невалидный токен' })
  }
  
  const [tokenData, signature] = parts as [string, string]
  const expectedSignature = createHmac('sha256', process.env.SESSION_SECRET!)
    .update(tokenData)
    .digest('hex')

  if (signature !== expectedSignature) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Невалидный токен'
    })
  }

  // Токен валиден — запрос проходит дальше к обработчику
})