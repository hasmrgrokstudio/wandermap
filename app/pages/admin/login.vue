<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-center">WanderMap Admin</h1>
      </template>

      <form @submit.prevent="login">
        <UFormGroup label="Пароль" :error="error">
          <UInput
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            size="lg"
          />
        </UFormGroup>

        <UButton
          type="submit"
          block
          size="lg"
          class="mt-4"
          :loading="loading"
        >
          Войти
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false // без общего лейаута — чистая страница
})

const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  loading.value = true
  error.value = ''

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })
    // Успех — cookie уже установлен сервером, переходим в админку
    await navigateTo('/admin')
  } catch (e: any) {
    error.value = 'Неверный пароль'
  } finally {
    loading.value = false
  }
}
</script>