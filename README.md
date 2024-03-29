# Express Logger
[![GitHub Release](https://img.shields.io/github/release/byu-oit/express-logger?style=flat)]()
[![codecov](https://codecov.io/gh/byu-oit/express-logger/branch/main/graph/badge.svg?token=6kkkOs7yEe)](https://codecov.io/gh/byu-oit/express-logger)

Default express logging middleware to match [CES Application Development logging standards](https://github.com/byu-oit/ces-dev-best-practices/blob/main/adr/application/0006-basic-logging-standards.md).

## Install

```
npm i @byu-oit/express-logger
```

## Usage
```typescript
import { LoggerMiddleware } from '@byu-oit/express-logger'
const app = Express()

app.use(LoggerMiddleware())

// ... add routes to express app
```

<details>
<summary>CommonJS Equivalent</summary>
<p>

```javascript
const { LoggerMiddleware } = require('@byu-oit/express-logger')

const app = Express()

app.use(LoggerMiddleware())
```

</p>
</details>

Any requests to the express server will then write logs that look like:
```json
{
  "level":"info",
  "time":1617128842026,
  "req":{
    "id":"Root=1-abcde",
    "method":"GET",
    "url":"/persons/123456789",
    "remoteAddress":"::1"
  },"res":{
    "statusCode":200
  },
  "responseTime":168,
  "message":"request completed"
}
```

### Embedded Logger
This middleware will attach the Pino logger to the request object, so if needed you can access the logger like:
```typescript
app.use(LoggerMiddleware())

app.get('/foo', (req, res) => {
  req.log.debug('Inside the /foo route')
  res.send('hello world')
})
```

## Options

Any [`pinoHttp` options](https://github.com/pinojs/pino-http#pinohttpopts-stream) can be overridden, but for compliance with our logging standards, we recommend sticking to the defaults provided in this package.

### Example of overwriting a default

```typescript
app.use(LoggerMiddleware({
  level: 'trace' 
}))
```

**Note:** If you provide your own `logger` please use the [@byu-oit/logger](https://www.npmjs.com/package/@byu-oit/logger) to ensure you follow the logging standards.

```typescript
import DefaultLogger from '@byu-oit/logger'

const myLogger = DefaultLogger()

app.use(LoggerMiddleware({
  logger: myLogger
}))
```
