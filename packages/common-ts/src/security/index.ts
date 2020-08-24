import { Request, Response, Express } from 'express'
import helmet from 'helmet'

const rejectBadHeaders = (req: Request, res: Response, next: () => void) => {
  if (
    req.headers['challenge-bypass-token'] ||
    req.headers['x_proxy_id'] ||
    // Note: This one doesn't work on Google Cloud:
    req.headers['via']
  ) {
    res.status(400).send('Bad Request')
  } else {
    next()
  }
}

export const secureExpressApp = (app: Express): void => {
  // This is meant to provide some security across a wide range of
  // attacks. It is mentioned in the express docs under
  // Production Best Practices: Security
  // https://expressjs.com/en/advanced/best-practice-security.html
  // It's not entirely clear that this is helpful
  app.use(helmet())

  // Fix a known bad
  app.use(rejectBadHeaders)
}
