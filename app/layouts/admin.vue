<template>
  <div class="min-h-screen flex bg-gray-950">
    <!-- Сайдбар -->
    <aside class="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
      <h2 class="text-lg font-bold mb-6 px-3 text-white">🗺 WanderMap</h2>

      <nav class="space-y-1">
        <UButton
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          variant="ghost"
          color="gray"
          block
          class="justify-start"
        >
          {{ item.icon }} {{ item.label }}
        </UButton>
      </nav>

      <div class="mt-auto pt-6">
        <UButton
          variant="ghost"
          color="red"
          block
          class="justify-start"
          @click="logout"
        >
          🚪 Выйти
        </UButton>
      </div>
    </aside>

    <!-- Основной контент -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const menu = [
  { icon: '📊', label: 'Дашборд', to: '/admin' },
  { icon: '🌍', label: 'Страны', to: '/admin/countries' },
  { icon: '🏙', label: 'Города', to: '/admin/cities' },
  { icon: '📍', label: 'Места', to: '/admin/places' },
  { icon: '🏷', label: 'Теги', to: '/admin/tags' },
  { icon: '😀', label: 'Emoji-теги', to: '/admin/emoji-tags' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>