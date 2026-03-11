<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <PublicHeader>
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ $t('nav.home') }}</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ country?.flagEmoji }} {{ lc.t(country?.nameRu, country?.nameEn) }}</span>
    </PublicHeader>

    <header class="max-w-5xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold">
        {{ country?.flagEmoji }} {{ lc.t(country?.nameRu, country?.nameEn) }}
      </h1>
      <p v-if="country?.description" class="text-gray-400 mt-3 text-lg">
        {{ country.description }}
      </p>
    </header>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <h2 class="text-xl font-bold mb-4">{{ $t('nav.cities') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="city in country?.cities"
          :key="city.id"
          :to="localePath(`/${country.slug}/${city.slug}`)"
          class="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
        >
          <h3 class="text-lg font-semibold">{{ lc.t(city.nameRu, city.nameEn) }}</h3>
          <p class="text-gray-400 text-sm mt-1">
            {{ city._count?.places || 0 }} {{ $t('place.placesCount') }}
          </p>
          <p v-if="city.description" class="text-gray-500 text-sm mt-2">
            {{ city.description }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const lc = useLocaleContent()

const { data: country } = await useFetch<any>(
  `/api/public/country/${route.params.country}`
)

if (!country.value) {
  throw createError({ statusCode: 404, statusMessage: 'Страна не найдена' })
}

const { t } = useI18n()

useSeoMeta({
  title: country.value?.metaTitle || lc.t(country.value?.nameRu, country.value?.nameEn),
  description: country.value?.metaDesc 
    || lc.t(country.value?.descriptionRu, country.value?.descriptionEn) 
    || t('site.description'),
  
  ogTitle: country.value?.metaTitle || lc.t(country.value?.nameRu, country.value?.nameEn),
  ogDescription: country.value?.metaDesc 
    || lc.t(country.value?.descriptionRu, country.value?.descriptionEn) 
    || t('site.description'),
})
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.home'), item: localePath('/') },
      { 
        name: lc.t(country.value?.nameRu, country.value?.nameEn), 
      },
    ],
  }),
])
</script>