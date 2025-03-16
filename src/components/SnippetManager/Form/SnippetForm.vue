<script setup lang="ts">
import { onMounted } from 'vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormLabel, FormDescription, FormMessage, FormItem, FormField } from '@/components/ui/form'
import {z} from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import type { Snippet } from '@/types/Snippet';

const formSchema = toTypedSchema(z.object({
  name: z.string({ 
    required_error: "Nombre es obligatorio."
  }).min(3, "Nombre necesita al menos 3 caracteres.")
    .max(50, "Nombre no puede contener mas de 50 caracteres.")
    .transform(value => value.replace(/[\r\n]+/g, ' ')),

  shortcut: z.string({
    required_error: "Atajo es obligatorio."
  }).min(2, "Atajo necesita al menos 3 caracteres.")
    .max(20, "Atajo no puede contener más de 20 caracteres.")
    .startsWith('/', "Atajo debe comenzar con \"/\"")
    .toLowerCase()
    .regex(/^\/\S*$/, "Atajo no puede contener espacios."),

  text: z.string({
    required_error: "Texto es obligatorio."
  }).min(2, "Texto debe contener más de 2 caracteres.")
    .max(1000, "Texto no debe contener más de 1000 caracteres.")
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema
})

const emit = defineEmits<{
  (e: 'form-submitted', snippet: Snippet): void;
}>();

function onSubmit(snippet: Snippet) {
  emit('form-submitted', snippet);
}

// Function for the parent component to ha
function submitForm() {
  handleSubmit(onSubmit)();
}
// Expose submitForm so the parent can call it.
defineExpose({ submitForm });

onMounted(() => {

}) 

</script>

<template>
  <form :validation-schema="formSchema">
    <div class="grid items-center w-full gap-4">
      <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="flex flex-col space-y-1.5">
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input id="name" type="text" placeholder="Nombre de tu snippet" v-bind="componentField"
              />
            </FormControl>
          </div>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="shortcut" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="flex flex-col space-y-1.5">
            <FormLabel>Atajo</FormLabel>
            <FormControl>
              <Input id="shortcut" placeholder="Ejemplo: /atajo" v-bind="componentField"
              />
            </FormControl>
          </div>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="text" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="flex flex-col space-y-1.5">
            <FormLabel>Texto del snippet</FormLabel>
            <FormControl>
              <Textarea id="text" placeholder="El texto que el snippet va a generar." v-bind="componentField" 
                />
            </FormControl>
          </div>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </form>
</template>

<style scoped>
#text {
  resize: none;
  field-sizing: content;
  max-height: 135px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}
</style>
