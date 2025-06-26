<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';

const emit = defineEmits<{
  (e: 'add-snippet', value: boolean): void;
}>();

const emitNewSnippet = () => {
  emit('add-snippet', true);
}
</script>

<template>
  <div class="h-14 w-full bg-primary flex flex-row-reverse items-center">
    <div class="p-2 flex items-center gap-2 newSnippetWrapper clickable m-3" @click="emitNewSnippet">
      <Label style="color: white" class="clickable">Crear Snippet</Label>
      <CirclePlus :size="27" absoluteStrokeWidth color="white" class="clickable"/>
    </div>
  </div>
</template>

<style scoped>
.newSnippetWrapper {
  transition: transform 0.25s;
  outline: 2px solid white;
  border-radius: 10px;
}
.newSnippetWrapper:hover {
  background-color: rgb(234, 99, 122);
  border-radius: 10px;

}
.clickable {
  cursor: pointer;
}
</style>