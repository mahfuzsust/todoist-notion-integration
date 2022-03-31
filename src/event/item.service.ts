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
        Completed: {
          date: {
            start: item.date_completed,
          },
        },
      },
    });
    console.log(response1);
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
