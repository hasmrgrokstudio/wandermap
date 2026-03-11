import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const city = await prisma.city.update({
    where: { id: Number(id) },
    data: {
      nameRu: body.nameRu,
      nameEn: body.nameEn,
      slug: body.slug,
      descriptionRu: body.descriptionRu,
      descriptionEn: body.descriptionEn,
      coverImage: body.coverImage,
      lat: body.lat != null ? Number(body.lat) : undefined,
      lng: body.lng != null ? Number(body.lng) : undefined,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc
    }
  })

  return city
})