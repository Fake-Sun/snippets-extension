<script setup lang="ts">
import { useForm } from 'vee-validate'
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Snippet } from '@/types/Snippet'
import { snippetFormSchema } from './validation'

// 1️⃣ receive your incoming snippet
const props = defineProps<{
  snippet: {
    initialName:     string
    initialShortcut: string
    initialText:     string
  }
}>()

// 2️⃣ set up vee-validate with your schema + seed values
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: snippetFormSchema,
  initialValues: {
    name:     props.snippet.initialName,
    shortcut: props.snippet.initialShortcut,
    text:     props.snippet.initialText,
  }
})

// 3️⃣ emit the final Snippet shape on submit
const emit = defineEmits<{
  (e: 'form-submitted', snippet: Snippet): void
}>()

function onSubmit(values: { name: string, shortcut: string, text: string }) {
  const id = crypto.randomUUID();
  emit('form-submitted', {
    name:     values.name,
    shortcut: values.shortcut,
    text:     values.text,
    id,
  })
}

// 4️⃣ expose for programmatic submission
function submitForm() {
  handleSubmit(onSubmit)()
}
defineExpose({ submitForm })
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit)">
    <div class="grid gap-4 w-full">
      <!-- Nombre -->
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
      <!-- Atajo -->
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
      <!-- Texto -->
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
  width: 100%;
  box-sizing: border-box;
}
</style>
