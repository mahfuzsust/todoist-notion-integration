import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PageService } from 'src/common/page.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService, PageService],
})
export class SyncModule {}
