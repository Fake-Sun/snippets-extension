<script setup lang="ts">
import { ref } from 'vue';
import NewSnippet from './NewSnippet/NewSnippet.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';

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

function onEditSnippet(snippet: Snippet) {
  emit('toggle-add-snippet', true);
}
</script>

<template>
  <div class="w-full">
    <!-- Show the list when not adding/editing -->
    <SnippetList 
      v-if="!isAddSnippetActive" 
      :snippets="snippets" 
      @delete-snippet="forwardDeleteSnippet" 
      @edit-snippet="onEditSnippet" 
    />

    <!-- If there are no snippets and not in add/edit mode -->
    <NoSnippets
      v-if="snippets.length === 0 && !isAddSnippetActive"
      @toggle-add-snippet="onAddSnippet"
    />

    <!-- Show the NewSnippet form when add/edit mode is active -->
    <div class="newSnippetWrapper" v-if="isAddSnippetActive">
      <NewSnippet
        @snippet-saved="forwardSave"
        @toggle-add-snippet="onAddSnippet"
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
