<script setup lang="ts">
/// <reference types="chrome"/>

import { ref, onMounted } from 'vue';
import SnippetManager from './components/SnippetManager/SnippetManager.vue';
import type { Snippet } from './types/Snippet';
// import type { Folder } from './types/Folder';
import SnippetNav from './components/SnippetNav.vue'

const snippets = ref<Snippet[]>([]);
// const currentFolder = ref<Folder>();
const isAddSnippetActive = ref(false);

function loadSnippets() {
  // snippets.value = [
  //   {name: 'Greet', shortcut: '/greet', text: 'Hello, how can I help you today?'},
  //   {name: 'Farewell', shortcut: '/bye', text: 'Goodbye! Have a great day.'},
  //   {name: 'Apology', shortcut: '/apology', text: "I'm sorry for the inconvenience. Let me check on that for you."},
  //   {name: 'Clarification Request', shortcut: '/clarify', text: 'Could you please provide more details so I can better assist you?'},
  //   {
  //   "name": "Past 90 Days - Empathetic",
  //   "text": "Thank you so much for reaching out and letting us know. I’m really sorry to hear that your leggings didn’t hold up as expected. Since the order was placed over 90 days ago, it’s unfortunately no longer eligible for a return or exchange. That said, I’d be more than happy to offer you 20% off one item as a courtesy for the inconvenience. Please let me know if you’d like to apply that to your next order.",
  //   "shortcut": "/past90_empathetic"
  // },
  // {
  //   "name": "Past 90 Days - Professional",
  //   "text": "Thank you for contacting us regarding your order. While we appreciate your long-term satisfaction with our products, this particular item falls outside of our 90-day return and exchange policy. However, we’d like to make it right by offering you 20% off one item as a gesture of goodwill. Please let us know if you’d like to use this offer on your next purchase.",
  //   "shortcut": "/past90_professional"
  // }
  // ];
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

onMounted(() => { loadSnippets(); console.log(snippets) });

</script>

<template>
  <SnippetNav @add-snippet="onAddSnippet"/>
  <div class="managerContainer w-full">
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
}
</style>