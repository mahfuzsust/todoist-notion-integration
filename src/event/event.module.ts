import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ItemService } from './item.service';

@Module({
  controllers: [EventController],
  providers: [EventService, ItemService]
})
export class EventModule {}
