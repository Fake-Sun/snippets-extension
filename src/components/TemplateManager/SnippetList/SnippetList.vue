<script setup lang="ts">
import type { Snippet } from '@/types/Snippet';
import SnippetCard from '../SnippetCard/SnippetCard.vue';

const { snippets } = defineProps<{snippets: Snippet[]}>()
</script>

<template>
  <div class="flex flex-col space-y-2" >
    <SnippetCard v-for="snippet in snippets" :key="snippet.shortcut" :name="snippet.name" :text="snippet.text" :shortcut="snippet.shortcut"/>
  </div>
</template>

<style>

</style>