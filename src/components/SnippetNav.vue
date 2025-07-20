<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';

const emit = defineEmits<{
  (e: 'add-snippet', value: boolean): void;
}>();

const emitNewSnippet = () => {
  emit('add-snippet', true);
}
</script>

<template>
  <div class="h-14 w-full bg-primary flex flex-row items-center space-between justify-between p-4">
    <img src="../assets/SnipplyLogo.png" alt="Snipply Logo" class="w-[8rem] h-auto" />
    <!-- Need to add v-if statement to the element below, so if we're creating a new snippet, it will not show the "Create Snippet" button. -->
    <div class="p-1 flex items-center gap-2 newSnippetWrapper clickable" @click="emitNewSnippet"> 
      <Plus :size="25" absoluteStrokeWidth color="white" class="clickable"/>
    </div>
  </div>
</template>

<style scoped>
.newSnippetWrapper {
  transition: transform 0.25s;
  border: 2px solid white;
  border-radius: 10px;
}
.newSnippetWrapper:hover {
  background-color: rgb(234, 99, 122);
  border-radius: 10px;

}
.clickable {
  font-size: 0.8rem;
  cursor: pointer;
}
</style>