import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { FastifyInstance } from 'fastify'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    })

    if (!upload) return reply.status(400).send()

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) return reply.status(400).send()

    const filedId = randomUUID()
    const extension = extname(upload.filename)

    const filename = filedId.concat(extension)

    const writableStream = createWriteStream(
      resolve(__dirname, '../../uploads', filename),
    )

    await pump(upload.file, writableStream)

    const fullUrl = `${request.protocol}://${request.hostname}`
    const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString()

    return {
      fileUrl,
    }
  })
}
