<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import type { Folder } from '@/types/Folder'
import { House, Pencil } from 'lucide-vue-next'
import DeleteFolderButton from '../DeleteFolderButton/DeleteFolderButton.vue'
import { useI18n } from '@/lib/i18n'

const { t } = useI18n()

function folderKey(folder: Folder) {
  return folder.id ?? folder.name
}

defineProps<{
  selectedFolder?: Folder | null
}>()

const emit = defineEmits<{
  (e: 'go-home'): void
  (e: 'edit-folder'): void
  (e: 'delete-folder', folderId: string): void
}>()
</script>

<template>
  <div class="flex min-h-11 items-center justify-between gap-2 border-b px-4 py-2">
    <Breadcrumb class="min-w-0">
      <BreadcrumbList class="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink
            as="button"
            class="inline-flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground"
            @click="emit('go-home')"
          >
            <House :size="15" absoluteStrokeWidth />{{ t('home') }}</BreadcrumbLink>
        </BreadcrumbItem>
        <template v-if="selectedFolder">
          <BreadcrumbSeparator />
          <BreadcrumbItem class="min-w-0">
            <BreadcrumbPage class="max-w-[150px] truncate font-medium">
              {{ selectedFolder.name }}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </template>
      </BreadcrumbList>
    </Breadcrumb>

    <div v-if="selectedFolder" class="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 text-muted-foreground hover:text-foreground"
        :aria-label="t('editFolder')"
        :title="t('editFolder')"
        @click="emit('edit-folder')"
      >
        <Pencil :size="16" absoluteStrokeWidth />
      </Button>
      <DeleteFolderButton
        :folder-id="folderKey(selectedFolder)"
        :folder-name="selectedFolder.name"
        @confirm-delete="folderId => emit('delete-folder', folderId)"
      />
    </div>
  </div>
</template>
