import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.titleRu || !body.slug || !body.cityId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поля titleRu, slug и cityId обязательны'
    })
  }

  const place = await prisma.place.create({
    data: {
      titleRu: body.titleRu,
      titleEn: body.titleEn || null,
      slug: body.slug,
      cityId: Number(body.cityId),
      reviewRu: body.reviewRu || null,
      reviewEn: body.reviewEn || null,
      rating: body.rating ? Number(body.rating) : 0,
      priceLevel: body.priceLevel ? Number(body.priceLevel) : 0,
      address: body.address || null,
      lat: body.lat != null ? Number(body.lat) : null,
      lng: body.lng != null ? Number(body.lng) : null,
      coverImage: body.coverImage || null,
      gallery: body.gallery || [],
      isPublished: body.isPublished || false,
      visitDate: body.visitDate ? new Date(body.visitDate) : null,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDesc || null,
      // Привязка тегов — магия many-to-many
      tags: body.tagIds?.length
        ? { connect: body.tagIds.map((id: number) => ({ id })) }
        : undefined,
      emojiTags: body.emojiTagIds?.length
        ? { connect: body.emojiTagIds.map((id: number) => ({ id })) }
        : undefined
    },
    include: {
      tags: true,
      emojiTags: true
    }
  })

  return place
})