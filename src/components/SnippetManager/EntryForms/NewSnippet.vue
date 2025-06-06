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
import { ref, computed } from 'vue'
import SnippetForm from '../FormsStructure/SnippetForm.vue'
import NewYorkH3 from '@/components/Typography/NewYorkH3.vue'

const snippetFormRef = ref<InstanceType<typeof SnippetForm> | null>(null);

const snippet = defineProps<{
  initialName: string,
  initialText: string,
  initialShortcut: string
  snippetId: string
}>();

const isEditing = computed(() => snippet.snippetId !== '');

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

function snippetIdForSave(generatedId: string) {
  return snippet.snippetId || generatedId;
}

function handleSave(snippetData: Snippet) {
  const updatedSnippet: Snippet = {
    name: snippetData.name,
    text: snippetData.text,
    shortcut: snippetData.shortcut,
    id: snippetIdForSave(snippetData.id),
  };

  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    const currentSnippets: Snippet[] = result.snippets || [];

    if (isEditing.value) {
      const index = currentSnippets.findIndex(s => s.id === snippet.snippetId);
      if (index !== -1) {
        currentSnippets[index] = updatedSnippet;
      } else {
        currentSnippets.push(updatedSnippet);
      }
    } else {
      currentSnippets.push(updatedSnippet);
    }

    chrome.storage.local.set({ snippets: currentSnippets }, () => {
      emit('snippet-saved');
      emit('toggle-add-snippet', false);
    });
  });
}
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <NewYorkH3>{{ isEditing ? 'Editar snippet' : 'Crear snippet' }}</NewYorkH3>
      <CardDescription>
        {{ isEditing ? 'Guardar cambios del snippet.' : 'Guardar nuevo snippet.' }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <SnippetForm ref="snippetFormRef" @form-submitted="handleSave" :snippet/> 
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