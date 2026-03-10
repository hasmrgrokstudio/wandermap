export default defineNuxtRouteMiddleware(async (to) => {
    // Не проверяем на странице логина (иначе бесконечный редирект)
    if (to.path === '/admin/login') return
  
    // Спрашиваем сервер — есть ли валидная сессия
    const { data } = await useFetch('/api/auth/me')
  
    if (!data.value || !(data.value as any).authenticated) {
      return navigateTo('/admin/login')
    }
  })