import { render, html } from 'swtl'

export default async function (fastify, opts) {
  const delayed = fastify.delayed

  fastify.get('/', async function (request, reply) {
    const template = ({ name }) => html`
      <html>
        <head>
          <title>Streaming example</title>
        </head>
        <body>
          <div>
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

              ${delayed(1000, html`
                <p slot="content">
                  Hi ${name}!
                </p>
              `)}

              ${delayed(2000, html`
                <p slot="content">
                  Hi ${name}!
                </p>
              `)}

              ${delayed(3000, html`
                <p slot="content">
                  Hi ${name}!
                </p>
              `)}

              <!--
                the remaining html below is sent to the browser once
                the delayed content has been sent
              -->
            </div>
          </div>
        </body>
      </html>
    `

    reply.header('Content-Type', 'text/html')

    const stream =
      fastify.createReadableStreamFromAsyncGenerator(render(template({ name: 'Ada' })))

    return reply.send(stream)
  })
}
