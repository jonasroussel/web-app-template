import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export async function api(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	// Health check
	fastify.get('/', (_, reply) => reply.status(200).send('OK'))

	// All API routes
	// TODO: Add your API routes here

	// API 404 Not Found
	fastify.get('*', (_, reply) => reply.callNotFound())
}
