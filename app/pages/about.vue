<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="max-w-3xl mx-auto px-6 pt-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
      <span class="mx-2">→</span>
      <span class="text-white">Обо мне</span>
    </nav>

    <article class="max-w-3xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-6">Обо мне</h1>
      <div class="text-gray-300 leading-relaxed space-y-4">
        <p>
          Привет! Я путешествую по Азии и собираю свой каталог проверенных мест —
          от уличной еды до руфтоп-баров.
        </p>
        <p>
          Каждое место в WanderMap я посетил лично. Оценки честные,
          отзывы — без рекламы и партнёрок.
        </p>
        <p>
          Проект сделан на Nuxt 3 + Prisma + PostgreSQL как учебный pet-project
          в рамках изучения Vue/Node.js стека.
        </p>
      </div>
    </article>
  </div>
</template>