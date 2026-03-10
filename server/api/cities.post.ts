import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.nameRu || !body.slug || !body.countryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поля nameRu, slug и countryId обязательны'
    })
  }

  const city = await prisma.city.create({
    data: {
      nameRu: body.nameRu,
      nameEn: body.nameEn || '',
      slug: body.slug,
      countryId: Number(body.countryId),
      description: body.description || null,
      coverImage: body.coverImage || null,
      lat: body.lat ? Number(body.lat) : null,
      lng: body.lng ? Number(body.lng) : null,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDesc || null
    }
  })

  return city
})