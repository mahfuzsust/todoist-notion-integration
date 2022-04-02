import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  sync(@Query('code') code: string) {
    if (!code) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.syncService.sync(code);
  }
}
