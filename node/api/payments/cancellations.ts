/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { json } from 'co-body'

import { EuPlatescHeaders } from '../utils/headers'

import type {
  CancelRequestBody,
  EuPlatescCancelResponsePayload,
  EuPlatescRequestHeader,
} from '../../typings/index'


const buildCancelPayment = (
  body: CancelRequestBody,
  headers: any 
): {
  paymentId: string; headers: EuPlatescRequestHeader} => {
    return {
      paymentId: body.paymentId, // for tests
      headers: EuPlatescHeaders(headers)
    }
}

const buildCancelPaymentResponse = (
  payload: EuPlatescCancelResponsePayload,
  requestBody: AuthorizationRequest
): CancelResponse => {
  return {
    paymentId: requestBody.paymentId, // Vtex payment id
    requestId: requestBody.requestId,
    cancellationId: payload.id,
    message: 'Cancelled',
    code: 'cancel-manually',
  }
}

const buildCancelPaymentResponseError = (
  errMessage: string,
  requestBody: AuthorizationRequest
): CancelResponse => {
  return {
    paymentId: requestBody.paymentId, // Vtex payment id
    requestId: requestBody.requestId,
    cancellationId: null,
    message: errMessage,
    code: 'cancel-manually'
  }
}

export async function cancellations(
  ctx: ServiceContext,
  next: () => Promise<any>
) {
  const {
    req,
    clients: { EuPlatesc, masterdata },
    vtex: { logger },
  } = ctx
  
  const body = await json(req)



  try {
  const { headers } = buildCancelPayment(body, ctx.headers)
  const mdResp = await masterdata.getDocument({
    dataEntity: 'payments',
    fields: ['payOSPaymentId'],
    id: body.paymentId,
  }) as any

  const payOSPaymentId = mdResp.payOSPaymentId

  const cancelResponse = await EuPlatesc.cancelPayment(payOSPaymentId, headers)
  
  ctx.response.body = buildCancelPaymentResponse(cancelResponse, body)
  ctx.response.status = 200

  next()
  } catch(e) {
    logger.error(e)
    ctx.response.body = buildCancelPaymentResponseError(e.message, body)
    ctx.response.status = 500
  }
}