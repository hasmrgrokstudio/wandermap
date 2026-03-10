export default defineEventHandler(async () => {
    // Получаем все страны с количеством городов
    const countries = await prisma.country.findMany({
      include: {
        _count: {
          select: { cities: true }
        }
      },
      orderBy: { nameRu: 'asc' }
    })
  
    return countries
  })