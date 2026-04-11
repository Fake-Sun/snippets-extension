import type { Snippet } from './Snippet';
import type { Component } from 'vue';
import type { FolderIconName } from '@/lib/folderIcons';

export interface Folder {
  id?: string
  name: string
  description?: string
  parentId?: string
  children?: Folder[]
  snippets?: Snippet[] // Only present in leaf folders
  iconName?: FolderIconName
  icon?: Component // Legacy in-memory icon component support
  url?: string // Optional URL for the folder, used for navigation
}