<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
import { CirclePlus } from 'lucide-vue-next';
const snippets = ref<Snippet[]>([]);

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

onMounted(() => {
  loadSnippets();
});
</script>

<template>
  <div class="h-14 w-full bg-primary flex">
    <div>
      <CirclePlus :size="38" :stroke-width="3" class="addSnippetIcon" color="white"/>
    </div>
  </div>
  <div class="managerContainer">
    <SnippetManager :snippets @snippet-saved="loadSnippets" @delete-snippet="handleDeleteSnippet"
    />
  </div>
</template>

<style>
.addSnippetIcon {
  margin: 10px;

}
.managerContainer {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
</style>