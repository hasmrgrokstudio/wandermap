<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Теги</h1>
      <UButton @click="showForm = true" icon="i-heroicons-plus">
        Добавить
      </UButton>
    </div>

    <UTable :rows="tags" :columns="columns">
      <template #color-data="{ row }">
        <div
          v-if="row.color"
          class="w-6 h-6 rounded-full"
          :style="{ backgroundColor: row.color }"
        />
      </template>

      <template #places-data="{ row }">
        {{ row._count?.places || 0 }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton size="xs" variant="soft" @click="editTag(row)">
            Редактировать
          </UButton>
          <UButton size="xs" variant="soft" color="red" @click="deleteTag(row.id)">
            Удалить
          </UButton>
        </div>
      </template>
    </UTable>

    <UModal v-model="showForm">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editing ? 'Редактировать тег' : 'Новый тег' }}
          </h2>
        </template>

        <form @submit.prevent="save" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Название (RU)">
              <UInput v-model="form.nameRu" placeholder="Еда" />
            </UFormGroup>
            <UFormGroup label="Название (EN)">
              <UInput v-model="form.nameEn" placeholder="Food" />
            </UFormGroup>
          </div>

          <UFormGroup label="Slug">
            <UInput v-model="form.slug" placeholder="food" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Иконка">
              <UInput v-model="form.icon" placeholder="🍜" />
            </UFormGroup>
            <UFormGroup label="Цвет">
              <UInput v-model="form.color" type="color" />
            </UFormGroup>
          </div>

          <UFormGroup label="SEO Title">
            <UInput v-model="form.metaTitle" />
          </UFormGroup>

          <UFormGroup label="SEO Description">
            <UTextarea v-model="form.metaDesc" :rows="2" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Описание RU">
              <UTextarea
                v-model="form.descriptionRu"
                :rows="3"
                placeholder="Описание тега на русском"
              />
            </UFormGroup>
            <UFormGroup label="Описание EN">
              <UTextarea
                v-model="form.descriptionEn"
                :rows="3"
                placeholder="Tag description in English"
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

const { data: tags, refresh } = await useFetch<any[]>('/api/tags')

const columns = [
  { key: 'icon', label: '🏷' },
  { key: 'nameRu', label: 'Название' },
  { key: 'slug', label: 'Slug' },
  { key: 'color', label: 'Цвет' },
  { key: 'places', label: 'Мест' },
  { key: 'actions', label: '' }
]

const showForm = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)

const emptyForm = {
  nameRu: '',
  nameEn: '',
  slug: '',
  icon: '',
  color: '#3b82f6',
  metaTitle: '',
  metaDesc: '',
  descriptionRu: '',
  descriptionEn: ''
}

const form = ref({ ...emptyForm })

function editTag(tag: any) {
  editing.value = tag.id
  form.value = {
    nameRu: tag.nameRu || '',
    nameEn: tag.nameEn || '',
    slug: tag.slug || '',
    icon: tag.icon || '',
    color: tag.color || '#3b82f6',
    metaTitle: tag.metaTitle || '',
    metaDesc: tag.metaDesc || '',
    descriptionRu: tag.descriptionRu || '',
    descriptionEn: tag.descriptionEn || ''
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
      await $fetch(`/api/tags/${editing.value}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/tags', {
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

async function deleteTag(id: number) {
  if (!confirm('Удалить тег?')) return
  try {
    await $fetch(`/api/tags/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка удаления')
  }
}
</script>