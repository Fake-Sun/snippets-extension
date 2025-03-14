<script setup lang="ts">
import { ref } from 'vue';
import type { Snippet } from './types/Snippet';
import NewSnippet from './components/NewSnippet/NewSnippet.vue';
import NoSnippets from './components/NoSnippets/NoSnippets.vue';

let snippets = ref<Snippet[]>([]);
const isAddSnippetActive = ref(false);

function loadSnippets() {
  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    snippets.value = result.snippets || [];
    console.log("Loaded snippets:", snippets.value);
  });
}
chrome.runtime.onStartup.addListener(() => {
  console.log("Browser startup - loading snippets");
  loadSnippets();
});


</script>

<template>
  <div class="mainWrapper">
    <!-- Show NoSnippets if there are no snippets and NewSnippet is not active -->
    <NoSnippets v-if="snippets.length === 0 && !isAddSnippetActive" @toggle-add-snippet="isAddSnippetActive = $event"/>
    <div class="newSnippetWrapper" v-if="isAddSnippetActive">
      <NewSnippet @toggle-add-snippet="isAddSnippetActive = $event"/>
    </div>
  </div>
</template>

<style>
.mainWrapper {
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 30px;
}
.newSnippetWrapper {
  padding: 5px
}
</style>