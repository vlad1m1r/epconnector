/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { json } from 'co-body'


import type {
  EuPlatescRefundRequestPayload,
  EuPlatescRefundResponsePayload,
  EuPlatescRequestHeader
} from '../../typings/index'
import { EuPlatescHeaders } from '../utils/headers'



const refundPaymentBody = (body: RefundPaymentRequest): EuPlatescRefundRequestPayload => {
  return {
    reconciliation_id: body.transactionId,
    amount:  body.value,
    capture_id: body.requestId,
    refund_reason: "Placeholder refund reason", // TODO
    additional_details: {} // TODO
  }
}

const buildRefundPayment = (
  body: RefundPaymentRequest,
  headers: any
): { paymentId: string; body: EuPlatescRefundRequestPayload; headers: EuPlatescRequestHeader } => {
    return {
      paymentId: body.paymentId, // for tests
      body: refundPaymentBody(body),
      headers: EuPlatescHeaders(headers)
    }
}

const buildRefundPaymentResponse = (
  payload: EuPlatescRefundResponsePayload,
  requestBody: AuthorizationRequest
): RefundResponse => {
  return {
    paymentId: requestBody.paymentId, // Vtex payment id
    requestId: requestBody.requestId,
    value: payload.amount,
    refundId: payload.id,
    message: 'Refunded',
    code: 'refund-manually',
  }
}

const buildDummyRefundResponse = (
  paymentId: string,
  body: EuPlatescRefundRequestPayload,
  headers: EuPlatescRequestHeader
) => {
  return {
    paymentId: paymentId, // Vtex payment id
    requestId: headers["idempotency-key"],
    value: body.amount,
    refundId: headers["idempotency-key"],
    message: 'Refunded',
    code: 'refund-manually',
  }
}

export async function refundPayment(
  ctx: ServiceContext,
  next: () => Promise<any>
) {
  const {
    req,
    clients: { EuPlatesc, masterdata },
    vtex: { logger },
  } = ctx

  const body = await json(req)
  const {  body: EuPlatescBody, headers } = buildRefundPayment(body, ctx.headers)
  
  const mdResp = await masterdata.getDocument({
    dataEntity: 'payments',
    fields: ['payOSPaymentId'],
    id: body.paymentId,
  }) as any

  const payOSPaymentId = mdResp.payOSPaymentId


  if (payOSPaymentId === 'dummy') {
    ctx.response.body = buildDummyRefundResponse(body.paymentId, EuPlatescBody, headers)
    ctx.response.status = 200
    return next()
  }

  try {
    const response = await EuPlatesc.refundPayment(payOSPaymentId, EuPlatescBody, headers)

    ctx.response.body = buildRefundPaymentResponse(response, body)
    ctx.response.status = 200
    next()
  } catch(e) {  
    logger.error(e)
    ctx.response.body = buildDummyRefundResponse(body.paymentId, EuPlatescBody, headers)
    ctx.response.status = 200
  } 
}