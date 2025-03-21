<script setup lang="ts">
import { ref } from 'vue';
import NewSnippet from './NewSnippet/NewSnippet.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';

const isAddSnippetActive = ref(false);
const { snippets } = defineProps<{snippets: Snippet[]}>();

const emit = defineEmits<{
  (e: 'snippet-saved'): void;
  (e: 'delete-snippet', identifier: string): void;
  (e: 'toggle-add-snippet', value: boolean): void;
}>();

function forwardSave() {
  emit('snippet-saved');
}

function forwardDeleteSnippet(shortcut: string) {
  emit('delete-snippet', shortcut);
}
</script>

<template>
  <div class="w-full">
    <SnippetList :snippets @delete-snippet="forwardDeleteSnippet"/>  
    <!-- Show NoSnippets if there are no snippets and NewSnippet is not active -->
    <NoSnippets v-if="snippets.length === 0 && !isAddSnippetActive" @toggle-add-snippet="isAddSnippetActive = $event"/>
    <div class="newSnippetWrapper" v-if="isAddSnippetActive">
      <NewSnippet @snippet-saved="forwardSave" @toggle-add-snippet="isAddSnippetActive = $event"/>
    </div>
  </div>
</template>

<style scoped>
.newSnippetWrapper {
  padding: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>