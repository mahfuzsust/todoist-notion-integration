import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('/done')
  syncDone() {
    return 'Sync done';
  }

  @Get()
  async sync(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    await this.syncService.sync(code);
    res.redirect('sync/done');
  }
}
