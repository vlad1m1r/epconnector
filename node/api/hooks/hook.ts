
//import { DELAY_AUTO_CANCEL, DELAY_AUTO_SETTLE, DELAY_AUTO_SETTLE_ANTIFRAUD } from '../constants'
import CoBody from 'co-body'
import { DELAY_AUTO_CANCEL, DELAY_AUTO_SETTLE_ANTIFRAUD,DELAY_AUTO_SETTLE } from '../constants'

import * as crypto from 'crypto'

const EPKEY = "bf5bb6ba97acc52162eb244e773c5b28c0fcc4d9"

export async function hooks(ctx: ServiceContext, next: () => Promise<any>): Promise<any> {

  const {
    req,
    clients: { vtexClient },
    vtex: { account, logger },
  } = ctx
  
  const body = await CoBody.form(req)
  
  const { callbackUrl, responseBody } = buildByEvent(body, account)

  if(callbackUrl==""){
    ctx.response.status = 200
    ctx.response.body='SKIP'+responseBody
    await next()
    return
  }

  logger.info ({
    from: 'Build by Event',
    body,
    req,
  })
    
  try {
    await vtexClient.callbackVtex(callbackUrl, responseBody)
    ctx.response.status = 200
    ctx.response.body='OK'+JSON.stringify(responseBody)
  } catch (e) {
    logger.info({
      from: 'Callback to Vtex',
      e,
    })
    ctx.response.status = 500
    ctx.response.body='eroare:'+e

  }

  await next()
}

const modifyCallbackUrl = (callbackUrl: string, account: string): string => {
  return callbackUrl.replace('https', 'http').replace('vtexeurope', account)
}

const buildByEvent = (body: any, account: string) => {
  
  var data_verify=[
		body['ep_id'],
		body['action'],
		body['sec_status'],
		body['ExtraData']['paymentId']
	];
    
  var hmac='';
  for(var i=0; i<data_verify.length; i++){
    if(data_verify[i].length==0){
      hmac += '-';
    }else{
      hmac += data_verify[i].length + data_verify[i];
    }
  }
  
  var signature=crypto.createHash("SHA256").update(hmac+EPKEY,'utf8').digest('hex').toString().toUpperCase();

  if(signature!==body['fp_hash'].toUpperCase()){
    return {
      callbackUrl: "",
      responseBody: "",
    }
  }

  var status='denied'
  if(body.action=='0'){
    //daca nu avem sec status tinem cont doar de action
    if(body['sec_status'] == undefined){
      status='approved'
    }else if(body['sec_status']=='8' || body['sec_status']=='9'){
      //daca e ok
      status='approved'
    }else if(body['sec_status']=='5' || body['sec_status']=='6' || body['sec_status']=='7'){
      //daca e frauda
      status='denied'
    }else{
      //daca e pending
      return {
        callbackUrl: "",
        responseBody: "",
      }
    }
  }

  const responseBody = {
    paymentId: body['ExtraData']['paymentId'],
    status: status,
    tid: body['ep_id'],
    nsu: body['ep_id'],
    code: '',
    message: status,
    authorizationId: body['ep_id'],
    acquirer: 'EP',
    delayToAutoSettle: DELAY_AUTO_SETTLE,
    delayToAutoSettleAfterAntifraud: DELAY_AUTO_SETTLE_ANTIFRAUD,
    delayToCancel: DELAY_AUTO_CANCEL,
    paymentAppData: null,
  }


  return {
    callbackUrl: modifyCallbackUrl(body['ExtraData']['callback'],account),
    responseBody: responseBody,
  }
}


