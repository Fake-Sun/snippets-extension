<script setup lang="ts">
import { ref, computed } from 'vue';
import NewSnippet from './NewSnippet/NewSnippet.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';
import FolderCard from './Cards/FolderCard.vue'

const currentPath = ref<string[]>(['Home'])

const allFolders = [
  { name: 'Frontend', path: ['Home'] },
  { name: 'Backend', path: ['Home'] },
  { name: 'Vue', path: ['Home', 'Frontend'] },
]

const isLeafFolder = computed(() =>
  !allFolders.some(folder =>
    JSON.stringify(folder.path) === JSON.stringify(currentPath.value)
      ? false
      : JSON.stringify(folder.path.slice(0, currentPath.value.length)) === JSON.stringify(currentPath.value)
  )
)

const foldersInCurrent = computed(() =>
  allFolders.filter(folder =>
    JSON.stringify(folder.path) === JSON.stringify(currentPath.value)
  )
)

const snippetsInCurrent = computed(() =>
  snippets.filter(snippet =>
    JSON.stringify(snippet.folderPath ?? ['Home']) === JSON.stringify(currentPath.value)
  )
)

function openFolder(name: string) {
  currentPath.value.push(name)
}

const { snippets, isAddSnippetActive } = defineProps<{
  snippets: Snippet[],
  isAddSnippetActive: boolean
}>();

const emit = defineEmits<{
  (e: 'snippet-saved'): void;
  (e: 'delete-snippet', identifier: string): void;
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'edit-snippet', snippet: Snippet): void;
}>();

function forwardSave() {
  emit('snippet-saved');
}

function forwardDeleteSnippet(shortcut: string) {
  emit('delete-snippet', shortcut);
}

function onAddSnippet(adding: boolean) {
  emit('toggle-add-snippet', adding);
}

const snippetToEdit = ref<Snippet | null>(null);

function onEditSnippet(snippet: Snippet) {
  snippetToEdit.value = snippet;
  emit('toggle-add-snippet', true);
}
</script>

<template>
  <div class="min-w-[400px] space-y-4">
    <!-- Folders if not a leaf -->
    <div
      v-if="!isLeafFolder"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
    >
      <FolderCard
        v-for="folder in foldersInCurrent"
        :key="folder.name"
        :name="folder.name"
        @click="openFolder(folder.name)"
      />
    </div>

    <!-- Snippet list if leaf -->
    <SnippetList
      v-if="isLeafFolder && snippetsInCurrent.length && !isAddSnippetActive"
      :snippets="snippetsInCurrent"
      @delete-snippet="forwardDeleteSnippet"
      @edit-snippet="onEditSnippet"
    />

    <!-- No snippets in leaf -->
    <NoSnippets
      v-if="isLeafFolder && !snippetsInCurrent.length && !isAddSnippetActive"
      @toggle-add-snippet="onAddSnippet"
    />

    <!-- New Snippet form -->
    <div v-if="isAddSnippetActive" class="newSnippetWrapper">
      <NewSnippet
        :initialName="snippetToEdit?.name || ''"
        :initialText="snippetToEdit?.text || ''"
        :initialShortcut="snippetToEdit?.shortcut || ''"
        @snippet-saved="forwardSave"
        @toggle-add-snippet="onAddSnippet"
        @edit-snippet="onEditSnippet"
      />
    </div>
  </div>
</template>


<style scoped>
.newSnippetWrapper {
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
