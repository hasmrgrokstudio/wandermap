<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-white">Дашборд</h1>

    <div class="grid grid-cols-3 gap-4" v-if="stats">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        :ui="{ background: 'bg-gray-900', ring: 'ring-gray-800' }"
      >
        <div class="text-3xl font-bold text-white">
          {{ stat.total }}
        </div>
        <div class="text-sm text-emerald-400 mt-1" v-if="stat.published !== null">
          {{ stat.published }} опубликовано
        </div>
        <div class="text-gray-400 mt-1">{{ stat.label }}</div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: countries } = await useFetch<any[]>('/api/countries')
const { data: cities } = await useFetch<any[]>('/api/cities')
const { data: places } = await useFetch<any[]>('/api/places')

const stats = computed(() => {
  const totalCountries = countries.value?.length || 0
  const totalCities = cities.value?.length || 0
  const totalPlaces = places.value?.length || 0
  const publishedPlaces = places.value?.filter(place => place.isPublished).length || 0

  return [
    {
      label: 'Страны',
      total: totalCountries,
      published: null
    },
    {
      label: 'Города',
      total: totalCities,
      published: null
    },
    {
      label: 'Места',
      total: totalPlaces,
      published: publishedPlaces
    }
  ]
})
</script>