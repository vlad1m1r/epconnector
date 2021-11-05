/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http2'
import { Enum } from 'typescript-string-enums'

import {
  ParamsContext,
  RecorderState,
  ServiceContext as ServiceCtx,
} from '@vtex/api'

import { Clients } from './clients'

declare global {
  type ServiceContext = ServiceCtx<Clients, RecorderState, ParamsContext>

  type Maybe<T> = T | undefined | null
  type PromiseOrValue<T> = Promise<T> | T

  interface DomainError {
    original: Maybe<Error>
    message: string
    code: string
  }

  const RecipientRole = Enum('marketplace', 'seller')
  type RecipientRole = Enum<typeof RecipientRole>

  const DocumentType = Enum('CNPJ', 'CPF', 'SSN')
  type DocumentType = Enum<typeof DocumentType>

  interface Recipient {
    id: string
    name: string
    documentType: DocumentType
    document: string
    role: RecipientRole
    chargeProcessingFee: Maybe<boolean>
    chargebackLiable: Maybe<boolean>
    sandboxMode: Maybe<boolean>
    amount: number
  }

  interface Card {
    number: string
    numberToken: string
    holder: string
    holderToken: string
    expiration: Expiration
    csc: string
    cscToken: string
    document: unknown
  }

  interface TokenizedCard {
    holderToken: string
    bin: string
    numberToken: string
    numberLength: number
    cscToken: string
    expiration: Expiration
  }

  interface Expiration {
    month: string
    year: string
  }

  interface MiniCart {
    buyer: Buyer
    shippingAddress: Address
    billingAddress: Address
    items: Item[]
    shippingValue: number
    taxValue: number
  }

  interface Buyer {
    id: string
    firstName: string
    lastName: string
    document: string
    documentType: string
    corporateName: string
    tradeName: string
    corporateDocument: string
    isCorporate: boolean
    email: string
    phone: string
    createdDate: Date
  }

  interface Address {
    country: string
    street: string
    number: string
    complement: string
    neighborhood: string
    postalCode: string
    city: string
    state: string
  }

  interface Item {
    id: string
    name: string
    price: number
    quantity: number
    discount: number
    deliveryType: string
  }

  const DebitCard = Enum('Visa Electron', 'Maestro', 'Mastercard Debit')
  type DebitCard = Enum<typeof DebitCard>

  const CreditCard = Enum() //Enum('Visa', 'Mastercard')
  type CreditCard = Enum<typeof CreditCard>

  type PaymentMethod = CreditCard | DebitCard

  interface PaymentRequest {
    transactionId: string
    paymentId: string
    requestId: string
  }

  interface Authorization extends PaymentRequest {
    reference: string
    orderId: string
    paymentMethod: PaymentMethod
    paymentMethodCustomCode: string
    merchantName: string
    value: number
    currency: string
    installments: number
    deviceFingerprint: string
    ipAddress: string
    miniCart: MiniCart
    url: string
    callbackUrl: string
    inboundRequestsUrl: string
    returnUrl: string
    recipients: Maybe<Recipient[]>
  }

  interface RefundPaymentRequest extends PaymentRequest {
    settleId: number
    tid: string
    value: number
    recipients: Maybe<Recipient[]>
  }

  interface CardAuthorization extends Authorization {
    secureProxyUrl: string
    card: Card
    paymentMethod: CreditCard | DebitCard
  }

  type AuthorizationRequest = CardAuthorization

  interface AppData {
    appName: string
    payload: string
  }

  interface AuthorizationResponse {
    paymentId: string
    code?: string | null
    message?: string | null
  }

  interface CreatePaymentResponse extends AuthorizationResponse {
    delayToAutoSettle: number
    delayToAutoSettleAfterAntifraud: number
    delayToCancel: number
    tid: string
    authorizationId: string
    status: string
    bankIssueInvoiceId?: string
    nsu: string
    paymentUrl?: string
    paymentAppData: AppData | null
    identificationNumber?: string
    identificationNumberFormatted?: string
    barCodeImageType?: string
    barCodeImageNumber?: string
    acquirer?: string | null
    redirectUrl?: string
    maxValue?: number
  }

  interface SettlementRequest extends PaymentRequest {
    value: number
    authorizationId: string
    recipients: Maybe<Recipient[]>
  }

  interface SettlementResponse extends AuthorizationResponse {
    settleId: Maybe<string> | null
    value: number
    requestId: string
  }

  interface CancelResponse extends AuthorizationResponse {
    requestId: string
    cancellationId: Maybe<string>
  }

  interface RefundResponse extends AuthorizationResponse {
    requestId: string
    value: number
    refundId: Maybe<string>
  }

  interface ProviderConfiguration {
    id: string
    name: string
    description: string
    createdAt: string
    provider_id: string
    type: string
    account_id: string
    href: string
  }

  interface ProviderData {
    transaction_cost: unknown
    avs_code: string
    cvv_verification_code: string
    authorization_code: string
    external_id: string
    documents: unknown
    additional_information: unknown
    network_transaction_id: string
    three_d_secure_result: unknown
    provider_name: string
    response_code: string
    description: string
    raw_response: string
    transaction_id: string
  }
}

export {}
