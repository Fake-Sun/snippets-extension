<script setup lang='ts'>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Snippet } from '@/types/Snippet'
import { ref } from 'vue'

const snippetName = ref('');
const snippetText = ref('');
const snippetShortcut = ref('');

const emit = defineEmits<{ 
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'snippet-saved'): void
}>();

function onButtonClick() {
  // Emit event to update isAddSnippetActive.
  emit('toggle-add-snippet', false);
}

function handleSave() {
  const newSnippet: Snippet = {
    name: snippetName.value,
    text: snippetText.value,
    shortcut: snippetShortcut.value,
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
      <CardTitle>Create snippet</CardTitle>
      <CardDescription>Save a new snippet.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" placeholder="Name of your snippet" v-model="snippetName"/>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="shortcut">Shortcut</Label>
            <Input id="shortcut" placeholder="I.E: /shortcut" v-model="snippetShortcut"/>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="text">Text</Label>
            <Textarea id="text" placeholder="The text the snippet will paste." v-model="snippetText"/>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="onButtonClick">
        Cancel
      </Button>
      <Button @click="handleSave">Save</Button>
    </CardFooter>
  </Card>
</template>

<style>
#text {
  resize: none;
}
</style>