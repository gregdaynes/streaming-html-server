import { render, html } from 'swtl'

export default async function (fastify, opts) {
  const { delayed, generateData, createReadableStreamFromAsyncGenerator } = fastify

  fastify.get('/', async function (request, reply) {
    const template = ({ name }) => html`
      <html>
        <head>
          <title>Streaming example</title>
        </head>
        <body>
            <template shadowrootmode="open">
              <header>Header</header>
              <main>
                <slot name="content"></slot>
              </main>
              <footer>Footer</footer>
            </template>

            <!--
              The html above gets sent first to the browser
            -->

            <!--
              An artificial delay is added the slot content
              to simulate a slow response from the server:
            -->

            <p>${generateData()}</p>

              <p slot="content">
                Hi ${name}!
              </p>

            <p>${generateData()}</p>

              <p slot="content">
                Hi ${name}!
              </p>

            <p>${generateData()}</p>

              <p slot="content">
                Hi ${name}!
              </p>

            <!--
              the remaining html below is sent to the browser once
              the delayed content has been sent
            -->
          <p>Done</p>
        </body>
      </html>
    `

    reply.header('Content-Type', 'text/html')

    const stream =
      createReadableStreamFromAsyncGenerator(render(template({ name: 'Ada' })))

    return reply.send(stream)
  })
}
