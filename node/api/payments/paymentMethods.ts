// TODO Adapt to our case
export const availablePaymentMethods = {
  paymentMethods: ['Visa', 'Mastercard'],
}

// TODO Seems that we need on the Manifest
// TODO remove
export function paymentMethods(ctx: ServiceContext, next: () => Promise<any>) {
  ctx.response.body = availablePaymentMethods
  ctx.response.status = 200
  next()
}
