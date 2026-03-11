<template>
  <div class="flex gap-1">
    <button
      v-for="loc in locales"
      :key="loc.code"
      :class="[
        'px-2 py-1 rounded text-sm transition',
        locale === loc.code
          ? 'bg-white text-black'
          : 'text-gray-400 hover:text-white'
      ]"
      @click="setLocale(loc.code)"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>