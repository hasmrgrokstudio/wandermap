<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Страны</h1>
      <UButton @click="showForm = true" icon="i-heroicons-plus">
        Добавить
      </UButton>
    </div>

    <!-- Таблица стран -->
    <UTable :rows="countries" :columns="columns">
      <template #flagEmoji-data="{ row }">
        <span class="text-2xl">{{ row.flagEmoji }}</span>
      </template>

      <template #cities-data="{ row }">
        {{ row._count?.cities || 0 }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton
            size="xs"
            variant="soft"
            @click="editCountry(row)"
          >
            Редактировать
          </UButton>
          <UButton
            size="xs"
            variant="soft"
            color="red"
            @click="deleteCountry(row.id)"
          >
            Удалить
          </UButton>
        </div>
      </template>
    </UTable>

    <!-- Модалка создания/редактирования -->
    <UModal v-model="showForm">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editing ? 'Редактировать страну' : 'Новая страна' }}
          </h2>
        </template>

        <form @submit.prevent="save" class="space-y-4">
          <UFormGroup label="Название (RU)">
            <UInput v-model="form.nameRu" placeholder="Вьетнам" />
          </UFormGroup>

          <UFormGroup label="Название (EN)">
            <UInput v-model="form.nameEn" placeholder="Vietnam" />
          </UFormGroup>

          <UFormGroup label="Slug (URL)">
            <UInput v-model="form.slug" placeholder="vietnam" />
          </UFormGroup>

          <UFormGroup label="Флаг (emoji)">
            <UInput v-model="form.flagEmoji" placeholder="🇻🇳" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Описание RU">
              <UTextarea
                v-model="form.descriptionRu"
                placeholder="Краткое описание страны на русском"
                :rows="3"
              />
            </UFormGroup>

            <UFormGroup label="Описание EN">
              <UTextarea
                v-model="form.descriptionEn"
                placeholder="Short description in English"
                :rows="3"
              />
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

// Загрузка данных
const { data: countries, refresh } = await useFetch<any[]>('/api/countries')

// Колонки таблицы
const columns = [
  { key: 'flagEmoji', label: '🏴' },
  { key: 'nameRu', label: 'Название' },
  { key: 'slug', label: 'Slug' },
  { key: 'cities', label: 'Городов' },
  { key: 'actions', label: '' }
]

// Состояние формы
const showForm = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)

const emptyForm = {
  nameRu: '',
  nameEn: '',
  slug: '',
  flagEmoji: '',
  descriptionRu: '',
  descriptionEn: ''
}

const form = ref({ ...emptyForm })

function editCountry(country: any) {
  editing.value = country.id
  form.value = {
    nameRu: country.nameRu || '',
    nameEn: country.nameEn || '',
    slug: country.slug || '',
    flagEmoji: country.flagEmoji || '',
    descriptionRu: country.descriptionRu || '',
    descriptionEn: country.descriptionEn || ''
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
    if (editing.value) {
      await $fetch(`/api/countries/${editing.value}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/countries', {
        method: 'POST',
        body: form.value
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

async function deleteCountry(id: number) {
  if (!confirm('Удалить страну?')) return

  try {
    await $fetch(`/api/countries/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка удаления')
  }
}
</script>