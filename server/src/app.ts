import 'dotenv/config'

import { resolve } from 'node:path'

import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastify from 'fastify'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

export const app = fastify()

app.register(fastifyMultipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
})

app.register(uploadRoutes)
app.register(authRoutes)
app.register(memoriesRoutes)
