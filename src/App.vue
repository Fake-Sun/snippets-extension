<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
import SnippetNav from './components/SnippetNav.vue'

const snippets = ref<Snippet[]>([]);
const isAddSnippetActive = ref(false);

function loadSnippets() {
  try {
    chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
      snippets.value = (result.snippets && result.snippets.length > 0) ? result.snippets : [];
  });
  } catch (error) {
      console.log(error);
  }

}

function handleDeleteSnippet(shortcut: string) {
  // Assuming name is unique for this small, local project.
  const updatedSnippets = snippets.value.filter(snippet => snippet.shortcut !== shortcut);
  chrome.storage.local.set({ snippets: updatedSnippets }, () => {
    snippets.value = updatedSnippets;
  });
}

function onAddSnippet() {
  isAddSnippetActive.value = true;
}

onMounted(() => {
  loadSnippets();
});
</script>

<template>
  <SnippetNav @add-snippet="onAddSnippet"/>
  <div class="managerContainer">
    <SnippetManager 
    :snippets
    :is-add-snippet-active="isAddSnippetActive" 
    @snippet-saved="loadSnippets"
    @delete-snippet="handleDeleteSnippet"
    @toggle-add-snippet="val => isAddSnippetActive = val"
    />
  </div>
</template>

<style scoped>
.managerContainer {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
</style>