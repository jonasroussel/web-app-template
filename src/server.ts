import Fastify from 'fastify'
import { api } from './api/index.js'

const isProduction = process.env.NODE_ENV === 'production'
const host = process.env.HOST || '127.0.0.1'
const port = parseInt(process.env.PORT || '5070')

const fastify = Fastify({
	disableRequestLogging: true,
	logger: isProduction
		? true
		: {
				transport: {
					target: 'pino-pretty',
					options: {
						translateTime: 'HH:MM:ss',
						ignore: 'pid,hostname',
					},
				},
			},
})

await fastify.register(api, { prefix: '/api' })

if (isProduction) {
	await fastify.register((await import('@fastify/static')).default, {
		root: `${process.cwd()}/dist/public`,
		preCompressed: true,
		maxAge: 3600,
	})
} else {
	const { createServer } = await import('vite')
	const { readFile } = await import('fs/promises')
	const { default: fastifyExpress } = await import('@fastify/express')

	const vite = await createServer({ configFile: `${process.cwd()}/vite.config.ts` })

	await fastify.register(fastifyExpress)
	fastify.use(vite.middlewares)

	fastify.get('*', async (req, reply) => {
		try {
			const html = await readFile(`./src/app/index.html`, 'utf-8')
			const template = await vite.transformIndexHtml(req.originalUrl, html)

			return reply.status(200).header('content-type', 'text/html').send(template)
		} catch (ex) {
			if (!(ex instanceof Error)) return reply.status(500).send()
			return reply.status(500).send(ex.stack)
		}
	})
}

await fastify.listen({ host: host, port: port })
