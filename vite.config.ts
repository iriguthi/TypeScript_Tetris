import { defineConfig } from 'vite';

export default defineConfig({
  base: './',  // GitHub Pages 用の設定
  build: {
    outDir: 'dist',
    emptyOutDir: false,  // デプロイ時に dist を完全削除しない
  },
  define: {
    'global.crypto': 'undefined',  // crypto のエラーを回避
  }
});