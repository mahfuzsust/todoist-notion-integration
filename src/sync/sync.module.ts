import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PageService } from 'src/common/page.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SyncController],
  providers: [SyncService, PageService],
})
export class SyncModule {}
