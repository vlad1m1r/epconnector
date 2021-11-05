import { stringify } from 'querystring'
import { isEmpty, pick } from 'ramda'
import { MiddlewareContext } from '@vtex/api'

export const debugging = async (
  ctx: MiddlewareContext,
  next: () => Promise<any>
) => {
  const start = process.hrtime()

  try {
    await next()
  } finally {
    if (!ctx.config.production) {
      const cached =
        ctx.memoizedHit ||
        ctx.inflightHit ||
        (ctx.cacheHit &&
          (ctx.cacheHit.memory ||
            ctx.cacheHit.router ||
            ctx.cacheHit.revalidated))

      const elapsed = process.hrtime(start)[1] / 1000000 // divide by a million to get nano to milli
      const success = ctx.response?.status && ctx.response.status < 400

      const queryParams =
        (!isEmpty(ctx.config.params) && `?${stringify(ctx.config.params)}`) ||
        ''

      console.log(
        success ? '\x1b[32m%s\x1b[0m' : '\x1b[31m%s\x1b[0m',
        new Date().toISOString(),
        `\t${ctx.config.baseURL}${ctx.config.url}${queryParams}`,
        `\t${ctx.response?.status ?? 500}`,
        `${Math.floor(elapsed)}ms`,
        `${
          !cached
            ? ''
            : JSON.stringify(
                pick(['memoizedHit', 'inflightHit', 'cacheHit'], ctx)
              )
        }`
      )
    }
  }
}
