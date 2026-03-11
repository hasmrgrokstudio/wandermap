<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <PublicHeader>
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ $t('nav.home') }}</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ emojiTag?.emoji }} {{ lc.t(emojiTag?.nameRu, emojiTag?.nameEn) }}</span>
    </PublicHeader>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">
        <span class="text-5xl">{{ emojiTag?.emoji }}</span>
        {{ lc.t(emojiTag?.nameRu, emojiTag?.nameEn) }}
      </h1>
      <p v-if="emojiTag?.descriptionRu || emojiTag?.descriptionEn" class="text-gray-400 mt-3">
        {{ lc.t(emojiTag.descriptionRu, emojiTag.descriptionEn) }}
      </p>
      <p class="text-gray-500 mt-2">{{ emojiTag?.places?.length || 0 }} {{ $t('place.placesCount') }}</p>
    </header>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="place in emojiTag?.places"
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
            <div v-if="place.tags?.length" class="flex gap-1">
              <span
                v-for="t in place.tags"
                :key="t.id"
                class="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
              >
                {{ lc.t(t.nameRu, t.nameEn) }}
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
const localePath = useLocalePath()
const lc = useLocaleContent()

const { data: emojiTag } = await useFetch<any>(`/api/public/emoji/${route.params.slug}`)

if (!emojiTag.value) {
  throw createError({ statusCode: 404, statusMessage: 'Emoji-тег не найден' })
}

const { t } = useI18n()
useSeoMeta({
  title: emojiTag.value?.metaTitle || lc.t(emojiTag.value?.nameRu, emojiTag.value?.nameEn),
  description: lc.t(emojiTag.value?.descriptionRu, emojiTag.value?.descriptionEn) 
    || emojiTag.value?.metaDesc 
    || t('site.description'),
  
  ogTitle: emojiTag.value?.metaTitle || lc.t(emojiTag.value?.nameRu, emojiTag.value?.nameEn),
  ogDescription: lc.t(emojiTag.value?.descriptionRu, emojiTag.value?.descriptionEn) 
    || emojiTag.value?.metaDesc 
    || t('site.description'),
})
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.home'), item: localePath('/') },
      { name: lc.t(emojiTag.value?.nameRu, emojiTag.value?.nameEn) },
    ],
  }),
])
</script>