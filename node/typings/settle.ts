import { EuPlatescResponseHeaders } from './euplatesc'

export interface EuPlatescSettleRequestPayload {
  reconciliation_id?: string
  amount?: number
  provider_specific_data?: Record<string, any>
  additional_details?: Record<string, string>
  addendums?: Record<string, string>
}

export interface EuPlatescSettleResponsePayload {
  id: string
  created: string
  result: {
    status: string
    description: string
  }
  amount: number
}

export interface EuPlatescSettleResponse {
  headers: EuPlatescResponseHeaders
  payload: EuPlatescSettleResponsePayload
}
