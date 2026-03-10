import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const country = await prisma.country.findUnique({
    where: { slug },
    include: {
      cities: {
        include: {
          _count: { select: { places: true } }
        },
        orderBy: { nameRu: 'asc' }
      }
    }
  })

  if (!country) {
    throw createError({ statusCode: 404, statusMessage: 'Страна не найдена' })
  }

  return country
})