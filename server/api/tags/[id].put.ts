import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const tag = await prisma.tag.update({
    where: { id: Number(id) },
    data: {
      nameRu: body.nameRu,
      nameEn: body.nameEn,
      slug: body.slug,
      icon: body.icon,
      color: body.color,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
      descriptionRu: body.descriptionRu,
      descriptionEn: body.descriptionEn
    }
  })

  return tag
})