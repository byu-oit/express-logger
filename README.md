# express-logger
Default express logging middleware to match [BYU Application Development logging standards](https://github.com/byu-oit/app-dev-best-practices/blob/main/adr/application/0006-basic-logging-standards.md).

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
const { default: LoggerMiddleware } = require('@byu-oit/express-logger')

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
