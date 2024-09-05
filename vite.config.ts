import { defineConfig, LibraryFormats } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { terser } from 'rollup-plugin-terser'

function getLibraryBuildConfig() {
  return {
    lib: {
      entry: {
        index: resolve(__dirname, './lib/index.ts'),
      },
      formats: ['es', 'cjs'] as LibraryFormats[],
    },
    rollupOptions: {
      output: [
        {
          entryFileNames: '[name].esm.mjs',
          format: 'es',
          dir: 'dist',
          sourcemap: true,
        },
        {
          entryFileNames: '[name].esm.js',
          format: 'es',
          dir: 'dist',
          sourcemap: true,
        },
        {
          entryFileNames: '[name].cjs.js',
          format: 'cjs',
          dir: 'dist',
          sourcemap: true,
        },
      ],
      plugins: [
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 3,
            pure_funcs: ['console.log'],
          },
          mangle: {
            properties: {
              regex: /^_/,
            },
          },
          format: {
            comments: false,
          },
        }),
      ],
    },
    minify: 'terser',
    target: 'esnext',
    sourcemap: true,
    emptyOutDir: true,
  }
}

export default defineConfig({
  // @ts-ignore
  build: getLibraryBuildConfig(),
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
      include: ['./lib/**/*'],
    }),
  ],
})
