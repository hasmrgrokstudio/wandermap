export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    // Валидация — проверяем что пришли нужные поля
    if (!body.nameRu || !body.slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Поля nameRu и slug обязательны'
      })
    }
  
    const country = await prisma.country.create({
      data: {
        nameRu: body.nameRu,
        slug: body.slug,
        flagEmoji: body.flagEmoji || null,
        nameEn: body.nameEn || ''
      }
    })
  
    return country
  })