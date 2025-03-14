<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NewSnippet from './NewSnippet/NewSnippet.vue';
import NoSnippets from './NoSnippets/NoSnippets.vue';
import SnippetList from './SnippetList/SnippetList.vue';
import type { Snippet } from '@/types/Snippet';

const isAddSnippetActive = ref(false);
const { snippets } = defineProps<{snippets: Snippet[]}>();

const emit = defineEmits<{(e: 'snippet-saved'): void}>();

onMounted(() => {
  console.log("length:" + snippets)
  console.log("Is: " + isAddSnippetActive)
})

function forwardSave() {
  emit('snippet-saved');
}
</script>

<template>
    <div class="w-full">
      <SnippetList :snippets/>
    <!-- Show NoSnippets if there are no snippets and NewSnippet is not active -->
    <NoSnippets v-if="snippets.length === 0 && !isAddSnippetActive" @toggle-add-snippet="isAddSnippetActive = $event"/>
    <div class="newSnippetWrapper" v-if="isAddSnippetActive">
      <NewSnippet @snippet-saved="forwardSave" @toggle-add-snippet="isAddSnippetActive = $event"/>
    </div>
  </div>
</template>

<style>
.newSnippetWrapper {
  padding: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>