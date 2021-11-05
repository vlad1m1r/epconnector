import { InstanceOptions, IOContext, ExternalClient, Logger } from '@vtex/api'

import { extractHeadersEuPlatesc } from '../api/utils/headers'
import {
  EuPlatescRequestHeader,
  EuPlatescCreatePaymentRequestPayload,
  EuPlatescCreatePaymentResponse,
  EuPlatescCreatePaymentResponsePayload,
  EuPlatescCancelResponsePayload,
  EuPlatescRefundRequestPayload,
  EuPlatescRefundResponsePayload,
  EuPlatescSettleRequestPayload,
  EuPlatescSettleResponse,
  EuPlatescSettleResponsePayload,
  //EuPlatescTokenResponse
} from '../typings/index'

const EuPlatesc_ENDPOINT = 'https://secure.euplatesc.ro/tdsprocess/tranzactd.php'

export class EuPlatesc extends ExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super(EuPlatesc_ENDPOINT, context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        //'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }


  public async createPayment(
    payload: EuPlatescCreatePaymentRequestPayload
  ): Promise<EuPlatescCreatePaymentResponse> {
    var qs = require('qs');
    payload=qs.stringify(payload);
    const rawResponse = await this.http.postRaw('', payload, {}, )
    return {
      headers: extractHeadersEuPlatesc(rawResponse.headers),
      payload: (rawResponse.data as any) as EuPlatescCreatePaymentResponsePayload,
    }
  }


  public async tokenGet(
    secureProxyUrl: string,
    payload: EuPlatescCreatePaymentRequestPayload,
    logger: Logger
  ): Promise<EuPlatescCreatePaymentResponse> {
    const headers={
      'X-PROVIDER-Forward-To': `https://secure.euplatesc.ro/tdsprocess/tranzactd.php`,
      'X-PROVIDER-Forward-idempotency-key': payload['ExtraData[paymentId]'],
      'X-PROVIDER-Forward-api-version': '1.3.0',
      'X-PROVIDER-Forward-x-payments-os-env': 'live',
      'X-PROVIDER-Forward-public-key': '',
  }
    var qs = require('qs');
    payload=qs.stringify(payload);

    const rawResponse = await this.http.postRaw(secureProxyUrl, payload, {headers}, )

    logger.info({rawResponse,key:"debug-euplatesc-sp1"});

    return {
      headers: extractHeadersEuPlatesc(rawResponse.headers),
      payload: (rawResponse.data as any) as EuPlatescCreatePaymentResponsePayload,
    }
  }

  public async createSettle(
    paymentId: string,
    headers: EuPlatescRequestHeader,
    payload: EuPlatescSettleRequestPayload
  ): Promise<EuPlatescSettleResponse> {
    const rawResponse = await this.http.postRaw(
      `/payments/${paymentId}/captures`,
      payload,
      { headers }
    )

    return {
      headers: extractHeadersEuPlatesc(rawResponse.headers),
      payload: (rawResponse.data as any) as EuPlatescSettleResponsePayload,
    }
  }

  public cancelPayment(
    paymentId: string,
    headers: EuPlatescRequestHeader
  ): Promise<EuPlatescCancelResponsePayload> {
    return this.http.post(
      `/payments/${paymentId}/voids`,
      {},
      {
        headers,
      }
    )
  }

  public getPayment(
    paymentId: string,
    headers: EuPlatescRequestHeader
  ): Promise<any> {
    return this.http.get(`/payments/${paymentId}`, { headers })
  }

  public getCapture(
    paymentId: string,
    captureId: string,
    headers: EuPlatescRequestHeader
  ): Promise<any> {
    return this.http.get(`/payments/${paymentId}/captures/${captureId}`, {
      headers,
    })
  }

  public refundPayment(
    paymentId: string,
    body: EuPlatescRefundRequestPayload,
    headers: EuPlatescRequestHeader
  ): Promise<EuPlatescRefundResponsePayload> {
    return this.http.post(`/payments/${paymentId}/refunds`, body, {
      headers,
    })
  }
}
