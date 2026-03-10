<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="max-w-5xl mx-auto px-6 pt-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">🏷 {{ tag?.nameRu }}</span>
    </nav>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">🏷 {{ tag?.nameRu }}</h1>
      <p class="text-gray-400 mt-2">{{ tag?.places?.length || 0 }} мест с этим тегом</p>
    </header>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="place in tag?.places"
          :key="place.id"
          :to="`/${place.city.country.slug}/${place.city.slug}/${place.slug}`"
          class="block p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
        >
          <div class="text-sm text-gray-500 mb-1">
            {{ place.city.country.flagEmoji }} {{ place.city.nameRu }}
          </div>
          <h3 class="font-semibold text-lg">{{ place.titleRu }}</h3>
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
const { data: tag } = await useFetch<any>(`/api/public/tag/${route.params.slug}`)

if (!tag.value) {
  throw createError({ statusCode: 404, statusMessage: 'Тег не найден' })
}
</script>