<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Emoji-теги</h1>
      <UButton @click="showForm = true" icon="i-heroicons-plus">
        Добавить
      </UButton>
    </div>

    <UTable :rows="emojiTags" :columns="columns">
      <template #emoji-data="{ row }">
        <span class="text-2xl">{{ row.emoji }}</span>
      </template>

      <template #places-data="{ row }">
        {{ row._count?.places || 0 }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton size="xs" variant="soft" @click="editEmojiTag(row)">
            Редактировать
          </UButton>
          <UButton size="xs" variant="soft" color="red" @click="deleteEmojiTag(row.id)">
            Удалить
          </UButton>
        </div>
      </template>
    </UTable>

    <UModal v-model="showForm">
      <UCard>
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editing ? 'Редактировать emoji-тег' : 'Новый emoji-тег' }}
          </h2>
        </template>

        <form @submit.prevent="save" class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <UFormGroup label="Emoji">
              <UInput v-model="form.emoji" placeholder="🔥" class="text-2xl" />
            </UFormGroup>
            <UFormGroup label="Название (RU)">
              <UInput v-model="form.nameRu" placeholder="Огонь" />
            </UFormGroup>
            <UFormGroup label="Название (EN)">
              <UInput v-model="form.nameEn" placeholder="Fire" />
            </UFormGroup>
          </div>

          <UFormGroup label="Slug">
            <UInput v-model="form.slug" placeholder="fire" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Описание (RU)">
              <UTextarea v-model="form.descriptionRu" rows="2" />
            </UFormGroup>
            <UFormGroup label="Описание (EN)">
              <UTextarea v-model="form.descriptionEn" rows="2" />
            </UFormGroup>
          </div>

          <UFormGroup label="SEO Title">
            <UInput v-model="form.metaTitle" />
          </UFormGroup>

          <UFormGroup label="SEO Description">
            <UTextarea v-model="form.metaDesc" rows="2" />
          </UFormGroup>

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

const { data: emojiTags, refresh } = await useFetch<any[]>('/api/emoji-tags')

const columns = [
  { key: 'emoji', label: '😀' },
  { key: 'nameRu', label: 'Название' },
  { key: 'slug', label: 'Slug' },
  { key: 'places', label: 'Мест' },
  { key: 'actions', label: '' }
]

const showForm = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)

const emptyForm = {
  emoji: '',
  nameRu: '',
  nameEn: '',
  slug: '',
  descriptionRu: '',
  descriptionEn: '',
  metaTitle: '',
  metaDesc: ''
}

const form = ref({ ...emptyForm })

function editEmojiTag(et: any) {
  editing.value = et.id
  form.value = {
    emoji: et.emoji || '',
    nameRu: et.nameRu || '',
    nameEn: et.nameEn || '',
    slug: et.slug || '',
    descriptionRu: et.descriptionRu || '',
    descriptionEn: et.descriptionEn || '',
    metaTitle: et.metaTitle || '',
    metaDesc: et.metaDesc || ''
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
      await $fetch(`/api/emoji-tags/${editing.value}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/emoji-tags', {
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

async function deleteEmojiTag(id: number) {
  if (!confirm('Удалить emoji-тег?')) return
  try {
    await $fetch(`/api/emoji-tags/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e.data?.message || 'Ошибка удаления')
  }
}
</script>