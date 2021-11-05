import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api"

export class VtexClient extends ExternalClient {
    constructor(protected context: IOContext, options?: InstanceOptions) {
      super('', context, {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          'Content-Type': 'application/json',
          'X-Vtex-Use-Https': 'true',
          VtexIdclientAutCookie: context.authToken,
        },
      })
    }
  
    public async callbackVtex(url: string, body: any, config = {}): Promise<any> {
      return this.http.post(url, body, config)
    }
}