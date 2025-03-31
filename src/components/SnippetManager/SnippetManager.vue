<script setup lang="ts">
import NewSnippet from './NewSnippet/NewSnippet.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';

let {snippets, isAddSnippetActive} = defineProps<{
  snippets: Snippet[],
  isAddSnippetActive: boolean
}>();

const emit = defineEmits<{
  (e: 'snippet-saved'): void
  (e: 'delete-snippet', identifier: string): void
  (e: 'toggle-add-snippet', value: boolean): void
  (e: 'edit-snippet', snippet: Snippet): void
}>();

function forwardSave() {
  emit('snippet-saved');
}

function forwardDeleteSnippet(shortcut: string) {
  emit('delete-snippet', shortcut)
}

function onAddSnippet (addingSnippet: boolean) {
  emit('toggle-add-snippet', addingSnippet)
}

</script>

<template>
  <div class="w-full">
    <SnippetList
      v-if="!isAddSnippetActive"
      :snippets
      @delete-snippet="forwardDeleteSnippet"
    />
    <NoSnippets
    v-if="snippets.length === 0 && !isAddSnippetActive"
    @toggle-add-snippet="onAddSnippet"
    />
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
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>