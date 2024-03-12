import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts', 'src/api'],
	outDir: 'dist',
	clean: false,
	format: 'esm',
	target: 'es2022',
	silent: true,
	bundle: false,
	splitting: true,
	sourcemap: true,
})
