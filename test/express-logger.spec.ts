import { LoggerMiddleware } from '../src/express-logger'
import DefaultLogger from '@byu-oit/logger'
import express, { Express, Request, Response } from 'express'
import { agent as mockRequest } from 'supertest'

const originalProcessEnv = process.env
const originalStdOutWriter = process.stdout.write
const jan1st = new Date(2021, 0, 1)
const dateNowStub = jest.fn(() => jan1st.getTime())
const realDateNow = Date.now.bind(global.Date)
let logged: string = ''
const timeout = 20

// express app
let app: Express

function captureStdoutLogs () {
  return (buffer: string): boolean => {
    logged = `${logged}${buffer}`
    return true
  }
}

function setupExpressApp (): void {
  app = express()
  const logger = DefaultLogger()
  app.use(LoggerMiddleware({
    logger: logger
  }))
  app.get('/foo', (req: Request, res: Response) => res.send('foo'))
  app.post('/bar', (req: Request, res: Response) => {
    setTimeout(() => {
      res.send('bar')
    }, timeout)
  })
}

beforeEach(() => {
  logged = ''
  global.Date.now = dateNowStub
})

afterEach(() => {
  process.env = originalProcessEnv
  process.stdout.write = originalStdOutWriter
  global.Date.now = realDateNow
})

describe('express-logger middleware', () => {
  describe('In production env', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
      process.stdout.write = captureStdoutLogs()
      setupExpressApp()
    })

    test('GET to /foo should use json format', async () => {
      await mockRequest(app).get('/foo')

      expect(logged).toMatch(/{.*}/)
    })

    test('GET to /foo log should have required fields', async () => {
      await mockRequest(app).get('/foo')

      // make sure the fields exist
      const jsonLogEntry = JSON.parse(logged)
      expect(jsonLogEntry.responseTime).toBeDefined()
      expect(jsonLogEntry.message).toBeDefined()
      expect(jsonLogEntry.level).toBeDefined()
      expect(jsonLogEntry.time).toBeDefined()
      expect(jsonLogEntry.req).toBeDefined()
      expect(jsonLogEntry.req.method).toBeDefined()
      expect(jsonLogEntry.req.url).toBeDefined()
      expect(jsonLogEntry.req.remoteAddress).toBeDefined()
      expect(jsonLogEntry.req.id).toBeDefined()
      expect(jsonLogEntry.res.statusCode).toBeDefined()

      // make sure the values are what are expected
      expect(jsonLogEntry.level).toEqual('info')
      expect(jsonLogEntry.time).toEqual(jan1st.getTime())
      expect(jsonLogEntry.req.method).toEqual('GET')
      expect(jsonLogEntry.req.url).toEqual('/foo')
      expect(jsonLogEntry.res.statusCode).toEqual(200)
    })

    test('GET to /foo with amazon trace header should have correct req.id', async () => {
      await mockRequest(app).get('/foo').set('x-amzn-trace-id', 'test-amazon-id')

      const jsonLogEntry = JSON.parse(logged)
      expect(jsonLogEntry.req.id).toEqual('test-amazon-id')
    })

    test('POST to /bar should have responseTime greater than the test timeout', async () => {
      global.Date.now = realDateNow // so that the responseTime can be calculated instead of using the fake jan1st time for both request start and end times
      await mockRequest(app).post('/bar')

      const jsonLogEntry = JSON.parse(logged)
      expect(jsonLogEntry.responseTime).toBeGreaterThanOrEqual(timeout)
    })

    // TODO maybe this test should live in the @byu-oit/logger?
    test('GET to /foo with authorization header should redact it', async () => {
      await mockRequest(app).get('/foo').set('Authorization', 'sensitive token')

      expect(logged).not.toContain('sensitive token')
    })

    // TODO maybe this test should live in the @byu-oit/logger?
    test('GET to /foo with jwt headers should redact them', async () => {
      const sensitiveJwt = 'sensitive jwt'
      await mockRequest(app)
        .get('/foo')
        .set('X-Jwt-Assertion', sensitiveJwt)
        .set('X-Jwt-Assertion-Original', sensitiveJwt)
        .set('Assertion', sensitiveJwt)

      expect(logged).not.toContain(sensitiveJwt)
    })
  })

  describe('In local env', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'local'
      process.stdout.write = captureStdoutLogs()
      setupExpressApp()
    })

    test('GET to /foo should use pretty printed format', async () => {
      await mockRequest(app).get('/foo')

      expect(logged).not.toMatch(/^{.*}$/gs)
    })
  })
})
