import { Logger } from 'pino'
import PinoHttp, { HttpLogger } from 'pino-http'
import { v4 as randomUuid } from 'uuid'
import DefaultLogger from '@byu-oit/logger'

export interface MiddlewareOptions {
  logger?: Logger
  level?: string
}

export function LoggerMiddleware (input?: MiddlewareOptions): HttpLogger {
  return PinoHttp({
    logger: input?.logger ?? DefaultLogger(),
    genReqId: req => {
      return req.headers['x-amzn-trace-id'] ?? randomUuid() // use the amazon trace id as the request id
    }
  })
}
