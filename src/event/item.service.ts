import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import configuration from 'src/configuration/configuration';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  private client: Client;
  constructor() {
    this.client = new Client({ auth: configuration.NOTION_TOKEN });
  }
  async create(item: Item) {
    console.log(item);

    const response1 = await this.client.pages.create({
      parent: {
        database_id: configuration.NOTION_DATABASE,
      },
      properties: {
        id: {
          rich_text: [
            {
              text: {
                content: item.id.toString(),
              },
            },
          ],
        },
        Title: {
          title: [
            {
              text: {
                content: item.content,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: item.description,
              },
            },
          ],
        },
        Status: {
          checkbox: item.checked === 1,
        },
        'Completed At': {
          date: item.date_completed ? { start: item.date_completed } : null,
        },
        Priority: {
          select: {
            name: this.getPriority(item.priority),
          },
        },
      },
    });
    console.log(response1);
  }
  getPriority(priority: number): string {
    const obj = {
      '1': 'p4',
      '2': 'p3',
      '3': 'p2',
      '4': 'p1',
    };
    return obj[priority];
  }
  update(item: Item) {
    return null;
  }
  delete(item: Item) {
    return null;
  }
  complete(item: Item) {
    return null;
  }
  uncomplete(item: Item) {
    return null;
  }
}