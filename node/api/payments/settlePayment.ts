// import { json } from 'co-body'

import {
  EuPlatescRequestHeader,
  EuPlatescSettleRequestPayload,
  EuPlatescSettleResponse,
} from '../../typings/index'

import { EuPlatescHeaders } from '../utils/headers'

const buildSettlePayment = (
  // body: SettlementRequest,
  headers: any
): { headers: EuPlatescRequestHeader; payload: EuPlatescSettleRequestPayload } => {
  const settleHeaders: EuPlatescRequestHeader = EuPlatescHeaders(headers)

  return {
    headers: settleHeaders,
    payload: {},
  }
}

const buildSettlePaymentResponse = (
  { headers, payload }: EuPlatescSettleResponse,
  paymentId: string
): SettlementResponse => {
  return {
    paymentId,
    requestId: headers.transactionId,
    settleId: payload.id,
    value: payload.amount,
  }
}

const buildDummySettleResponse = (
  paymentId: string,
  headers: EuPlatescRequestHeader,
  payload: EuPlatescSettleRequestPayload
): SettlementResponse => {
  return {
    paymentId,
    requestId: headers['idempotency-key'],
    settleId: headers['idempotency-key'],
    value: payload.amount ?? 0,
  }
}

export async function settlePayment(
  ctx: ServiceContext,
  next: () => Promise<any>
): Promise<any> {
  const {
    clients: { EuPlatesc, masterdata },
    vtex: { logger },
  } = ctx

  let { paymentId } = ctx.vtex.route.params
  paymentId = Array.isArray(paymentId) ? paymentId[0] : paymentId
  console.log(ctx.headers)
  const { headers, payload } = buildSettlePayment(ctx.headers)
  console.log(headers)
  console.log(payload)
  try {
    const mdResp = (await masterdata.getDocument({
      dataEntity: 'payments',
      fields: ['payOSPaymentId'],
      id: paymentId,
    })) as any

    const payOSPaymentId = mdResp.payOSPaymentId

    // get the payos payment id and authorization id from singleton
    if (payOSPaymentId === 'dummy') {
      ctx.response.body = buildDummySettleResponse(paymentId, headers, payload)
      ctx.response.status = 200

      return next()
    }
    // TODO Get the authorization id from req payload
    // const body: SettlementRequest = await json(ctx.req)

    const settleResp = await EuPlatesc.createSettle(payOSPaymentId, headers, payload)


    ctx.response.body = buildSettlePaymentResponse(settleResp, paymentId)
    ctx.response.status = 200

    return next()
  } catch (e) {
    logger.error(e)
    console.log(e)
    ctx.response.body = buildDummySettleResponse(paymentId, headers, payload)
    ctx.response.status = 200
  }
}
