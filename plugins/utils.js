import crypto from 'node:crypto'
import fp from 'fastify-plugin'

export default fp(async function (fastify, opts) {
  fastify.decorate('delayed', delayed)

  fastify.decorate('createReadableStreamFromAsyncGenerator', createReadableStreamFromAsyncGenerator)

  fastify.decorate('generateData', generateData)
})

const encoder = new TextEncoder()

export function createReadableStreamFromAsyncGenerator (output) {
  return new ReadableStream({
    async start (controller) {
      while (true) {
        const { done, value } = await output.next()

        if (done) {
          controller.close()
          break
        }

        controller.enqueue(encoder.encode(value))
      }
    },
  })
}

export function delayed (ms, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, ms)
  })
}

export function generateData () {
  return crypto.randomBytes(1024)
}
