import {
  EuPlatescResponseHeaders,
  VtexRequestHeaders,
  EuPlatescRequestHeader,
} from '../../typings/index'

import { API_VERSION, X_PAYMENTS_OS_ENV } from '../constants'

export const extractHeaders = (headers: any): VtexRequestHeaders => {
  const clientIP = headers['x-forwarded-for']
    ? headers['x-forwarded-for'].split(',')[0]
    : ''

  return {
    appKey: headers['x-vtex-api-appkey'],
    appToken: headers['x-vtex-api-apptoken'],
    idempotencyKey: headers['x-request-id'],
    clientIP,
    userAgent: headers['user-agent'],
    accept: headers['accept'],
  }
}

export const extractHeadersEuPlatesc = (headers: any): EuPlatescResponseHeaders => {
  return {
    transactionId: headers['x-zooz-request-id'],
    idempotencyKey: headers['x-request-id'],
    selfUrl: headers['self'],
  }
}

export const EuPlatescHeaders = (headers: any): EuPlatescRequestHeader => {
  const appHeaders: VtexRequestHeaders = extractHeaders(headers)

  return {
    'api-version': API_VERSION,
    'x-payments-os-env': X_PAYMENTS_OS_ENV,
    'app-id': appHeaders.appKey,
    'private-key': appHeaders.appToken,
    'idempotency-key': appHeaders.idempotencyKey,
  }
}

export const createAuthorizationHeaders = (
  headers: any
): { vtex: VtexRequestHeaders; EuPlatesc: EuPlatescRequestHeader } => {
  const appHeaders: VtexRequestHeaders = extractHeaders(headers)
  return {
    vtex: appHeaders,
    EuPlatesc: {
      'api-version': API_VERSION,
      'x-payments-os-env': X_PAYMENTS_OS_ENV,
      'app-id': appHeaders.appKey,
      'private-key': appHeaders.appToken,
      'idempotency-key': appHeaders.idempotencyKey,
      'x-client-ip-address': appHeaders.clientIP,
      'x-client-user-agent': appHeaders.userAgent,
    },
  }
}
