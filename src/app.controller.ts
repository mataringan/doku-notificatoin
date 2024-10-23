import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  @Post('/v1/transfer-va/payment')
  async notifications(@Req() request: Request, @Res() response: Response, @Headers() headers, @Body() body: any) {
    const notificationBody = JSON.stringify(body);
    const notificationPath = '/v1/transfer-va/payment'; // Adjust according to your notification path
    const secretKey = 'SK-nq64TxHt2o58OeUPDZeN'; // Adjust according to your secret key

    const digest = crypto.createHash('sha256').update(notificationBody).digest('base64');
    const rawSignature = `Client-Id:${headers['client-id']}\n`
      + `Request-Id:${headers['request-id']}\n`
      + `Request-Timestamp:${headers['request-timestamp']}\n`
      + `Request-Target:${notificationPath}\n`
      + `Digest:${digest}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('base64');
    const finalSignature = `HMACSHA256=${signature}`;

    if (finalSignature === headers['signature']) {
      response.status(200).send('OK');
    } else {
      response.status(400).send('Invalid Signature');
    }
  }
}