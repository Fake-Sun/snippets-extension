<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
import { CirclePlus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
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
  <div class="h-14 p-2 w-full bg-primary flex flex-row-reverse items-center">
    <div class="flex items-center gap-2">
      <Label class="clickable">New Snippet</Label>
      <CirclePlus :size="25" absoluteStrokeWidth color="white" class="clickable"/>
    </div>
  </div>
  <div class="managerContainer">
    <SnippetManager :snippets @snippet-saved="loadSnippets" @delete-snippet="handleDeleteSnippet"
    />
  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}
.managerContainer {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
</style>