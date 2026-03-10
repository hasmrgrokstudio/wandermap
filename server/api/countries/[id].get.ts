export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
  
    const country = await prisma.country.findUnique({
      where: { id: Number(id) },
      include: {
        cities: {
          include: {
            _count: { select: { places: true } }
          }
        }
      }
    })
  
    if (!country) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Страна не найдена'
      })
    }
  
    return country
  })