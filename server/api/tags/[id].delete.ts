import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  await prisma.tag.delete({
    where: { id: Number(id) }
  })

  return { message: 'Тег удалён' }
})