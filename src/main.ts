import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const BASE_POPUP_WIDTH = 650
const BASE_POPUP_HEIGHT = 580
const BASE_SCREEN_WIDTH = 2560
const BASE_SCREEN_HEIGHT = 1440
const MIN_POPUP_SCALE = 0.75
const MAX_POPUP_SCALE = 1

function getScreenScale() {
  const deviceScale = window.devicePixelRatio || 1
  const screenWidth = window.screen.width * deviceScale
  const screenHeight = window.screen.height * deviceScale

  return Math.min(screenWidth / BASE_SCREEN_WIDTH, screenHeight / BASE_SCREEN_HEIGHT)
}

function applyPopupScale() {
  const scale = Math.min(MAX_POPUP_SCALE, Math.max(MIN_POPUP_SCALE, getScreenScale()))
  const root = document.documentElement

  root.style.setProperty('--popup-scale', String(scale))
  root.style.setProperty('--popup-width', `${Math.round(BASE_POPUP_WIDTH * scale)}px`)
  root.style.setProperty('--popup-height', `${Math.round(BASE_POPUP_HEIGHT * scale)}px`)
}

applyPopupScale()

createApp(App).mount('#app')
