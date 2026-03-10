export default defineEventHandler(async (event) => {
    deleteCookie(event, 'wandermap_session', { path: '/' })
    return { message: 'Вы вышли' }
  })