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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const emit = defineEmits<{ (e: 'toggle-add-snippet', value: boolean): void }>();

function onButtonClick() {
  // Emit event to update isAddSnippetActive.
  emit('toggle-add-snippet', false);
}

</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Create snippet</CardTitle>
      <CardDescription>Make a new snippet in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="shortcut">Shortcut</Label>
            <Input id="shortcut" placeholder="I.E: /shortcut"/>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="text">Shortcut</Label>
            <Textarea id="text" placeholder="I.E: /shortcut"/>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="onButtonClick">
        Cancel
      </Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
</template>