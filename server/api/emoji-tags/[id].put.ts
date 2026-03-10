import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const emojiTag = await prisma.emojiTag.update({
    where: { id: Number(id) },
    data: {
      emoji: body.emoji,
      nameRu: body.nameRu,
      nameEn: body.nameEn,
      slug: body.slug,
      descriptionRu: body.descriptionRu,
      descriptionEn: body.descriptionEn,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc
    }
  })

  return emojiTag
})