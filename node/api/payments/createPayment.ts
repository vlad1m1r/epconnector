import { json } from 'co-body'
import { trim } from 'ramda'

import {
  //EuPlatescRequestHeader, 
  AuthorizationStatus,
  EuPlatescCreatePaymentRequestPayload,
} from '../../typings/index'
import {
  DELAY_AUTO_SETTLE, 
  DELAY_AUTO_SETTLE_ANTIFRAUD,
  DELAY_AUTO_SETTLE_CANCEL,
} from '../constants'


const buildDeniedResponse = (
  requestBody: AuthorizationRequest,
  headers: any,
  error: any
): CreatePaymentResponse => {
  const status = AuthorizationStatus.denied
  let code = '',
    message = ''
  if (error.response) {
    code = error.response.status
    message = JSON.stringify({
      request: error.message,
      EuPlatesc: error.response.data,
    })
  } else {
    code = '500'
    message = error.message
  }

  return {
    paymentId: requestBody.paymentId,
    status,
    tid: headers['idempotency-key'],
    authorizationId: '',
    nsu: '',
    code,
    message,
    delayToAutoSettle: DELAY_AUTO_SETTLE,
    delayToAutoSettleAfterAntifraud: DELAY_AUTO_SETTLE_ANTIFRAUD,
    delayToCancel: DELAY_AUTO_SETTLE_CANCEL,
    paymentAppData: null,
  }
}

export async function createPayment(
  ctx: ServiceContext,
  next: () => Promise<any>
): Promise<any> {
  const {
    clients: { EuPlatesc },
    vtex: {logger}
  } = ctx


  var mid="";
  if(ctx.req.headers['x-vtex-api-appkey']){
    mid=ctx.req.headers['x-vtex-api-appkey'].toString()
  }

  var key="";
  if(ctx.req.headers['x-vtex-api-apptoken']){
    key=ctx.req.headers['x-vtex-api-apptoken'].toString()
  }
  let date = new Date();
  let ts=date.toISOString().match(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)

  const body: AuthorizationRequest = await json(ctx.req)

  let payBody: EuPlatescCreatePaymentRequestPayload = {
    amount: (body.value).toString(),
    curr: body.currency,
    invoice_id: body.orderId,
    order_desc: trim('Online payment - '+body.merchantName),
    merch_id: mid,
    // @ts-ignore: Object is possibly 'null'.
    timestamp: ts[1]+ts[2]+ts[3]+ts[4]+ts[5]+ts[6],
    nonce: Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2),
    fp_hash: '',

    fname: body.miniCart.buyer.firstName,
    lname: body.miniCart.buyer.lastName,
    email: body.miniCart.buyer.email,
    phone: body.miniCart.buyer.phone,

    country: body.miniCart.billingAddress.country,
    city: body.miniCart.billingAddress.city,
    state: body.miniCart.billingAddress.state,
    postal: body.miniCart.billingAddress.postalCode,
    add: [body.miniCart.billingAddress.street, body.miniCart.billingAddress.number, body.miniCart.billingAddress.complement].join(" "),

    scountry: body.miniCart.shippingAddress.country,
    scity: body.miniCart.shippingAddress.city,
    sstate: body.miniCart.shippingAddress.state,
    spostal: body.miniCart.shippingAddress.postalCode,
    sadd: [body.miniCart.shippingAddress.street, body.miniCart.billingAddress.number, body.miniCart.billingAddress.complement].join(" "),

    'ExtraData[successurl]': body.returnUrl,
    'ExtraData[failedurl]': body.returnUrl,
  	//'ExtraData[failedurl]': "https://secure.euplatesc.ro/tdsprocess/replyd.php",
  	'ExtraData[callback]': body.callbackUrl,
  	'ExtraData[silenturl]': "https://vtexeurope.myvtex.com/_v/api/euplatesc/ipn",

    'ExtraData[reference]': body.reference,
    'ExtraData[transactionId]': body.transactionId,
    'ExtraData[paymentId]': body.paymentId,
    'ExtraData[ep_method]': 'get',

    cc_pan: body.card.numberToken,
    cc_cvc: body.card.cscToken,
    cc_yr: body.card.expiration.year,
    cc_mo: body.card.expiration.month,
    cc_name: body.card.holderToken,
        
    generate_epid: "1"
  }
  //logger.info({body, key:"debug-body-createPayment"})
  //logger.info({payBody,key:"debug-euplatesc"});

  var crypto=require('crypto');
  var data=[
    payBody.amount,payBody.curr,payBody.invoice_id,payBody.order_desc,payBody.merch_id,payBody.timestamp,payBody.nonce
  ];
	
    
  var hmac='';
  for(var i=0;i<data.length; i++){
    if(data[i].length==0){
      hmac += '-';
    }else{
      hmac += data[i].length + data[i];
    }
  }

  var binKey = new Buffer(key, "hex");
  var hmacx = crypto.createHmac("md5", binKey).update(hmac, 'utf8').digest('hex');
  payBody.fp_hash=hmacx;

  try {

    const payResponse = await EuPlatesc.tokenGet(body.secureProxyUrl.replace('https','http') ,payBody,logger)

    var response;
    if(payResponse.payload.url==undefined || payResponse.payload.url.length==0){   
      response = {
        paymentId: body.paymentId,
        status: 'denied',
        tid: ctx.req.headers['idempotency-key'],
        authorizationId: '',
        nsu: '',
        acquirer: 'EP',
        code: '500',
        message: 'Invalid response from payment gateaway, check credentials',
        delayToAutoSettle: DELAY_AUTO_SETTLE,
        delayToAutoSettleAfterAntifraud: DELAY_AUTO_SETTLE_ANTIFRAUD,
        delayToCancel: DELAY_AUTO_SETTLE_CANCEL,
        paymentAppData: null
      }
    }else{
      
      let epid=payResponse.payload.cart_id;
      let redirect_url=payResponse.payload.url;

      response = {
        paymentId: body.paymentId,
        status: "undefined",
        tid: epid,
        authorizationId: epid,
        nsu: epid,
        acquirer: 'EP',
        code: '3ds2-Sync',
        message: null,
        delayToAutoSettle: DELAY_AUTO_SETTLE,
        delayToAutoSettleAfterAntifraud: DELAY_AUTO_SETTLE_ANTIFRAUD,
        delayToCancel: DELAY_AUTO_SETTLE_CANCEL,
        paymentAppData: {
          "appName": "vtexeurope.euplatesc-auth-app",
          "payload": JSON.stringify({'url':redirect_url})
        }
      }
      //logger.info({from: "Inside else", epid, redirect_url, response})
    }

    ctx.response.status = 200
    ctx.response.body = response
  } catch (e) {
    logger.info({
      from: 'CreatePayment in createPayment',
      e,
    })
    ctx.response.body = buildDeniedResponse(body, ctx.headers, e)
    ctx.response.status = 500
    
  }
  return await next()
  
}

/*
vtex use master
vtex publish -f
vtex install
 */