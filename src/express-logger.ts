import { Logger } from 'pino'
import PinoHttp = require('pino-http')
import { HttpLogger } from 'pino-http'
import { v4 as randomUuid } from 'uuid'

export interface MiddlewareOptions {
  logger: Logger,
  level?: string
}

export function LoggerMiddleware (input: MiddlewareOptions): HttpLogger {
  return PinoHttp({
    logger: input.logger,
    genReqId: req => {
      return req.headers['x-amzn-trace-id'] ?? createId() // use the amazon trace id as the request id
    }
  })
}

function createId (): string {
  const id = randomUuid().replace(/-/g, '')
  const shortId = id.substr(0, 12) + id.substr(13, 3) + id.substr(17)
  return Buffer.from(shortId, 'hex').toString('base64')
}
