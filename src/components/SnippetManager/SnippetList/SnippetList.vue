<script setup lang="ts">
import type { Snippet } from '@/types/Snippet';
import SnippetCard from '../Cards/SnippetCard.vue';
import Breadcrumb from '../Breadcrumb/SnippetBreadcrumb.vue';

const { snippets } = defineProps<{snippets: Snippet[]}>();

const emit = defineEmits<{
  (e: 'edit-snippet', snippet: Snippet): void;
  (e: 'delete-snippet', identifier: string): void;
}>();
</script>

<template>
  <Breadcrumb class="justify-start"/>
  <div class="wrapper flex flex-col space-y-2 justify-items-center" >
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
    max-width: 100%;
  }
</style>