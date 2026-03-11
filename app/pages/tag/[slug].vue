<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <PublicHeader>
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ $t('nav.home') }}</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">🏷 {{ lc.t(tag?.nameRu, tag?.nameEn) }}</span>
    </PublicHeader>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">🏷 {{ lc.t(tag?.nameRu, tag?.nameEn) }}</h1>
      <p class="text-gray-400 mt-2">{{ tag?.places?.length || 0 }} {{ $t('place.placesCount') }}</p>
    </header>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="place in tag?.places"
          :key="place.id"
          :to="localePath(`/${place.city.country.slug}/${place.city.slug}/${place.slug}`)"
          class="block p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
        >
          <div class="text-sm text-gray-500 mb-1">
            {{ place.city.country.flagEmoji }} {{ lc.t(place.city.nameRu, place.city.nameEn) }}
          </div>
          <h3 class="font-semibold text-lg">{{ lc.t(place.titleRu, place.titleEn) }}</h3>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-sm">{{ '⭐'.repeat(place.rating) }}</span>
            <span v-if="place.emojiTags?.length" class="flex gap-1">
              <span v-for="et in place.emojiTags" :key="et.id">{{ et.emoji }}</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const lc = useLocaleContent()

const { data: tag } = await useFetch<any>(`/api/public/tag/${route.params.slug}`)

if (!tag.value) {
  throw createError({ statusCode: 404, statusMessage: 'Тег не найден' })
}
</script>