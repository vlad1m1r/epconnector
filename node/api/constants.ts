export const VTEX_PROVIDER_KEY = 'x-provider-api-appkey'
export const VTEX_PROVIDER_TOKEN = 'x-provider-api-apptoken'

export const API_VERSION = '1.3.0'
export const X_PAYMENTS_OS_ENV = 'test'
export const ThreeDS2Version = '2.0.0'

//export const DELAY_AUTO_SETTLE = 5 * 60
//export const DELAY_AUTO_SETTLE_ANTIFRAUD = 10 * 60
//export const DELAY_AUTO_SETTLE_CANCEL = 60 * 60
//export const DELAY_AUTO_CANCEL = 5 * 60

export const DELAY_AUTO_SETTLE = 24 * 60 * 60
export const DELAY_AUTO_SETTLE_ANTIFRAUD = 24 * 60 * 60
export const DELAY_AUTO_SETTLE_CANCEL = 24 * 60 * 60
export const DELAY_AUTO_CANCEL = 24 * 60 * 60


export const INBOUND_ACTION_TYPES = {
  CHARGE: 'charge',
}

export const CUSTOM_FIELDS = {
  PUBLIC_KEY: 'Public API Key',
  SOFT_DESCRIPTOR: 'Soft descriptor',
  REFUND_TYPE: 'Type of refund',
  EARLY_CAPTURE: 'Early capture',
  ANTI_FRAUD: 'Have an anti-fraud deal with this affiliation?',
}
