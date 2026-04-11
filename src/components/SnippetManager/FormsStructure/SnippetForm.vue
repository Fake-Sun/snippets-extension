<script setup lang="ts">
import { useForm } from 'vee-validate'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Snippet } from '@/types/Snippet'
import type { Folder } from '@/types/Folder'
import { createSnippetFormSchema } from './validation'
import { toRaw, computed, ref } from 'vue'

const NO_FOLDER_VALUE = 'none'

const props = defineProps<{
  snippets: Snippet[],
  folders: Folder[],
  snippetDraft: {
    initialName: string
    initialShortcut: string
    initialText: string
    initialFolderId?: string
    snippetId: string
  }
}>()

const rawSnippets = computed(() => toRaw(props.snippets));
const schema = computed(() => createSnippetFormSchema(rawSnippets.value, props.snippetDraft.snippetId));
const selectedFolderValue = ref(props.snippetDraft.initialFolderId || NO_FOLDER_VALUE)

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.snippetDraft.initialName,
    shortcut: props.snippetDraft.initialShortcut,
    text: props.snippetDraft.initialText,
    folderId: props.snippetDraft.initialFolderId,
  }
})

const emit = defineEmits<{
  (e: 'form-submitted', snippet: Snippet): void
}>()

function onSubmit(values: { name: string, shortcut: string, text: string }) {
  const folderId = selectedFolderValue.value === NO_FOLDER_VALUE ? undefined : selectedFolderValue.value

  emit('form-submitted', {
    name: values.name,
    shortcut: values.shortcut,
    text: values.text,
    folderId,
    id: props.snippetDraft.snippetId || crypto.randomUUID(),
  });
}

function submitForm() {
  handleSubmit(onSubmit)();
}
defineExpose({ submitForm })
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit)">
    <div class="grid gap-4 w-full">
      <FormField
        name="name"
        :validate-on-blur="!isFieldDirty('name')"
        v-slot="{ componentField }"
      >
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input
              id="name"
              placeholder="Nombre de tu snippet"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        name="shortcut"
        :validate-on-blur="!isFieldDirty('shortcut')"
        v-slot="{ componentField }"
      >
        <FormItem>
          <FormLabel>Atajo</FormLabel>
          <FormControl>
            <Input
              id="shortcut"
              placeholder="Ejemplo: /atajo"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid gap-2">
        <Label>Carpeta</Label>
        <Select v-model="selectedFolderValue">
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una carpeta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="NO_FOLDER_VALUE">
              Sin carpeta
            </SelectItem>
            <SelectItem
              v-for="folder in folders"
              :key="folder.id ?? folder.name"
              :value="folder.id ?? folder.name"
            >
              {{ folder.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FormField
        name="text"
        :validate-on-blur="!isFieldDirty('text')"
        v-slot="{ componentField }"
      >
        <FormItem>
          <FormLabel>Texto del snippet</FormLabel>
          <FormControl>
            <Textarea
              id="text"
              placeholder="El texto que el snippet va a generar."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </form>
</template>

<style scoped>
#text {
  resize: none;
  max-height: 135px;
  max-width: 300px;
  width: 100%;
  box-sizing: border-box;
  field-sizing: content;
}
</style>