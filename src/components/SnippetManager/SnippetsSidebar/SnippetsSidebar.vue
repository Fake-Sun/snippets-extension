<script setup lang="ts">
import type { Folder } from '@/types/Folder';
import { Button } from '@/components/ui/button'
import { FolderPlus } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sort } from "fast-sort"
import { computed } from 'vue';
import { getFolderIcon } from '@/lib/folderIcons';

const props = defineProps<{
  folders: Folder[]
  selectedFolderId?: string
}>();

const emit = defineEmits<{
  (e: 'add-folder'): void;
  (e: 'select-folder', folder: Folder): void;
}>()

const sortedFolders = computed(() => sort(props.folders).asc(folder => folder.name));

function resolveFolderIcon(folder: Folder) {
  return folder.icon ?? getFolderIcon(folder.iconName)
}
</script>

<template>
  <Sidebar variant="inset" collapsible="none">
    <SidebarContent>
      <SidebarGroup>
        <div class="flex flex-row items-center justify-between text-sm">
          <SidebarGroupLabel class="bgElement">Carpetas</SidebarGroupLabel>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8"
            aria-label="Agregar carpeta"
            @click="emit('add-folder')"
          >
            <FolderPlus :size="20" />
          </Button>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="folder in sortedFolders" :key="folder.id ?? folder.name">
              <SidebarMenuButton
                class="undraggable"
                :is-active="selectedFolderId === (folder.id ?? folder.name)"
                @click="emit('select-folder', folder)"
              >
                <component :is="resolveFolderIcon(folder)" />
                <span class="bgElement">{{ folder.name }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<style scoped>
.bgElement {
 pointer-events: none;
 user-select: none;
}
.undraggable {
  -webkit-user-drag: none;
}
</style>