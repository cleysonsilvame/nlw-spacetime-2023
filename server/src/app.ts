import cors from '@fastify/cors'
import fastify from 'fastify'

import { memoriesRoutes } from './routes/memories'

export const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes)
