<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/TemplateManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';

const snippets = ref<Snippet[]>([]);

function loadSnippets() {
  try {
    chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
      snippets.value = (result.snippets && result.snippets.length > 0) ? result.snippets : [];
      console.log("Loaded snippets:", snippets.value);
  });
  } catch (error) {
      console.log(error);
  }

}

function clearStorage() {
  chrome.storage.local.clear(() => {
    console.log("Chrome storage has been cleared.");
  });
}
onMounted(() => {
  console.log("Browser startup - loading snippets");
  loadSnippets();
  clearStorage();
});
</script>

<template>
  <div class="mainWrapper">
    <SnippetManager @snippet-saved="loadSnippets" :snippets/>
  </div>
</template>

<style>
#app {
  min-width: 500px;
  max-width: 600px;
}
.mainWrapper {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
</style>