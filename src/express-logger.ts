import PinoHttp, { HttpLogger, Options } from 'pino-http'
import type { Logger } from 'pino'
import { v4 as randomUuid } from 'uuid'
import DefaultLogger from '@byu-oit/logger'

declare module 'express-serve-static-core' {
  interface Request {
    log: Logger
  }
}

export function LoggerMiddleware (options?: Options): HttpLogger {
  return PinoHttp({
    logger: DefaultLogger(),
    genReqId: req => {
      return req.headers['x-amzn-trace-id'] ?? randomUuid() // use the amazon trace id as the request id
    },
    customLogLevel: (res, err) => {
      if (res.statusCode == null) return 'info'
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn'
      else if (res.statusCode >= 500) return 'error'
      else return 'info'
    },
    ...options
  })
}
