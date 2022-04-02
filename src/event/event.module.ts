import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ItemService } from './item.service';
import { PageService } from 'src/common/page.service';
import { HMACMiddleware } from './hmac.middleware';

@Module({
  controllers: [EventController],
  providers: [EventService, ItemService, PageService],
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HMACMiddleware).forRoutes('event');
  }
}
