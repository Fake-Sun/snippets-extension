<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import NewYorkH3 from '@/components/Typography/NewYorkH3.vue'
import type { Folder } from '@/types/Folder'
import { folderIconOptions, type FolderIconName } from '@/lib/folderIcons'
import { useI18n } from '@/lib/i18n'

const { t } = useI18n()

const props = defineProps<{
  folders: Folder[]
  initialFolder?: Folder | null
}>()

const emit = defineEmits<{
  (e: 'folder-saved', folders: Folder[], savedFolder: Folder): void
  (e: 'cancel-clicked'): void
}>()

const name = ref(props.initialFolder?.name ?? '')
const description = ref(props.initialFolder?.description ?? '')
const selectedIconName = ref<FolderIconName>(props.initialFolder?.iconName ?? 'folder')
const isEditing = computed(() => Boolean(props.initialFolder))
const initialFolderKey = computed(() => props.initialFolder ? folderKey(props.initialFolder) : undefined)

const normalizedName = computed(() => name.value.trim())
const nameExists = computed(() => {
  const nextName = normalizedName.value.toLocaleLowerCase()
  return props.folders.some(folder => {
    return folderKey(folder) !== initialFolderKey.value && folder.name.trim().toLocaleLowerCase() === nextName
  })
})
const canSave = computed(() => normalizedName.value.length > 0 && !nameExists.value)

function iconLabel(iconName: FolderIconName) {
  const labels: Record<FolderIconName, ReturnType<typeof t>> = {
    folder: t('iconFolder'),
    inbox: t('iconInbox'),
    code: t('iconCode'),
    briefcase: t('iconBriefcase'),
    book: t('iconBook'),
    star: t('iconStar'),
    archive: t('iconArchive'),
    bookmark: t('iconBookmark'),
    calendar: t('iconCalendar'),
    file: t('iconFile'),
    idea: t('iconIdea'),
    message: t('iconMessage'),
    rocket: t('iconRocket'),
    settings: t('iconSettings'),
    sparkles: t('iconSparkles'),
    tag: t('iconTag'),
    terminal: t('iconTerminal'),
    tools: t('iconTools'),
  }

  return labels[iconName]
}

function folderKey(folder: Folder) {
  return folder.id ?? folder.name
}

function onCancelButtonClick() {
  emit('cancel-clicked')
}

function onSaveButtonClick() {
  if (!canSave.value) return

  chrome.storage.local.get('folders', (result: { folders?: Folder[] }) => {
    const currentFolders = result.folders || []
    const savedFolder: Folder = {
      ...(props.initialFolder ?? {}),
      id: props.initialFolder?.id ?? crypto.randomUUID(),
      name: normalizedName.value,
      description: description.value.trim() || undefined,
      iconName: selectedIconName.value,
      url: '#',
    }

    const savedFolders = isEditing.value
      ? currentFolders.map(folder => folderKey(folder) === initialFolderKey.value ? savedFolder : folder)
      : [...currentFolders, savedFolder]

    chrome.storage.local.set({ folders: savedFolders }, () => {
      emit('folder-saved', savedFolders, savedFolder)
    })
  })
}
</script>

<template>
  <Card class="max-h-[calc(100vh-2rem)] w-[320px] overflow-hidden">
    <CardHeader class="pb-3">
      <NewYorkH3>{{ isEditing ? t('editFolder') : t('newFolder') }}</NewYorkH3>
    </CardHeader>
    <CardContent class="max-h-[calc(100vh-10rem)] overflow-y-auto pb-4">
      <form class="grid gap-3" @submit.prevent="onSaveButtonClick">
        <div class="grid gap-2">
          <Label for="folder-name">{{ t('name') }}</Label>
          <Input
            id="folder-name"
            v-model="name"
            :placeholder="t('folderNamePlaceholder')"
            autocomplete="off"
          />
          <p v-if="nameExists" class="text-sm text-destructive">
            {{ t('folderExists') }}
          </p>
        </div>

        <div class="grid gap-2">
          <Label for="folder-description">{{ t('description') }}</Label>
          <Textarea
            id="folder-description"
            v-model="description"
            class="max-h-16 min-h-16 resize-none"
            :placeholder="t('folderDescriptionPlaceholder')"
          />
        </div>

        <div class="grid gap-2">
          <Label>{{ t('icon') }}</Label>
          <div class="grid max-h-32 grid-cols-6 gap-1 overflow-y-auto pr-1">
            <Button
              v-for="option in folderIconOptions"
              :key="option.name"
              type="button"
              :variant="selectedIconName === option.name ? 'default' : 'outline'"
              class="h-9 w-9 p-0"
              :aria-label="iconLabel(option.name)"
              :title="iconLabel(option.name)"
              @click="selectedIconName = option.name"
            >
              <component :is="option.icon" :size="17" absoluteStrokeWidth />
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pt-0">
      <Button variant="outline" @click="onCancelButtonClick">{{ t('cancel') }}</Button>
      <Button :disabled="!canSave" @click="onSaveButtonClick">
        {{ isEditing ? t('saveChanges') : t('save') }}
      </Button>
    </CardFooter>
  </Card>
</template>

