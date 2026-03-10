import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '~~/app/generated/prisma/client.js'

// Создаём один экземпляр Prisma на всё приложение
// В WordPress аналог — глобальный $wpdb, который создаётся один раз
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({ adapter })

export default prisma