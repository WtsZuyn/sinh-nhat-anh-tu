import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const IMPORTS_DIR = path.resolve(__dirname, 'src/imports')


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  base: '/sinh-nhat-anh-tu/',
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: `${IMPORTS_DIR}/memory-01.PNG`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-02.jpg`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-03.PNG`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-04.png`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-05..jpg`,           dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-06.PNG`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-07.JPG`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-08.jpg`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-09.jpg`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-10.JPG`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-11.jpg`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/memory-12.jpg`,            dest: 'assets' },
        { src: `${IMPORTS_DIR}/birthday-video.mp4`,       dest: 'assets' },
        { src: `${IMPORTS_DIR}/khieu-vu-trong-tranh.mp3`, dest: 'assets' },
      ],
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
