import 'dotenv/config'

import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'

export const app = fastify()

app.register(cors, {
  origin: true,
})
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(authRoutes)
app.register(memoriesRoutes)
