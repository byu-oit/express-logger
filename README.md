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
| Option | Type | Description | Default |
| --- | --- | --- | --- |
| logger | Logger | Pino logger for the middleware to use to log requests/responses | `DefaultLogger()` from `@byu-oit/logger` |
| level | string | Log level for each request/response log | `info` |

**Note:** If you provide your own `logger` please use the [@byu-oit/logger](https://www.npmjs.com/package/@byu-oit/logger) to ensure you follow the logging standards.
