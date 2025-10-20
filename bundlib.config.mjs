import { defineConfig } from 'bundlib'

export default defineConfig({
  interop: true,
  esModule: true,
  project: './tsconfig.build.json',
})
