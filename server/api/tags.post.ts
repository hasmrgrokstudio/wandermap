import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.nameRu || !body.slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поля nameRu и slug обязательны'
    })
  }

  const tag = await prisma.tag.create({
    data: {
      nameRu: body.nameRu,
      nameEn: body.nameEn || null,
      slug: body.slug,
      icon: body.icon || null,
      color: body.color || null,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDesc || null,
      descriptionRu: body.descriptionRu || null,
      descriptionEn: body.descriptionEn || null
    }
  })

  return tag
})