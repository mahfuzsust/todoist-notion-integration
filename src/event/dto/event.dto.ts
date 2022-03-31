import { Item } from '../entities/item.entity';

export class Event {
  event_name: string;
  user_id: number;
  event_data: Item;
  initiator: Initiator;
  version: string;
}

export class Initiator {
  email: string;
  full_name: string;
  id: number;
  image_id: string;
  is_premium: boolean;
}
