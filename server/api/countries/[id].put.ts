export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
  
    const country = await prisma.country.update({
      where: { id: Number(id) },
      data: {
        nameRu: body.nameRu,
        slug: body.slug,
        flagEmoji: body.flagEmoji,
        nameEn: body.nameEn
      }
    })
  
    return country
  })