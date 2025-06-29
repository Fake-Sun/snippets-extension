<script setup lang="ts">
import { ref } from 'vue';
import SnippetEntry from './EntryForms/SnippetEntry.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';
// import SnippetBreadCrumb from './Breadcrumb/SnippetBreadcrumb.vue';

const { snippets, isAddSnippetActive } = defineProps<{
  snippets: Snippet[],
  isAddSnippetActive: boolean
}>();

const emit = defineEmits<{
  (e: 'snippet-saved'): void;
  (e: 'delete-snippet', identifier: string): void;
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'edit-snippet', snippet: Snippet): void;
  (e: 'toggle-add-folder', value: boolean): void;
}>();

function forwardSave() {
  snippetToEdit.value = null; // Reset the snippet to edit after saving
  emit('snippet-saved');
}

function forwardDeleteSnippet(id: string) {
  emit('delete-snippet', id);
}

function onAddSnippet(adding: boolean) {
  emit('toggle-add-snippet', adding);
}

function onCancelSnippet() {
  snippetToEdit.value = null; // Reset the snippet to edit when canceling
  emit('toggle-add-snippet', false);
}

const snippetToEdit = ref<Snippet | null>(null);

function onEditSnippet(snippet: Snippet) {
  snippetToEdit.value = snippet;
  emit('toggle-add-snippet', true);
}
</script>

<template>
  <div class="min-w-[400px]">
    <!-- <SnippetBreadCrumb class="justify-start p-2"/> -->
    <SnippetList
      v-if="!isAddSnippetActive && snippets.length > 0"
      :snippets
      @delete-snippet="forwardDeleteSnippet"
      @edit-snippet="onEditSnippet"
    />
    <NoSnippets
      v-if="snippets.length == 0 && !isAddSnippetActive"
      @toggle-add-snippet="onAddSnippet"
    />
    <div v-if="isAddSnippetActive" class="newSnippetWrapper">
      <SnippetEntry
        :initialName="snippetToEdit?.name || ''"
        :initialText="snippetToEdit?.text || ''"
        :initialShortcut="snippetToEdit?.shortcut || ''"
        :snippetId="snippetToEdit?.id || ''"
        @snippet-saved="forwardSave"
        @toggle-add-snippet="onAddSnippet"
        @edit-snippet="onEditSnippet"
        @cancel-clicked="onCancelSnippet"
        :snippets
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
