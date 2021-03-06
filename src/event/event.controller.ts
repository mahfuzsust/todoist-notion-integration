import { Controller, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: Event) {
    console.log(createEventDto);
    return this.eventService.create(createEventDto);
  }
}
