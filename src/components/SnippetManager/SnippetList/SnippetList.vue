<script setup lang="ts">
import type { Snippet } from '@/types/Snippet';
import SnippetCard from '../SnippetCard/SnippetCard.vue';

const { snippets } = defineProps<{snippets: Snippet[]}>();

const emit = defineEmits<{
  (e: 'edit-snippet', snippet: Snippet): void;
  (e: 'delete-snippet', identifier: string): void;
}>();
</script>

<template>
  <div class="wrapper flex flex-col space-y-2" >
    <SnippetCard
      v-for="snippet in snippets"
      :key="snippet.shortcut"
      :name="snippet.name"
      :text="snippet.text"
      :shortcut="snippet.shortcut"
      @delete-snippet="emit('delete-snippet', $event)"
      @edit-snippet="emit('edit-snippet', snippet)"
    />
  </div>
</template>

<style scoped>
  .wrapper {
    min-width: 400px;
    max-width: 400px;
  }
</style>