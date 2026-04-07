<script setup lang="ts">
import type { Folder } from '@/types/Folder';
import { Calendar, FolderPlus as FolderIcon, Inbox } from "lucide-vue-next"
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
import { computed, ref } from 'vue';


const { folders } = defineProps<{folders: Folder[]}>();

// for testing, delete later
const n = ref<number>(0) 

const emit = defineEmits<{
  (e: 'updating-folders', folders: Folder[]): void;
}>()

const sortedFolders = computed(() => sort(folders).asc(folder => folder.name));

const addFolder = () => {
  //test code, remake function later later
  let folder = {
    name: `Folder #${n.value}`,
    url: "#",
    icon: (n.value % 2) ? Calendar : Inbox,
  }
  n.value++;
  emit('updating-folders', [...folders, folder]);
}
</script>

<template>
  <Sidebar variant="inset" collapsible="none">
    <SidebarContent>
      <SidebarGroup>
        <div class="flex flex-row justify-between text-sm">
          <SidebarGroupLabel class="bgElement">Carpetas</SidebarGroupLabel>
          <a @click="addFolder" class ="justify-center gap-1 cursor-pointer hover:bg-gray-50 rounded-md p-2">
            <FolderIcon :size="20" />
            <span></span>
            </a>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="folder in sortedFolders" :key="folder.name">
                <SidebarMenuButton asChild class="undraggable">
                    <a :href="folder.url">
                      <component :is="folder.icon" />
                      <span class="bgElement">{{ folder.name }}</span>
                    </a>
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