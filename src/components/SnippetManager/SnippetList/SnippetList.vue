<script setup lang="ts">
import type { Snippet } from '@/types/Snippet';
import SnippetCard from '../Cards/SnippetCard.vue';


const { snippets } = defineProps<{snippets: Snippet[]}>();

const emit = defineEmits<{
  (e: 'edit-snippet', snippet: Snippet): void;
  (e: 'delete-snippet', identifier: string): void;
}>();
</script>

<template>

  <div class="wrapper p-4 pt-0 flex flex-col space-y-2 justify-items-center" >
    <SnippetCard
      v-for="snippet in snippets"
      :key="snippet.shortcut"
      :name="snippet.name"
      :text="snippet.text"
      :shortcut="snippet.shortcut"
      :id="snippet.id"
      @delete-snippet="emit('delete-snippet', snippet.id)"
      @edit-snippet="emit('edit-snippet', snippet)"
    />
  </div>
</template>

<style scoped>
  .wrapper {
    min-width: 400px;
    max-width: 100%;
  }
</style>