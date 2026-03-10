import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  await prisma.city.delete({
    where: { id: Number(id) }
  })

  return { message: 'Город удалён' }
})