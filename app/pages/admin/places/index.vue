<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Места</h1>
      <UButton @click="showForm = true" icon="i-heroicons-plus">
        Добавить
      </UButton>
    </div>

    <!-- Фильтры -->
    <div class="flex gap-4 mb-4">
      <USelect
        v-model="filterCityId"
        :options="cityFilterOptions"
        placeholder="Все города"
        class="w-64"
      />
      <USelect
        v-model="filterTagId"
        :options="tagFilterOptions"
        placeholder="Все теги"
        class="w-48"
      />
    </div>

    <UTable :rows="filteredPlaces" :columns="columns">
      <template #city-data="{ row }">
        {{ row.city?.country?.flagEmoji }} {{ row.city?.nameRu }}
      </template>

      <template #rating-data="{ row }">
        {{ '⭐'.repeat(row.rating) }}
      </template>

      <template #priceLevel-data="{ row }">
        {{ '💲'.repeat(row.priceLevel) }}
      </template>

      <template #tags-data="{ row }">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="tag in row.tags"
            :key="tag.id"
            size="xs"
            variant="subtle"
          >
            {{ tag.nameRu }}
          </UBadge>
          <UBadge
            v-for="et in row.emojiTags"
            :key="'e' + et.id"
            size="xs"
            variant="subtle"
            color="amber"
          >
            {{ et.emoji }}
          </UBadge>
        </div>
      </template>

      <template #isPublished-data="{ row }">
        <UBadge :color="row.isPublished ? 'green' : 'gray'" size="xs">
          {{ row.isPublished ? 'Опубликовано' : 'Черновик' }}
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton size="xs" variant="soft" @click="editPlace(row)">
            Редактировать
          </UButton>
          <UButton size="xs" variant="soft" color="red" @click="deletePlace(row.id)">
            Удалить
          </UButton>
        </div>
      </template>
    </UTable>

    <!-- Модалка -->
    <UModal v-model="showForm" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editing ? 'Редактировать место' : 'Новое место' }}
          </h2>
        </template>

        <form @submit.prevent="save" class="space-y-4">
          <!-- Город -->
          <UFormGroup label="Город">
            <USelect
              v-model="form.cityId"
              :options="citySelectOptions"
              placeholder="Выберите город"
            />
          </UFormGroup>

          <!-- Названия -->
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Название (RU)">
              <UInput v-model="form.titleRu" placeholder="Louisiane Brewhouse" />
            </UFormGroup>
            <UFormGroup label="Название (EN)">
              <UInput v-model="form.titleEn" />
            </UFormGroup>
          </div>

          <UFormGroup label="Slug (URL)">
            <UInput v-model="form.slug" placeholder="louisiane-brewhouse" />
          </UFormGroup>

          <!-- Рейтинг и цена -->
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Рейтинг (1-5)">
              <USelect
                v-model="form.rating"
                :options="[
                  { label: '⭐', value: 1 },
                  { label: '⭐⭐', value: 2 },
                  { label: '⭐⭐⭐', value: 3 },
                  { label: '⭐⭐⭐⭐', value: 4 },
                  { label: '⭐⭐⭐⭐⭐', value: 5 }
                ]"
              />
            </UFormGroup>
            <UFormGroup label="Уровень цен (1-4)">
              <USelect
                v-model="form.priceLevel"
                :options="[
                  { label: '💲', value: 1 },
                  { label: '💲💲', value: 2 },
                  { label: '💲💲💲', value: 3 },
                  { label: '💲💲💲💲', value: 4 }
                ]"
              />
            </UFormGroup>
          </div>

          <!-- Отзыв -->
          <UFormGroup label="Отзыв (RU)">
            <UTextarea v-model="form.reviewRu" rows="3" />
          </UFormGroup>

          <UFormGroup label="Отзыв (EN)">
            <UTextarea v-model="form.reviewEn" rows="3" />
          </UFormGroup>

          <!-- Адрес и координаты -->
          <UFormGroup label="Адрес">
            <UInput v-model="form.address" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Широта">
              <UInput v-model="form.lat" type="number" step="any" />
            </UFormGroup>
            <UFormGroup label="Долгота">
              <UInput v-model="form.lng" type="number" step="any" />
            </UFormGroup>
          </div>

          <!-- Теги — множественный выбор -->
          <UFormGroup label="Теги">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in allTags"
                :key="tag.id"
                :color="form.tagIds.includes(tag.id) ? 'primary' : 'gray'"
                size="sm"
                class="cursor-pointer"
                @click="toggleTag(tag.id)"
              >
                {{ tag.nameRu }}
              </UBadge>
            </div>
          </UFormGroup>

          <!-- Emoji-теги — множественный выбор -->
          <UFormGroup label="Emoji-теги">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="et in allEmojiTags"
                :key="et.id"
                :color="form.emojiTagIds.includes(et.id) ? 'amber' : 'gray'"
                size="lg"
                class="cursor-pointer"
                @click="toggleEmojiTag(et.id)"
              >
                {{ et.emoji }} {{ et.nameRu }}
              </UBadge>
            </div>
          </UFormGroup>

          <!-- Публикация и дата -->
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Дата посещения">
              <UInput v-model="form.visitDate" type="date" />
            </UFormGroup>
            <UFormGroup label="Статус">
              <UToggle v-model="form.isPublished" />
              <span class="ml-2 text-sm text-gray-400">
                {{ form.isPublished ? 'Опубликовано' : 'Черновик' }}
              </span>
            </UFormGroup>
          </div>

          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="resetForm">Отмена</UButton>
            <UButton type="submit" :loading="saving">Сохранить</UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Загрузка всех данных
const { data: places, refresh } = await useFetch<any[]>('/api/places')
const { data: cities } = await useFetch<any[]>('/api/cities')
const { data: allTags } = await useFetch<any[]>('/api/tags')
const { data: allEmojiTags } = await useFetch<any[]>('/api/emoji-tags')

// Фильтры
const filterCityId = ref('')
const filterTagId = ref('')

const cityFilterOptions = computed(() => [
  { label: 'Все города', value: '' },
  ...(cities.value || []).map(c => ({
    label: `${c.country?.flagEmoji || ''} ${c.nameRu}`,
    value: String(c.id)
  }))
])

const tagFilterOptions = computed(() => [
  { label: 'Все теги', value: '' },
  ...(allTags.value || []).map(t => ({
    label: t.nameRu,
    value: String(t.id)
  }))
])

const filteredPlaces = computed(() => {
  let result = places.value || []
  if (filterCityId.value) {
    result = result.filter(p => p.cityId === Number(filterCityId.value))
  }
  if (filterTagId.value) {
    result = result.filter(p =>
      p.tags?.some((t: any) => t.id === Number(filterTagId.value))
    )
  }
  return result
})

// Селект города для формы
const citySelectOptions = computed(() =>
  (cities.value || []).map(c => ({
    label: `${c.country?.flagEmoji || ''} ${c.nameRu}`,
    value: c.id
  }))
)

const columns = [
  { key: 'titleRu', label: 'Название' },
  { key: 'city', label: 'Город' },
  { key: 'rating', label: 'Рейтинг' },
  { key: 'priceLevel', label: 'Цена' },
  { key: 'tags', label: 'Теги' },
  { key: 'isPublished', label: 'Статус' },
  { key: 'actions', label: '' }
]

// Форма
const showForm = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)

const emptyForm = {
  cityId: null as number | null,
  titleRu: '',
  titleEn: '',
  slug: '',
  rating: 3,
  priceLevel: 2,
  reviewRu: '',
  reviewEn: '',
  address: '',
  lat: '',
  lng: '',
  tagIds: [] as number[],
  emojiTagIds: [] as number[],
  isPublished: false,
  visitDate: ''
}

const form = ref({ ...emptyForm })

// Тогглы для тегов — клик добавляет/убирает
function toggleTag(id: number) {
  const idx = form.value.tagIds.indexOf(id)
  if (idx === -1) {
    form.value.tagIds.push(id)
  } else {
    form.value.tagIds.splice(idx, 1)
  }
}

function toggleEmojiTag(id: number) {
  const idx = form.value.emojiTagIds.indexOf(id)
  if (idx === -1) {
    form.value.emojiTagIds.push(id)
  } else {
    form.value.emojiTagIds.splice(idx, 1)
  }
}

function editPlace(place: any) {
  editing.value = place.id
  form.value = {
    cityId: place.cityId,
    titleRu: place.titleRu || '',
    titleEn: place.titleEn || '',
    slug: place.slug || '',
    rating: place.rating || 3,
    priceLevel: place.priceLevel || 2,
    reviewRu: place.reviewRu || '',
    reviewEn: place.reviewEn || '',
    address: place.address || '',
    lat: place.lat ?? '',
    lng: place.lng ?? '',
    tagIds: place.tags?.map((t: any) => t.id) || [],
    emojiTagIds: place.emojiTags?.map((t: any) => t.id) || [],
    isPublished: place.isPublished || false,
    visitDate: place.visitDate ? place.visitDate.split('T')[0] : ''
  }
  showForm.value = true
}

function resetForm() {
  form.value = { ...emptyForm, tagIds: [], emojiTagIds: [] }
  editing.value = null
  showForm.value = false
}

async function save() {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      cityId: Number(form.value.cityId),
      rating: Number(form.value.rating),
      priceLevel: Number(form.value.priceLevel),
      lat: form.value.lat !== '' ? Number(form.value.lat) : null,
      lng: form.value.lng !== '' ? Number(form.value.lng) : null,
      visitDate: form.value.visitDate || null
    }

    if (editing.value) {
      await $fetch(`/api/places/${editing.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/places', {
        method: 'POST',
        body: payload
      })
    }
    resetForm()
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка сохранения')
  } finally {
    saving.value = false
  }
}

async function deletePlace(id: number) {
  if (!confirm('Удалить место?')) return
  try {
    await $fetch(`/api/places/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка удаления')
  }
}
</script>