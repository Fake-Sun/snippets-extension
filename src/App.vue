<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
import type { Folder } from './types/Folder';
import SnippetNav from './components/SnippetNav.vue'
import { provideI18n, type LanguageCode } from './lib/i18n'

const snippets = ref<Snippet[]>([]);
const folders = ref<Folder[]>([]);
const isAddSnippetActive = ref(false);
const { setLocale } = provideI18n();

function loadSnippets() {
  try {
    chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
      snippets.value = (result.snippets && result.snippets.length > 0) ? result.snippets : [];
    });
  } catch (error) {
    console.log(error);
  }
}

function handleDeleteSnippet(id: string) {
  const updatedSnippets = snippets.value.filter(snippet => snippet.id !== id);
  chrome.storage.local.set({ snippets: updatedSnippets }, () => {
    snippets.value = updatedSnippets;
  });
}

function onAddSnippet() {
  isAddSnippetActive.value = true;
}

function loadFolders() {
  try {
    chrome.storage.local.get("folders", (result: { folders?: Folder[] }) => {
      folders.value = (result.folders && result.folders.length > 0) ? result.folders : [];
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

const savingFolders = (savedFolders: Folder[]) => {
  folders.value = savedFolders;
}

const handleFolderDeleted = (savedFolders: Folder[], savedSnippets: Snippet[]) => {
  folders.value = savedFolders;
  snippets.value = savedSnippets;
}

function loadSettings() {
  chrome.storage.local.get('settings', (result: { settings?: { language?: LanguageCode } }) => {
    if (result.settings?.language) {
      setLocale(result.settings.language);
    }
  });
}

onMounted(() => { loadSettings(); loadSnippets(); loadFolders(); });

</script>

<template>
  <SnippetNav :isAddSnippetActive @add-snippet="onAddSnippet"/>
  <div class="managerContainer w-full flex-1 overflow-y-auto overflow-x-hidden">
    <SnippetManager
      :snippets
      :folders
      :is-add-snippet-active="isAddSnippetActive"
      @snippet-saved="loadSnippets"
      @folder-saved="savedFolders => savingFolders(savedFolders)"
      @folder-deleted="(savedFolders, savedSnippets) => handleFolderDeleted(savedFolders, savedSnippets)"
      @delete-snippet="handleDeleteSnippet"
      @toggle-add-snippet="val => isAddSnippetActive = val"
    />
  </div>
</template>

<style scoped>
.managerContainer {
  justify-content: center;
  display: flex;
  align-items: start;
  min-height: 0;
}
</style>



