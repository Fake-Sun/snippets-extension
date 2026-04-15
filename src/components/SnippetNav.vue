<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings } from 'lucide-vue-next';
import { useI18n, type LanguageCode } from '@/lib/i18n';

const emit = defineEmits<{
  (e: 'add-snippet', value: boolean): void;
}>();

const { isAddSnippetActive } = defineProps<{
  isAddSnippetActive: boolean
}>();

const { locale, languageOptions, setLocale, t } = useI18n();
const isSettingsOpen = ref(false);

const emitNewSnippet = () => {
  emit('add-snippet', true);
}

function toggleSettings() {
  isSettingsOpen.value = !isSettingsOpen.value;
}

function onLanguageChange(nextLanguage: LanguageCode) {
  setLocale(nextLanguage);
  chrome.storage.local.get('settings', (result: { settings?: Record<string, unknown> }) => {
    chrome.storage.local.set({
      settings: {
        ...(result.settings ?? {}),
        language: nextLanguage,
      },
    });
  });
}
</script>

<template>
  <header class="relative flex h-14 w-full items-center justify-between border-b bg-primary px-4 text-primary-foreground shadow-sm">
    <img src="../assets/SnipplyLogo.png" alt="Snipply Logo" class="bgElement h-auto w-28" />
    <div class="flex items-center gap-2">
      <Button
        v-if="!isAddSnippetActive"
        variant="outline"
        size="icon"
        class="h-8 w-8 border-primary-foreground/80 bg-primary text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        :aria-label="t('createSnippet')"
        @click="emitNewSnippet"
      >
        <Plus :size="20" absoluteStrokeWidth />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8 border-primary-foreground/80 bg-primary text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        :aria-label="t('settings')"
        :title="t('settings')"
        @click="toggleSettings"
      >
        <Settings :size="18" absoluteStrokeWidth />
      </Button>
    </div>

    <div
      v-if="isSettingsOpen"
      class="absolute right-4 top-12 z-40 w-56 rounded-md border bg-popover p-3 text-popover-foreground shadow-md"
    >
      <div class="grid gap-2">
        <label class="text-sm font-medium" for="language-select">{{ t('language') }}</label>
        <Select :model-value="locale" @update:model-value="value => onLanguageChange(value as LanguageCode)">
          <SelectTrigger id="language-select" class="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="language in languageOptions"
              :key="language.code"
              :value="language.code"
            >
              {{ language.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </header>
</template>

<style scoped>
.bgElement {
  pointer-events: none;
  user-select: none;
}
</style>
