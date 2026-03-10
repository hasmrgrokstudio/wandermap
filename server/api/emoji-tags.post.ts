import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.emoji || !body.nameRu || !body.slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поля emoji, nameRu и slug обязательны'
    })
  }

  const emojiTag = await prisma.emojiTag.create({
    data: {
      emoji: body.emoji,
      nameRu: body.nameRu,
      nameEn: body.nameEn || null,
      slug: body.slug,
      descriptionRu: body.descriptionRu || null,
      descriptionEn: body.descriptionEn || null,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDesc || null
    }
  })

  return emojiTag
})