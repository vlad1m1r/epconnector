export interface CancelRequestBody {
  paymentId: string
  requestId: string
  authorizationId: string
  sandboxMode?: string
}

export interface EuPlatescCancelResponseHeaders {
  transactionId: string
  idempotencyKey: string
  selfUrl: string
}

export interface EuPlatescCancelResponsePayload {
  id: string
  created: string
  provider_data: unknown
  result: unknown
  additional_details: unknown
  provider_configuration: unknown
}

export interface EuPlatescCancelResponse {
  headers: EuPlatescCancelResponseHeaders
  payload: EuPlatescCancelResponsePayload
}
