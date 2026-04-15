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
import type { Folder } from '@/types/Folder'
import { onMounted, ref } from 'vue'
import SnippetForm from '../FormsStructure/SnippetForm.vue'
import NewYorkH3 from '@/components/Typography/NewYorkH3.vue'
import { useI18n } from '@/lib/i18n'

const snippetFormRef = ref<InstanceType<typeof SnippetForm> | null>(null);
const { t } = useI18n();

const snippetDraft = defineProps<{
    initialName: string,
    initialText: string,
    initialShortcut: string
    initialFolderId?: string
    snippetId: string
    folders: Folder[]
}>();

const emit = defineEmits<{ 
  (e: 'toggle-add-snippet', value: boolean): void;
  (e: 'snippet-saved'): void
  (e: 'cancel-clicked'): void;
}>();

function onSaveButtonClick() {
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
    folderId: s.folderId,
  };
  chrome.storage.local.get("snippets", (result: { snippets?: Snippet[] }) => {
    const currentSnippets: Snippet[] = result.snippets || [];
    let i = currentSnippets.findIndex( search =>  snippetDraft.snippetId === search.id );
    if (i === -1) {
      currentSnippets.push(newSnippet);
    }
    else {
      currentSnippets[i] = newSnippet;
    }
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
  <Card class="max-h-[calc(100vh-2rem)] w-[350px] overflow-hidden">
    <CardHeader>
      <NewYorkH3>
        {{ snippetDraft.snippetId !== '' ? t('editSnippetTitle') : t('newSnippet') }}
      </NewYorkH3>
      <CardDescription>
        {{ snippetDraft.snippetId !== '' ? t('saveSnippetChanges') : t('saveNewSnippet') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="max-h-[calc(100vh-12rem)] overflow-y-auto">
      <SnippetForm ref="snippetFormRef" @form-submitted="handleSave" :snippets :folders="snippetDraft.folders" :snippetDraft/> 
    </CardContent>
    <CardFooter class="flex justify-between px-6 ">
      <Button variant="outline" @click="onCancelButtonClick">{{ t('cancel') }}</Button>
      <Button @click="onSaveButtonClick">
        {{ snippetDraft.snippetId !== '' ? t('saveChanges') : t('save') }}
      </Button>
    </CardFooter>
  </Card>
</template>

<style scoped>
#text {
  resize: none;
}
</style>
