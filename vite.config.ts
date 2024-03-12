import compression from 'rollup-plugin-gzip'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { brotliCompress } from 'zlib'

export default defineConfig({
	plugins: [
		solid(),
		// GZip
		compression({
			filter: /\.(js|json|css)$/,
			fileName: '.gz',
		}),
		// Brotli
		compression({
			filter: /\.(js|json|css)$/,
			fileName: '.br',
			customCompression: (content) => {
				return new Promise((resolve, reject) => {
					brotliCompress(Buffer.from(content), (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
				})
			},
		}),
	],
	appType: 'custom',
	server: { middlewareMode: true },
	root: `${process.cwd()}/src/app`,
	clearScreen: false,
})
