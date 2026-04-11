<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import NewYorkH3 from '../../Typography/NewYorkH3.vue';

const emit = defineEmits<{ (e: 'toggle-add-snippet', value: boolean): void }>();

function onButtonClick() {
  // Emit event to update isAddSnippetActive.
  emit('toggle-add-snippet', true);
}
</script>

<template>
  <section class="grid min-w-[400px] place-items-center p-4">
    <Card class="w-full">
      <CardHeader class="items-center text-center">
        <NewYorkH3>No tienes snippets</NewYorkH3>
        <CardDescription>
          Crea un atajo para insertar texto en cualquier campo editable.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center">
        <Button @click="onButtonClick">Crear mi primer snippet</Button>
      </CardContent>
    </Card>
  </section>
</template>