<script setup lang='ts'>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import type { Snippet } from '@/types/Snippet'
import { onMounted, ref } from 'vue'
import SnippetForm from '../FormsStructure/SnippetForm.vue'
import NewYorkH3 from '@/components/Typography/NewYorkH3.vue'

const snippetFormRef = ref<InstanceType<typeof SnippetForm> | null>(null);

// TODO: Make it so that the initial values are dynamically set based on the snippetId prop.
// This will allow the form to be used for both creating and editing snippets.

const snippet = defineProps<{
    initialName: string,
    initialText: string,
    initialShortcut: string
    snippetId: string
}>();

const emit = defineEmits<{ 
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'snippet-saved'): void
  (e: 'cancel-clicked'): void;
}>();

function onSaveButtonClick() {
  // Emit event to update isAddSnippetActive.
  snippetFormRef.value?.submitForm();
}

function onCancelButtonClick() {
  emit('cancel-clicked')
  emit('toggle-add-snippet', false);
}

function handleSave(s: Snippet) {
  const newSnippet: Snippet = {
    id: s.id,
    name: s.name,
    shortcut: s.shortcut,
    text: s.text,
  };
  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    const currentSnippets: Snippet[] = result.snippets || [];
    let i = currentSnippets.findIndex( search =>  snippet.snippetId === search.id );
    if (i === -1) {
      // If the snippet is not found, add it to the end of the array.
      currentSnippets.push(newSnippet);
    }
    else {
      // If the snippet is found, update it.
      currentSnippets[i] = newSnippet;
    }
    // Update the storage with the new snippet.
    // This will overwrite the existing snippets with the new array.
    chrome.storage.local.set({ snippets: currentSnippets }, () => {
      emit('snippet-saved');
      emit('toggle-add-snippet', false);
    });
  });
}

const snippets = ref<Snippet[]>([]);
onMounted(() => {
  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    snippets.value = result.snippets || [];
  });
});
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <NewYorkH3>Crear snippet</NewYorkH3>
      <CardDescription>Guardar nuevo snippet.</CardDescription>
    </CardHeader>
    <CardContent>
      <SnippetForm ref="snippetFormRef" @form-submitted="handleSave" :snippets :snippet/> 
    </CardContent>
    <CardFooter class="flex justify-between px-6 ">
      <Button variant="outline" @click="onCancelButtonClick">
        Cancelar
      </Button>
      <Button @click="onSaveButtonClick">Guardar</Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
#text {
  resize: none;
}
</style>