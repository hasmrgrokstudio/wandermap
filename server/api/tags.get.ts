import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { places: true } }
    },
    orderBy: { nameRu: 'asc' }
  })

  return tags
})