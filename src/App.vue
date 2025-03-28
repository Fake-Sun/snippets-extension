<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
import { CirclePlus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
const snippets = ref<Snippet[]>([]);

const emit = defineEmits<{
  (e: 'add-snippet'): void;
}>();

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

const forwardNewSnippet = () => {
  emit('add-snippet');
}

onMounted(() => {
  loadSnippets();
});
</script>

<template>
  <div class="h-14 p-2 w-full bg-primary flex flex-row-reverse items-center">
    <div class="p-2 flex items-center gap-2 newSnippetWrapper clickable" @click="forwardNewSnippet">
      <Label style="color: white" class="clickable">Nuevo Snippet</Label>
      <CirclePlus :size="27" absoluteStrokeWidth color="white" class="clickable"/>
    </div>
  </div>
  <div class="managerContainer">
    <SnippetManager :snippets @snippet-saved="loadSnippets" @delete-snippet="handleDeleteSnippet"
    />
  </div>
</template>

<style scoped>
.newSnippetWrapper {
  transition: transform 0.25s;
}
.newSnippetWrapper:hover {

  background-color: rgb(235, 111, 132);
  border-radius: 10px;
}
.clickable {
  cursor: pointer;
}
.managerContainer {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
</style>