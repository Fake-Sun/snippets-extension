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
  <div class="flex min-w-[400px] max-w-full flex-col gap-1.5 p-3">
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
