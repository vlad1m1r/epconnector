import { Enum } from 'typescript-string-enums'

import { EuPlatescResponseHeaders } from './euplatesc'

export interface EuPlatescRequestHeader {
  'api-version': string
  'x-payments-os-env': string
  'app-id': string
  'private-key': string
  'idempotency-key': string
  'x-client-user-agent'?: string //only for authorizations
  'x-client-ip-address'?: string // only for authorizatons
}


export interface EuPlatescCreatePaymentRequestPayload {
  amount: string
  curr: string
  invoice_id: string
  order_desc: string
  merch_id: string
  timestamp: string
  nonce: string
  fp_hash: string

  fname: string
  lname: string
  email: string
  phone: string

  country: string
  city: string
  state: string
  postal: string
  add: string

  scountry: string
  scity: string
  sstate: string
  spostal: string
  sadd: string

  'ExtraData[reference]': string
	'ExtraData[transactionId]': string
	'ExtraData[paymentId]': string
  'ExtraData[ep_method]': string
  'ExtraData[successurl]': string
	'ExtraData[failedurl]': string
	'ExtraData[silenturl]': string
	'ExtraData[callback]': string
	
  cc_pan: string
  cc_cvc: string
  cc_yr: string
  cc_mo: string
  cc_name: string

	generate_epid: string

}


export interface EuPlatescCreatePaymentResponsePayload {
  url: string
  cart_id: string
}

export interface VtexRequestHeaders {
  appKey: string
  appToken: string
  idempotencyKey: string
  userAgent: string
  clientIP: string
  accept: string
}

export interface EuPlatescCreatePaymentResponse {
  headers: EuPlatescResponseHeaders
  payload: EuPlatescCreatePaymentResponsePayload
}


export interface EuPlatescTokenResponse {
  headers: EuPlatescResponseHeaders
  payload: EuPlatescCreatePaymentRequestPayload
}

export const AuthorizationStatus = Enum('approved', 'denied', 'undefined')
export type AuthorizationStatus = Enum<typeof AuthorizationStatus>
