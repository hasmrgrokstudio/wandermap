<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="max-w-5xl mx-auto px-6 pt-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
      <span class="mx-2">→</span>
      <NuxtLink
        :to="`/${city?.country?.slug}`"
        class="hover:text-white"
      >
        {{ city?.country?.flagEmoji }} {{ city?.country?.nameRu }}
      </NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ city?.nameRu }}</span>
    </nav>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">{{ city?.nameRu }}</h1>
      <p v-if="city?.description" class="text-gray-400 mt-3 text-lg">
        {{ city.description }}
      </p>
    </header>

    <!-- Фильтр по тегам -->
    <section class="max-w-5xl mx-auto px-6 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          :class="[
            'px-3 py-1 rounded-full text-sm transition',
            !activeTag ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
          @click="activeTag = null"
        >
          Все
        </button>
        <button
          v-for="tag in allTags"
          :key="tag.id"
          :class="[
            'px-3 py-1 rounded-full text-sm transition',
            activeTag === tag.id ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
          @click="activeTag = tag.id"
        >
          {{ tag.nameRu }}
        </button>
      </div>
    </section>

    <!-- Карточки мест -->
    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="place in filteredPlaces"
          :key="place.id"
          :to="`/${city.country.slug}/${city.slug}/${place.slug}`"
          class="block p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
        >
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-lg">{{ place.titleRu }}</h3>
            <div class="flex gap-1">
              <span v-for="et in place.emojiTags" :key="et.id" class="text-lg">
                {{ et.emoji }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-2">
            <span class="text-sm">{{ '⭐'.repeat(place.rating) }}</span>
            <span class="text-sm text-gray-500">{{ '💲'.repeat(place.priceLevel) }}</span>
          </div>

          <div v-if="place.tags?.length" class="flex flex-wrap gap-1 mt-3">
            <span
              v-for="tag in place.tags"
              :key="tag.id"
              class="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
            >
              {{ tag.nameRu }}
            </span>
          </div>

          <p v-if="place.reviewRu" class="text-gray-500 text-sm mt-3 line-clamp-2">
            {{ place.reviewRu }}
          </p>
        </NuxtLink>
      </div>

      <p v-if="!filteredPlaces?.length" class="text-gray-500 text-center py-12">
        Нет мест с таким тегом
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: city } = await useFetch<any>(
  `/api/public/city/${route.params.country}/${route.params.city}`
)

if (!city.value) {
  throw createError({ statusCode: 404, statusMessage: 'Город не найден' })
}

// Собираем все уникальные теги из мест этого города
const allTags = computed(() => {
  const tags = new Map()
  city.value?.places?.forEach((place: any) => {
    place.tags?.forEach((tag: any) => {
      tags.set(tag.id, tag)
    })
  })
  return Array.from(tags.values())
})

const activeTag = ref<number | null>(null)

const filteredPlaces = computed(() => {
  if (!activeTag.value) return city.value?.places || []
  return (city.value?.places || []).filter((p: any) =>
    p.tags?.some((t: any) => t.id === activeTag.value)
  )
})
</script>