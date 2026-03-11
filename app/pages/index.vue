<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Hero -->
    <PublicHeader>
      <span class="text-white">{{ $t('nav.home') }}</span>
    </PublicHeader>

    <header class="py-20 text-center relative">
      <h1 class="text-5xl font-bold mb-4">🗺 {{ $t('site.title') }}</h1>
      <p class="text-xl text-gray-400 max-w-xl mx-auto">
        {{ $t('site.description') }}
      </p>
      <p class="text-gray-500 mt-2">
        {{ data?.totalPlaces || 0 }} {{ $t('place.placesCount') }}
        в {{ data?.countries?.length || 0 }} {{ $t('nav.countries').toLowerCase() }}
      </p>
    </header>

    <!-- Страны -->
    <section class="max-w-5xl mx-auto px-6 pb-16">
      <h2 class="text-2xl font-bold mb-6">{{ $t('nav.countries') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="country in data?.countries" :key="country.id" :to="localePath(`/${country.slug}`)"
          class="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition">
          <div class="text-4xl mb-3">{{ country.flagEmoji }}</div>
          <h3 class="text-lg font-semibold">{{ lc.t(country.nameRu, country.nameEn) }}</h3>
          <p class="text-gray-400 text-sm mt-1">
            {{ country._count?.cities || 0 }} {{ $t('place.citiesCount') }}
          </p>
          <p v-if="country.description" class="text-gray-500 text-sm mt-2">
            {{ country.description }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- Emoji-панель -->
    <section v-if="data?.emojiTags?.length" class="max-w-5xl mx-auto px-6 pb-16">
      <h2 class="text-2xl font-bold mb-6">{{ $t('emoji.title') }}</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink v-for="et in data.emojiTags" :key="et.id" :to="localePath(`/emoji/${et.slug}`)"
          class="flex items-center gap-2 px-4 py-3 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 hover:scale-105 transition-all">
          <span class="text-3xl">{{ et.emoji }}</span>
          <div>
            <div class="font-medium text-sm">{{ lc.t(et.nameRu, et.nameEn) }}</div>
            <div class="text-xs text-gray-500">{{ et._count?.places || 0 }} {{ $t('place.placesCount') }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Последние места -->
    <section v-if="data?.recentPlaces?.length" class="max-w-5xl mx-auto px-6 pb-20">
      <h2 class="text-2xl font-bold mb-6">{{ $t('recent.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="place in data.recentPlaces" :key="place.id"
          :to="localePath(`/${place.city.country.slug}/${place.city.slug}/${place.slug}`)"
          class="block p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition">
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{{ place.city.country.flagEmoji }}</span>
            <span>{{ lc.t(place.city.nameRu, place.city.nameEn) }}</span>
          </div>
          <h3 class="font-semibold">{{ lc.t(place.titleRu, place.titleEn) }}</h3>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-sm">{{ '⭐'.repeat(place.rating) }}</span>
            <span class="text-sm text-gray-500">{{ '💲'.repeat(place.priceLevel) }}</span>
          </div>
          <div v-if="place.emojiTags?.length" class="flex gap-1 mt-2">
            <span v-for="et in place.emojiTags" :key="et.id" class="text-lg">
              {{ et.emoji }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Футер -->
    <footer class="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
      <NuxtLink :to="localePath('/about')" class="hover:text-white transition">
        {{ $t('nav.about') }}
      </NuxtLink>
      <span class="mx-2">·</span>
      <span>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch<any>('/api/public/home')
const lc = useLocaleContent()
const localePath = useLocalePath()
</script>