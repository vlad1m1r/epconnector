import { Service, LRUCache, method } from '@vtex/api'

// import { routes } from './API'
import { Clients } from './clients'
import { debugging } from './clients/sdk/middlewares/debugging'

import { createPayment } from './api/payments/createPayment'
import { cancellations } from './api/payments/cancellations'
import { refundPayment } from './api/payments/refundPayment'
import { settlePayment } from './api/payments/settlePayment'
import { paymentMethods } from './api/payments/paymentMethods'
import { manifest } from './api/payments/manifest'

import { hooks } from './api/hooks/hook'

const defaultCache = new LRUCache<string, any>({ max: 200 })

metrics.trackCache('default', defaultCache)

const appsCache = new LRUCache<string, any>({ max: 200 })

metrics.trackCache('apps', appsCache)

export default new Service({
  clients: {
    implementation: Clients,
    options: {
      apps: {
        memoryCache: appsCache,
      },
      default: {
        memoryCache: defaultCache,
        metrics,
        middlewares: [debugging],
        retries: 1,
        timeout: 1000 * 10,
      },
    },
  },
  routes: {
    authorizations: method({
      POST: [createPayment],
    }),
    cancellations: method({
      POST: [cancellations],
    }),
    paymentMethods: method({
      GET: [paymentMethods],
    }),
    manifest: method({
      GET: [manifest],
    }),
    refunds: method({
      POST: [refundPayment],
    }),
    settlements: method({
      POST: [settlePayment],
    }),
    ipn: method({
      POST: [hooks],
    }),
  },
})
