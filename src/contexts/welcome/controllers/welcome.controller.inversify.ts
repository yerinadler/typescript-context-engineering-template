import 'reflect-metadata';
import type { Request, Response } from 'express';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { createSuccessResponse } from '../../../shared/api';

@controller('/')
export class WelcomeController {
  @httpGet('/hello/:name')
  hello(@request() req: Request, @response() res: Response): void {
    const name = req.params.name;
    const response = createSuccessResponse('WELCOME_000', `hello ${name}`);
    res.json(response);
  }
}
