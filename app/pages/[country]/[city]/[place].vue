<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="max-w-3xl mx-auto px-6 pt-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
      <span class="mx-2">→</span>
      <NuxtLink
        :to="`/${place?.city?.country?.slug}`"
        class="hover:text-white"
      >
        {{ place?.city?.country?.flagEmoji }} {{ place?.city?.country?.nameRu }}
      </NuxtLink>
      <span class="mx-2">→</span>
      <NuxtLink
        :to="`/${place?.city?.country?.slug}/${place?.city?.slug}`"
        class="hover:text-white"
      >
        {{ place?.city?.nameRu }}
      </NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ place?.titleRu }}</span>
    </nav>

    <article class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="text-3xl font-bold">{{ place?.titleRu }}</h1>

      <!-- Мета -->
      <div class="flex items-center gap-4 mt-4">
        <span class="text-lg">{{ '⭐'.repeat(place?.rating || 0) }}</span>
        <span class="text-gray-400">{{ '💲'.repeat(place?.priceLevel || 0) }}</span>
        <span v-if="place?.address" class="text-gray-500 text-sm">
          📍 {{ place.address }}
        </span>
      </div>

      <!-- Emoji-теги -->
      <div v-if="place?.emojiTags?.length" class="flex gap-2 mt-4">
        <NuxtLink
          v-for="et in place.emojiTags"
          :key="et.id"
          :to="`/emoji/${et.slug}`"
          class="text-2xl hover:scale-125 transition-transform"
          :title="et.nameRu"
        >
          {{ et.emoji }}
        </NuxtLink>
      </div>

      <!-- Теги -->
      <div v-if="place?.tags?.length" class="flex flex-wrap gap-2 mt-4">
        <NuxtLink
          v-for="tag in place.tags"
          :key="tag.id"
          :to="`/tag/${tag.slug}`"
          class="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition"
        >
          {{ tag.nameRu }}
        </NuxtLink>
      </div>

      <!-- Отзыв -->
      <div v-if="place?.reviewRu" class="mt-8">
        <h2 class="text-xl font-semibold mb-3">Мой отзыв</h2>
        <p class="text-gray-300 leading-relaxed whitespace-pre-line">
          {{ place.reviewRu }}
        </p>
      </div>

      <!-- Дата посещения -->
      <p v-if="place?.visitDate" class="text-gray-500 text-sm mt-8">
        Посещено: {{ new Date(place.visitDate).toLocaleDateString('ru-RU') }}
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: place } = await useFetch<any>(
  `/api/public/place/${route.params.country}/${route.params.city}/${route.params.place}`
)

if (!place.value) {
  throw createError({ statusCode: 404, statusMessage: 'Место не найдено' })
}
</script>