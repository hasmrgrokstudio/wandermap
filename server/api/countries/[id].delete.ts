export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
  
    await prisma.country.delete({
      where: { id: Number(id) }
    })
  
    return { message: 'Страна удалена' }
  })