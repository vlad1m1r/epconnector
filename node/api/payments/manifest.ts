import { CUSTOM_FIELDS } from '../constants'

export function manifest(ctx: ServiceContext, next: () => Promise<any>) {
  ctx.response.body = {
    paymentMethods: [
      {
        name: 'Visa',
        allowsSplit: 'disabled',
      },
      {
        name: 'Visa Electron',
        allowsSplit: 'disabled',
      },
      {
        name: 'Mastercard',
        allowsSplit: 'disabled',
      },
      {
        name: 'Promissories',
        allowsSplit: 'disabled',
      },
    ],
    customFields: [
      {
        name: CUSTOM_FIELDS.PUBLIC_KEY,
        type: 'text',
      },
      {
        name: CUSTOM_FIELDS.SOFT_DESCRIPTOR,
        type: 'text',
      },
      {
        name: CUSTOM_FIELDS.REFUND_TYPE,
        type: 'select',
        options: [
          {
            text: 'Automatic Whenever Possible',
            value: 'automatic',
          },
          {
            text: 'E-Mail Notification',
            value: 'email',
          },
        ],
      },
      {
        name: CUSTOM_FIELDS.EARLY_CAPTURE,
        type: 'select',
        options: [
          {
            text: 'Off',
            value: '-1',
          },
          {
            text: 'Immediately',
            value: '0',
          },
          {
            text: '2 Hours',
            value: '2',
          },
          {
            text: '3 Hours',
            value: '3',
          },
          {
            text: '6 Hours',
            value: '6',
          },
          {
            text: '9 Hours',
            value: '9',
          },
          {
            text: '12 Hours',
            value: '12',
          },
          {
            text: '24 Hours',
            value: '24',
          },
          {
            text: '48 Hours',
            value: '48',
          },
          {
            text: '96 Hours',
            value: '96',
          },
          {
            text: '192 Hours',
            value: '192',
          },
          {
            text: '240 Hours',
            value: '240',
          },
        ],
      },
      {
        name: CUSTOM_FIELDS.ANTI_FRAUD,
        type: 'select',
        options: [
          {
            text: 'No',
            value: '0',
          },
          {
            text: 'Yes',
            value: '1',
          },
        ],
      },
    ],
  }

  ctx.response.status = 200
  next()
}
