import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  await prisma.emojiTag.delete({
    where: { id: Number(id) }
  })

  return { message: 'Emoji-тег удалён' }
})