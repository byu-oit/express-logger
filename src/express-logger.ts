import PinoHttp, { HttpLogger } from 'pino-http'
import { v4 as randomUuid } from 'uuid'
import DefaultLogger from '@byu-oit/logger'

export function LoggerMiddleware (options?: PinoHttp.Options): HttpLogger {
  return PinoHttp({
    logger: DefaultLogger(),
    genReqId: req => {
      return req.headers['x-amzn-trace-id'] ?? randomUuid() // use the amazon trace id as the request id
    },
    customLogLevel: (res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn'
      else if (res.statusCode >= 500) return 'error'
      else return 'info'
    },
    ...options
  })
}
