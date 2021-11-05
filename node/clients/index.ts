import {
  IOClients,
} from '@vtex/api'

import { EuPlatesc } from './EuPlatescClient'
import { VtexClient } from './vtexClient'

export class Clients extends IOClients {
  public get EuPlatesc() {
    return this.getOrSet('euPlatesc', EuPlatesc)
  }
  public get vtexClient() {
    return this.getOrSet('vtexClient', VtexClient)
  }
}