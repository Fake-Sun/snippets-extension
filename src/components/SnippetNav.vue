<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';

const emit = defineEmits<{
  (e: 'add-snippet', value: boolean): void;
}>();

const forwardNewSnippet = () => {
  emit('add-snippet', true);
}
</script>

<template>
  <div class="h-14 p-2 w-full bg-primary flex flex-row-reverse items-center">
    <div class="p-2 flex items-center gap-2 newSnippetWrapper clickable" @click="forwardNewSnippet">
      <Label style="color: white" class="clickable">Nuevo Snippet</Label>
      <CirclePlus :size="27" absoluteStrokeWidth color="white" class="clickable"/>
    </div>
  </div>
</template>

<style scoped>
.newSnippetWrapper {
  transition: transform 0.25s;
}
.newSnippetWrapper:hover {
  background-color: rgb(235, 111, 132);
  border-radius: 10px;
}
.clickable {
  cursor: pointer;
}
</style>