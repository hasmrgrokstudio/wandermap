<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="max-w-5xl mx-auto px-6 pt-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ emojiTag?.emoji }} {{ emojiTag?.nameRu }}</span>
    </nav>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">
        <span class="text-5xl">{{ emojiTag?.emoji }}</span>
        {{ emojiTag?.nameRu }}
      </h1>
      <p v-if="emojiTag?.descriptionRu" class="text-gray-400 mt-3">
        {{ emojiTag.descriptionRu }}
      </p>
      <p class="text-gray-500 mt-2">{{ emojiTag?.places?.length || 0 }} мест</p>
    </header>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="place in emojiTag?.places"
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
            <div v-if="place.tags?.length" class="flex gap-1">
              <span
                v-for="t in place.tags"
                :key="t.id"
                class="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
              >
                {{ t.nameRu }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: emojiTag } = await useFetch<any>(`/api/public/emoji/${route.params.slug}`)

if (!emojiTag.value) {
  throw createError({ statusCode: 404, statusMessage: 'Emoji-тег не найден' })
}
</script>