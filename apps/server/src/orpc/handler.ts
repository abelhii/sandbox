import { RPCHandler } from '@orpc/server/fetch'
import { appRouter } from './router/index.ts'
import { createContext } from './context.ts'
import type { Context } from 'hono'

const rpcHandler = new RPCHandler(appRouter)

export async function orpcHandler(c: Context) {
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: '/api/rpc',
    context: createContext(c),
  })

  if (!matched) return c.notFound()
  return response
}