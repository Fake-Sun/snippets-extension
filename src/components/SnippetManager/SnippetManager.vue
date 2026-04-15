<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import FolderEntry from './EntryForms/FolderEntry.vue';
import SnippetEntry from './EntryForms/SnippetEntry.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import SnippetPagination from './Pagination/SnippetPagination.vue';
import SnippetBreadcrumb from './Breadcrumb/SnippetBreadcrumb.vue';
import type { Snippet } from '@/types/Snippet';
import { SidebarProvider } from "@/components/ui/sidebar";
import SnippetsSidebar from './SnippetsSidebar/SnippetsSidebar.vue';
import type { Folder } from '@/types/Folder';

const { snippets, folders, isAddSnippetActive } = defineProps<{
  snippets: Snippet[],
  folders: Folder[],
  isAddSnippetActive: boolean
}>();

const snippetToEdit = ref<Snippet | null>(null);
const selectedFolderId = ref<string | undefined>();
const isAddFolderActive = ref(false);
const folderToEdit = ref<Folder | null>(null);
const snippetsPage = ref(1);
const snippetsPerPage = 5;

const selectedFolder = computed(() => {
  return folders.find(folder => folderKey(folder) === selectedFolderId.value) ?? null;
});

const visibleSnippets = computed(() => {
  if (!selectedFolderId.value) return snippets;
  return snippets.filter(snippet => snippet.folderId === selectedFolderId.value);
});

const pageCount = computed(() => Math.max(1, Math.ceil(visibleSnippets.value.length / snippetsPerPage)));
const paginatedSnippets = computed(() => {
  const start = (snippetsPage.value - 1) * snippetsPerPage;
  return visibleSnippets.value.slice(start, start + snippetsPerPage);
});

watch([selectedFolderId, visibleSnippets], () => {
  if (snippetsPage.value > pageCount.value) {
    snippetsPage.value = pageCount.value;
    return;
  }

  snippetsPage.value = 1;
});

const emit = defineEmits<{
  (e: 'snippet-saved'): void;
  (e: 'delete-snippet', identifier: string): void;
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'edit-snippet', snippet: Snippet): void;
  (e: 'toggle-add-folder', value: boolean): void;
  (e: 'folder-saved', folders: Folder[]): void;
  (e: 'folder-deleted', folders: Folder[], snippets: Snippet[]): void;
}>();

function folderKey(folder: Folder) {
  return folder.id ?? folder.name;
}

function forwardSave() {
  snippetToEdit.value = null;
  emit('snippet-saved');
}

function forwardDeleteSnippet(id: string) {
  emit('delete-snippet', id);
}

function onAddSnippet(adding: boolean) {
  if (adding) {
    isAddFolderActive.value = false;
    folderToEdit.value = null;
  }
  emit('toggle-add-snippet', adding);
}

function onCancelSnippet() {
  snippetToEdit.value = null;
  emit('toggle-add-snippet', false);
}

function onEditSnippet(snippet: Snippet) {
  isAddFolderActive.value = false;
  folderToEdit.value = null;
  snippetToEdit.value = snippet;
  emit('toggle-add-snippet', true);
}

function onAddFolder() {
  snippetToEdit.value = null;
  folderToEdit.value = null;
  isAddFolderActive.value = true;
  emit('toggle-add-snippet', false);
  emit('toggle-add-folder', true);
}

function onEditFolder() {
  if (!selectedFolder.value) return;
  snippetToEdit.value = null;
  folderToEdit.value = selectedFolder.value;
  isAddFolderActive.value = true;
  emit('toggle-add-snippet', false);
  emit('toggle-add-folder', true);
}

function onCancelFolder() {
  isAddFolderActive.value = false;
  folderToEdit.value = null;
  emit('toggle-add-folder', false);
}

function onSelectFolder(folder: Folder) {
  selectedFolderId.value = folderKey(folder);
}

function onGoHome() {
  selectedFolderId.value = undefined;
}

function onDeleteFolder(folderId: string) {
  const updatedFolders = folders.filter(folder => folderKey(folder) !== folderId);
  const updatedSnippets = snippets.map(snippet => {
    if (snippet.folderId !== folderId) return snippet;
    const { folderId: _folderId, ...snippetWithoutFolder } = snippet;
    void _folderId;
    return snippetWithoutFolder;
  });

  chrome.storage.local.set({ folders: updatedFolders, snippets: updatedSnippets }, () => {
    selectedFolderId.value = undefined;
    emit('folder-deleted', updatedFolders, updatedSnippets);
  });
}

function forwardAddfolder(savedFolders: Folder[], savedFolder: Folder) {
  isAddFolderActive.value = false;
  folderToEdit.value = null;
  selectedFolderId.value = folderKey(savedFolder);
  emit('folder-saved', savedFolders);
  emit('toggle-add-folder', false);
}
</script>

<template>
  <div class="relative flex h-full w-full">
    <div class="pointer-events-auto flex h-full w-full" :class="{ 'select-none': isAddSnippetActive || isAddFolderActive }">
      <SidebarProvider class="h-full !min-h-0 !w-auto shrink-0">
        <SnippetsSidebar
          :folders
          :selected-folder-id="selectedFolderId"
          @add-folder="onAddFolder"
          @select-folder="onSelectFolder"
          class="h-full border-r border-border bg-white"
        />
      </SidebarProvider>

      <div class="min-w-[400px] flex-1">
        <SnippetBreadcrumb
          :selected-folder="selectedFolder"
          @go-home="onGoHome"
          @edit-folder="onEditFolder"
          @delete-folder="onDeleteFolder"
        />
        <SnippetList
          v-if="visibleSnippets.length > 0"
          :snippets="paginatedSnippets"
          @delete-snippet="forwardDeleteSnippet"
          @edit-snippet="onEditSnippet"
        />
        <NoSnippets
          v-if="visibleSnippets.length == 0"
          @toggle-add-snippet="onAddSnippet"
        />
        <SnippetPagination
          v-if="visibleSnippets.length > snippetsPerPage"
          v-model:page="snippetsPage"
          class="px-4 pb-2"
          :total="visibleSnippets.length"
          :items-per-page="snippetsPerPage"
        />
      </div>
    </div>

  </div>

  <Teleport to="#app">
    <div
      v-if="isAddSnippetActive || isAddFolderActive"
      class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-muted-foreground/20 p-4 backdrop-blur-[2px]"
    >
      <SnippetEntry
        v-if="isAddSnippetActive"
        class="shadow-lg"
        :initialName="snippetToEdit?.name || ''"
        :initialText="snippetToEdit?.text || ''"
        :initialShortcut="snippetToEdit?.shortcut || ''"
        :initialFolderId="snippetToEdit?.folderId || selectedFolderId"
        :snippetId="snippetToEdit?.id || ''"
        :folders
        @snippet-saved="forwardSave"
        @toggle-add-snippet="onAddSnippet"
        @edit-snippet="onEditSnippet"
        @cancel-clicked="onCancelSnippet"
        :snippets
      />
      <FolderEntry
        v-else
        class="shadow-lg"
        :folders
        :initial-folder="folderToEdit"
        @folder-saved="forwardAddfolder"
        @cancel-clicked="onCancelFolder"
      />
    </div>
  </Teleport>
</template>








