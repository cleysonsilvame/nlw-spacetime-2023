import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

const prisma = new PrismaClient()

const app = fastify()

app.get('/', async (request, reply) => {
  const users = await prisma.user.findMany()

  return reply.send({ users })
})

export { app }
