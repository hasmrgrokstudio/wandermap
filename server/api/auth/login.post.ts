import { createHmac, randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пароль обязателен'
    })
  }

  // Сверяем пароль
  if (body.password !== process.env.ADMIN_PASSWORD) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный пароль'
    })
  }

  // Генерируем токен: случайная строка + подпись
  const tokenData = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', process.env.SESSION_SECRET!)
    .update(tokenData)
    .digest('hex')
  const token = `${tokenData}.${signature}`

  // Ставим cookie (как wordpress_logged_in_*)
  setCookie(event, 'wandermap_session', token, {
    httpOnly: true,    // JS на клиенте не может прочитать
    secure: false,     // для localhost; на проде поставишь true
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/'
  })

  return { message: 'Авторизация успешна' }
})