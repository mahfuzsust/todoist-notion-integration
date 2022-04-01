import { Injectable } from '@nestjs/common';
import { Event } from './dto/event.dto';
import { ItemService } from './item.service';

@Injectable()
export class EventService {
  constructor(private readonly itemService: ItemService) {}
  create(event: Event) {
    switch (event.event_name) {
      case 'item:added':
        this.itemService.create(event.event_data);
        break;
      case 'item:completed':
        this.itemService.complete(event.event_data);
        break;
      case 'item:updated':
        this.itemService.update(event.event_data);
        break;
      case 'item:deleted':
        this.itemService.delete(event.event_data);
        break;
      case 'item:uncompleted':
        this.itemService.uncomplete(event.event_data);
        break;
      default:
        break;
    }
  }
}
