import type { Snippet } from './Snippet';
import type { Component } from 'vue';

export interface Folder {
  id?: string
  name: string
  description?: string
  parentId?: string
  children?: Folder[]
  snippets?: Snippet[] // Only present in leaf folders
  icon?: Component // Icon component from lucide-vue-next
  url?: string // Optional URL for the folder, used for navigation
}
