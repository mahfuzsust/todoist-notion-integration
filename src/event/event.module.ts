import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ItemService } from './item.service';
import { PageService } from 'src/common/page.service';

@Module({
  controllers: [EventController],
  providers: [EventService, ItemService, PageService],
})
export class EventModule {}
