export interface EuPlatescRefundRequestPayload {
  reconciliation_id: string
  amount: number
  capture_id: string
  refund_reason: string
  additional_details: unknown
}

export interface EuPlatescRefundResponseHeaders {
  transactionId: string
  idempotencyKey: string
  selfUrl: string
}
export interface EuPlatescRefundResponsePayload {
  id: string
  created: string
  reconciliation_id: string
  amount: number
  capture_id: string
  reason: string
  additional_details: unknown
  result: unknown
  provider_data: ProviderData
  provider_configuration: ProviderConfiguration
}

export interface EuPlatescRefundResponse {
  headers: EuPlatescRefundResponseHeaders
  payload: EuPlatescRefundResponsePayload
}
