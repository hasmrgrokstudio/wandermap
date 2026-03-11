<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Города</h1>
      <UButton @click="showForm = true" icon="i-heroicons-plus">
        Добавить
      </UButton>
    </div>

    <!-- Фильтр по стране -->
    <div class="mb-4">
      <USelect
        v-model="filterCountryId"
        :options="countryOptions"
        placeholder="Все страны"
        class="w-64"
      />
    </div>

    <UTable :rows="filteredCities" :columns="columns">
      <template #country-data="{ row }">
        {{ row.country?.flagEmoji }} {{ row.country?.nameRu }}
      </template>

      <template #places-data="{ row }">
        {{ row._count?.places || 0 }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton size="xs" variant="soft" @click="editCity(row)">
            Редактировать
          </UButton>
          <UButton size="xs" variant="soft" color="red" @click="deleteCity(row.id)">
            Удалить
          </UButton>
        </div>
      </template>
    </UTable>

    <!-- Модалка -->
    <UModal v-model="showForm">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editing ? 'Редактировать город' : 'Новый город' }}
          </h2>
        </template>

        <form @submit.prevent="save" class="space-y-4">
          <UFormGroup label="Страна">
            <USelect
              v-model="form.countryId"
              :options="countrySelectOptions"
              placeholder="Выберите страну"
            />
          </UFormGroup>

          <UFormGroup label="Название (RU)">
            <UInput v-model="form.nameRu" placeholder="Нячанг" />
          </UFormGroup>

          <UFormGroup label="Название (EN)">
            <UInput v-model="form.nameEn" placeholder="Nha Trang" />
          </UFormGroup>

          <UFormGroup label="Slug (URL)">
            <UInput v-model="form.slug" placeholder="nha-trang" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Описание RU">
              <UTextarea v-model="form.descriptionRu" :rows="3" />
            </UFormGroup>
            <UFormGroup label="Описание EN">
              <UTextarea v-model="form.descriptionEn" :rows="3" />
            </UFormGroup>
          </div>

          <UFormGroup label="SEO Title">
            <UInput v-model="form.metaTitle" />
          </UFormGroup>

          <UFormGroup label="SEO Description">
            <UTextarea v-model="form.metaDesc" :rows="2" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Широта (lat)">
              <UInput v-model="form.lat" type="number" step="any" />
            </UFormGroup>
            <UFormGroup label="Долгота (lng)">
              <UInput v-model="form.lng" type="number" step="any" />
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

const { data: cities, refresh } = await useFetch<any[]>('/api/cities')
const { data: countries } = await useFetch<any[]>('/api/countries')

// Фильтр по стране
const filterCountryId = ref('')

const countryOptions = computed(() => [
  { label: 'Все страны', value: '' },
  ...(countries.value || []).map(c => ({
    label: `${c.flagEmoji || ''} ${c.nameRu}`,
    value: String(c.id)
  }))
])

const filteredCities = computed(() => {
  if (!filterCountryId.value) return cities.value || []
  return (cities.value || []).filter(
    c => c.countryId === Number(filterCountryId.value)
  )
})

// Опции для селекта в форме (без "Все страны")
const countrySelectOptions = computed(() =>
  (countries.value || []).map(c => ({
    label: `${c.flagEmoji || ''} ${c.nameRu}`,
    value: c.id
  }))
)

const columns = [
  { key: 'country', label: 'Страна' },
  { key: 'nameRu', label: 'Название' },
  { key: 'slug', label: 'Slug' },
  { key: 'places', label: 'Мест' },
  { key: 'actions', label: '' }
]

// Форма
const showForm = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)

const emptyForm = {
  countryId: null as number | null,
  nameRu: '',
  nameEn: '',
  slug: '',
  descriptionRu: '',
  descriptionEn: '',
  lat: '',
  lng: '',
  metaTitle: '',
  metaDesc: ''
}

const form = ref({ ...emptyForm })

function editCity(city: any) {
  editing.value = city.id
  form.value = {
    countryId: city.countryId,
    nameRu: city.nameRu || '',
    nameEn: city.nameEn || '',
    slug: city.slug || '',
    descriptionRu: city.descriptionRu || '',
    descriptionEn: city.descriptionEn || '',
    lat: city.lat ?? '',
    lng: city.lng ?? '',
    metaTitle: city.metaTitle || '',
    metaDesc: city.metaDesc || ''
  }
  showForm.value = true
}

function resetForm() {
  form.value = { ...emptyForm }
  editing.value = null
  showForm.value = false
}

async function save() {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      countryId: Number(form.value.countryId),
      lat: form.value.lat !== '' ? Number(form.value.lat) : null,
      lng: form.value.lng !== '' ? Number(form.value.lng) : null
    }

    if (editing.value) {
      await $fetch(`/api/cities/${editing.value}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/cities', {
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

async function deleteCity(id: number) {
  if (!confirm('Удалить город?')) return
  try {
    await $fetch(`/api/cities/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка удаления')
  }
}
</script>