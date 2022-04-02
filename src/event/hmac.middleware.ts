import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import configuration from 'src/configuration/configuration';

@Injectable()
export class HMACMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const hash = createHmac('sha256', configuration.TODOIST_CLIENT_SECRET)
      .update(JSON.stringify(req.body))
      .digest('base64');

    console.log('X-Todoist-Hmac-SHA256:', req.header('X-Todoist-Hmac-SHA256'));
    console.log('Hash:', hash);
    console.log(hash === req.header('X-Todoist-Hmac-SHA256'));

    next();
  }
}
