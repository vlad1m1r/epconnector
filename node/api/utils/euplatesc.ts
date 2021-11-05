import { equals } from 'ramda'

export const convertExpirationDate = (exp: Expiration): string => {
  return `${exp.month}-${exp.year}`
}

// The Electronic Commerce Indicator
// Receives a payment method (Visa, Mastercard ) and returns a
export const getEciFlag = (paymentMethod: PaymentMethod): string => {
  switch (paymentMethod) {
    case CreditCard.Mastercard || DebitCard['Mastercard Debit']:
      return '02'
    case CreditCard.Visa || DebitCard['Visa Electron']:
      return '05'
    default:
      return '00'
  }
}

export const checkAddressMatch = (bill: Address, ship: Address): boolean => {
  return equals(bill, ship)
}
