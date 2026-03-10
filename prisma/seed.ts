import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Очищаем базу перед заполнением
  await prisma.place.deleteMany()
  await prisma.emojiTag.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.city.deleteMany()
  await prisma.country.deleteMany()

  console.log('🧹 База очищена')

  // --- ТЕГИ ---
  const tagFood = await prisma.tag.create({
    data: {
      slug: 'food',
      nameRu: 'Еда',
      nameEn: 'Food',
      icon: '🍜',
      color: '#f97316',
      metaTitle: 'Еда — места где вкусно поесть',
      metaDesc: 'Рестораны, кафе и стрит-фуд, проверенные лично',
    },
  })

  const tagBeach = await prisma.tag.create({
    data: {
      slug: 'beach',
      nameRu: 'Пляж',
      nameEn: 'Beach',
      icon: '🏖️',
      color: '#0ea5e9',
    },
  })

  const tagNightlife = await prisma.tag.create({
    data: {
      slug: 'nightlife',
      nameRu: 'Ночная жизнь',
      nameEn: 'Nightlife',
      icon: '🌙',
      color: '#8b5cf6',
    },
  })

  const tagCafe = await prisma.tag.create({
    data: {
      slug: 'cafe',
      nameRu: 'Кафе',
      nameEn: 'Cafe',
      icon: '☕',
      color: '#78350f',
    },
  })

  const tagSight = await prisma.tag.create({
    data: {
      slug: 'sightseeing',
      nameRu: 'Достопримечательности',
      nameEn: 'Sightseeing',
      icon: '📸',
      color: '#10b981',
    },
  })

  console.log('🏷️ Теги созданы')

  // --- EMOJI-ТЕГИ ---
  const emojiFire = await prisma.emojiTag.create({
    data: {
      emoji: '🔥',
      slug: 'fire',
      nameRu: 'Огонь',
      nameEn: 'Fire',
      descriptionRu: 'Лучшие из лучших — must visit',
      descriptionEn: 'Best of the best — must visit',
    },
  })

  const emojiLove = await prisma.emojiTag.create({
    data: {
      emoji: '😍',
      slug: 'love',
      nameRu: 'Восторг',
      nameEn: 'Love it',
      descriptionRu: 'Места, которые вызвали восторг',
    },
  })

  const emojiMoney = await prisma.emojiTag.create({
    data: {
      emoji: '💰',
      slug: 'pricey',
      nameRu: 'Дорого',
      nameEn: 'Pricey',
      descriptionRu: 'Дорого, но стоит своих денег',
    },
  })

  const emojiPuke = await prisma.emojiTag.create({
    data: {
      emoji: '🤮',
      slug: 'awful',
      nameRu: 'Ужас',
      nameEn: 'Awful',
      descriptionRu: 'Не ходите сюда — проверено на себе',
    },
  })

  const emojiChill = await prisma.emojiTag.create({
    data: {
      emoji: '😌',
      slug: 'chill',
      nameRu: 'Релакс',
      nameEn: 'Chill',
      descriptionRu: 'Спокойные места для отдыха',
    },
  })

  console.log('😀 Emoji-теги созданы')

  // --- СТРАНА ---
  const vietnam = await prisma.country.create({
    data: {
      slug: 'vietnam',
      nameRu: 'Вьетнам',
      nameEn: 'Vietnam',
      description: 'Страна мотобайков, фо и невероятных пляжей',
      flagEmoji: '🇻🇳',
      sortOrder: 1,
      metaTitle: 'Вьетнам — мои любимые места',
      metaDesc: 'Каталог проверенных мест во Вьетнаме: еда, пляжи, развлечения',
    },
  })

  console.log('🇻🇳 Вьетнам создан')

  // --- ГОРОД ---
  const nhaTrang = await prisma.city.create({
    data: {
      slug: 'nha-trang',
      nameRu: 'Нячанг',
      nameEn: 'Nha Trang',
      description: 'Курортный город на побережье. Русскоязычная тусовка, длинный пляж, морепродукты.',
      lat: 12.2388,
      lng: 109.1967,
      countryId: vietnam.id,
      metaTitle: 'Нячанг — лучшие места города',
      metaDesc: 'Рестораны, пляжи и развлечения Нячанга, проверенные лично',
    },
  })

  console.log('🏙️ Нячанг создан')

  // --- МЕСТА ---
  await prisma.place.create({
    data: {
      slug: 'louisiane-brewhouse',
      titleRu: 'Louisiane Brewhouse',
      titleEn: 'Louisiane Brewhouse',
      reviewRu: 'Пивоварня прямо на пляже. Своё крафтовое пиво, бассейн, лежаки. Идеально для заката. Цены выше среднего, но атмосфера того стоит.',
      rating: 4,
      priceLevel: 3,
      address: '29 Trần Phú, Nha Trang',
      lat: 12.2245,
      lng: 109.1928,
      cityId: nhaTrang.id,
      isPublished: true,
      visitDate: new Date('2026-02-15'),
      tags: { connect: [{ id: tagFood.id }, { id: tagBeach.id }, { id: tagNightlife.id }] },
      emojiTags: { connect: [{ id: emojiFire.id }, { id: emojiLove.id }] },
    },
  })

  await prisma.place.create({
    data: {
      slug: 'skylight-rooftop',
      titleRu: 'Skylight Rooftop',
      titleEn: 'Skylight Rooftop',
      reviewRu: 'Руфтоп-бар на крыше Havana Hotel. Панорамный вид на залив. Коктейли средние, но виды — бомба. Вход платный, включает один напиток.',
      rating: 3,
      priceLevel: 3,
      address: '38 Trần Phú, Nha Trang',
      lat: 12.2389,
      lng: 109.1942,
      cityId: nhaTrang.id,
      isPublished: true,
      visitDate: new Date('2026-02-20'),
      tags: { connect: [{ id: tagNightlife.id }] },
      emojiTags: { connect: [{ id: emojiMoney.id }] },
    },
  })

  await prisma.place.create({
    data: {
      slug: 'pho-hong',
      titleRu: 'Фо Хонг',
      titleEn: 'Pho Hong',
      reviewRu: 'Локальная забегаловка с лучшим фо бо в городе. Огромные порции за копейки. Ноль туристов. Меню только на вьетнамском — тыкай пальцем.',
      rating: 5,
      priceLevel: 1,
      address: '56 Lê Thánh Tôn, Nha Trang',
      lat: 12.2451,
      lng: 109.1923,
      cityId: nhaTrang.id,
      isPublished: true,
      visitDate: new Date('2026-02-10'),
      tags: { connect: [{ id: tagFood.id }] },
      emojiTags: { connect: [{ id: emojiFire.id }, { id: emojiLove.id }] },
    },
  })

  await prisma.place.create({
    data: {
      slug: 'bai-dai-beach',
      titleRu: 'Пляж Бай Дай',
      titleEn: 'Bai Dai Beach',
      reviewRu: 'Длинный пустой пляж в 20 км от центра. Мало людей, чистая вода, белый песок. Лежаки от кафе за 50к донгов. Лучший пляж в окрестностях.',
      rating: 5,
      priceLevel: 1,
      address: 'Bãi Dài, Cam Ranh',
      lat: 12.0833,
      lng: 109.1500,
      cityId: nhaTrang.id,
      isPublished: true,
      visitDate: new Date('2026-02-18'),
      tags: { connect: [{ id: tagBeach.id }] },
      emojiTags: { connect: [{ id: emojiFire.id }, { id: emojiChill.id }] },
    },
  })

  await prisma.place.create({
    data: {
      slug: 'an-cafe',
      titleRu: 'An Cafe',
      titleEn: 'An Cafe',
      reviewRu: 'Уютная кофейня с вьетнамским кофе. Тихо, есть Wi-Fi, кондиционер. Хорошее место для работы. Яичный кофе — топ.',
      rating: 4,
      priceLevel: 1,
      address: '12 Biệt Thự, Nha Trang',
      lat: 12.2411,
      lng: 109.1935,
      cityId: nhaTrang.id,
      isPublished: true,
      visitDate: new Date('2026-02-12'),
      tags: { connect: [{ id: tagCafe.id }] },
      emojiTags: { connect: [{ id: emojiChill.id }] },
    },
  })

  console.log('📍 5 мест в Нячанге созданы')
  console.log('✅ Seed завершён!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })