import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const place = await prisma.place.update({
    where: { id: Number(id) },
    data: {
      titleRu: body.titleRu,
      titleEn: body.titleEn,
      slug: body.slug,
      reviewRu: body.reviewRu,
      reviewEn: body.reviewEn,
      rating: body.rating != null ? Number(body.rating) : undefined,
      priceLevel: body.priceLevel != null ? Number(body.priceLevel) : undefined,
      address: body.address,
      lat: body.lat != null ? Number(body.lat) : undefined,
      lng: body.lng != null ? Number(body.lng) : undefined,
      coverImage: body.coverImage,
      gallery: body.gallery,
      isPublished: body.isPublished,
      visitDate: body.visitDate ? new Date(body.visitDate) : undefined,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
      // set — полная перезапись тегов (удаляет старые, ставит новые)
      tags: body.tagIds
        ? { set: body.tagIds.map((id: number) => ({ id })) }
        : undefined,
      emojiTags: body.emojiTagIds
        ? { set: body.emojiTagIds.map((id: number) => ({ id })) }
        : undefined
    },
    include: {
      tags: true,
      emojiTags: true
    }
  })

  return place
})