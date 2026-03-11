<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <PublicHeader>
      <NuxtLink :to="localePath('/')" class="hover:text-white">{{ $t('nav.home') }}</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">{{ $t('about.title') }}</span>
    </PublicHeader>

    <article class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-6">{{ $t('about.title') }}</h1>
      <div class="text-gray-300 leading-relaxed space-y-4">
        <p>{{ $t('about.text1') }}</p>
        <p>{{ $t('about.text2') }}</p>
        <p>{{ $t('about.text3') }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>