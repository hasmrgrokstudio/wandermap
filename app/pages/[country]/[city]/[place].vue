<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <PublicHeader>
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ $t('nav.home') }}</NuxtLink>
      <span class="mx-2">→</span>
      <NuxtLink
        :to="localePath(`/${place?.city?.country?.slug}`)"
        class="hover:text-white"
      >
        {{ place?.city?.country?.flagEmoji }} {{ lc.t(place?.city?.country?.nameRu, place?.city?.country?.nameEn) }}
      </NuxtLink>
      <span class="mx-2">→</span>
      <NuxtLink
        :to="localePath(`/${place?.city?.country?.slug}/${place?.city?.slug}`)"
        class="hover:text-white"
      >
        {{ lc.t(place?.city?.nameRu, place?.city?.nameEn) }}
      </NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ lc.t(place?.titleRu, place?.titleEn) }}</span>
    </PublicHeader>

    <article class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="text-3xl font-bold">{{ lc.t(place?.titleRu, place?.titleEn) }}</h1>

      <div class="flex items-center gap-4 mt-4">
        <span class="text-lg">{{ '⭐'.repeat(place?.rating || 0) }}</span>
        <span class="text-gray-400">{{ '💲'.repeat(place?.priceLevel || 0) }}</span>
        <span v-if="place?.address" class="text-gray-500 text-sm">
          📍 {{ place.address }}
        </span>
      </div>

      <div v-if="place?.emojiTags?.length" class="flex gap-2 mt-4">
        <NuxtLink
          v-for="et in place.emojiTags"
          :key="et.id"
          :to="localePath(`/emoji/${et.slug}`)"
          class="text-2xl hover:scale-125 transition-transform"
          :title="lc.t(et.nameRu, et.nameEn)"
        >
          {{ et.emoji }}
        </NuxtLink>
      </div>

      <div v-if="place?.tags?.length" class="flex flex-wrap gap-2 mt-4">
        <NuxtLink
          v-for="tag in place.tags"
          :key="tag.id"
          :to="localePath(`/tag/${tag.slug}`)"
          class="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-gray-700 transition"
        >
          {{ lc.t(tag.nameRu, tag.nameEn) }}
        </NuxtLink>
      </div>

      <div v-if="place?.reviewRu || place?.reviewEn" class="mt-8">
        <h2 class="text-xl font-semibold mb-3">{{ $t('place.myReview') }}</h2>
        <p class="text-gray-300 leading-relaxed whitespace-pre-line">
          {{ lc.t(place.reviewRu, place.reviewEn) }}
        </p>
      </div>

      <p v-if="place?.visitDate" class="text-gray-500 text-sm mt-8">
        {{ $t('place.visited') }}: {{ new Date(place.visitDate).toLocaleDateString(lc.locale.value === 'en' ? 'en-US' : 'ru-RU') }}
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const lc = useLocaleContent()

const { data: place } = await useFetch<any>(
  `/api/public/place/${route.params.country}/${route.params.city}/${route.params.place}`
)

if (!place.value) {
  throw createError({ statusCode: 404, statusMessage: 'Место не найдено' })
}
</script>