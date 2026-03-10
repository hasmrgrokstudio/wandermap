<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-white">Дашборд</h1>

    <div class="grid grid-cols-3 gap-4" v-if="stats">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        :ui="{ background: 'bg-gray-900', ring: 'ring-gray-800' }"
      >
        <div class="text-3xl font-bold text-white">{{ stat.value }}</div>
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

const stats = computed(() => [
  { label: 'Страны', value: countries.value?.length || 0 },
  { label: 'Города', value: cities.value?.length || 0 },
  { label: 'Места', value: places.value?.length || 0 },
])
</script>