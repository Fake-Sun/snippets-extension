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
import { ref } from 'vue'
import SnippetForm from './../Form/SnippetForm.vue'
import NewYorkH3 from '@/components/Typography/NewYorkH3.vue'

const snippetName = ref('');
const snippetText = ref('');
const snippetShortcut = ref('');
const snippetFormRef = ref<InstanceType<typeof SnippetForm> | null>(null);

const emit = defineEmits<{ 
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'snippet-saved'): void
}>();

function onSaveButtonClick() {
  // Emit event to update isAddSnippetActive.
  snippetFormRef.value?.submitForm();
}

function onCancelButtonClick() {
  emit('toggle-add-snippet', false);
}

function handleSave(snippet: Snippet) {
  const newSnippet: Snippet = {
    name: snippet.name,
    text: snippet.text,
    shortcut: snippet.shortcut,
  };

  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    const currentSnippets: Snippet[] = result.snippets || [];
    currentSnippets.push(newSnippet);

    chrome.storage.local.set({ snippets: currentSnippets }, () => {
      console.log("Snippet saved:", newSnippet);
      snippetName.value = '';
      snippetText.value = '';
      snippetShortcut.value = '';

      emit('snippet-saved');
      emit('toggle-add-snippet', false);
    });
  });
}
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <NewYorkH3>Crear snippet</NewYorkH3>
      <CardDescription>Guardar nuevo snippet.</CardDescription>
    </CardHeader>
    <CardContent>
      <SnippetForm ref="snippetFormRef" @form-submitted="handleSave"/> 
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
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