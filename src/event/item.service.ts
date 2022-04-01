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
    await this.client.pages.create({
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
  async getPageByTodoistId(id: string): Promise<string> {
    const response = await this.client.databases.query({
      database_id: configuration.NOTION_DATABASE,
      filter: {
        property: 'id',
        rich_text: {
          equals: id,
        },
      },
    });

    if (response && response.results.length > 0) {
      return response.results[0].id;
    }
    return '';
  }
  async update(item: Item) {
    const pageId = await this.getPageByTodoistId(item.id.toString());
    await this.client.pages.update({
      page_id: pageId,
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
        Priority: {
          select: {
            name: this.getPriority(item.priority),
          },
        },
        Status: {
          checkbox: item.checked === 1,
        },
      },
    });
  }
  async delete(item: Item) {
    const pageId = await this.getPageByTodoistId(item.id.toString());
    await this.client.pages.update({
      page_id: pageId,
      archived: true,
    });
  }
  async complete(item: Item) {
    const pageId = await this.getPageByTodoistId(item.id.toString());
    await this.client.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          checkbox: true,
        },
        'Completed At': {
          date: { start: item.date_completed },
        },
      },
    });
  }
  async uncomplete(item: Item) {
    const pageId = await this.getPageByTodoistId(item.id.toString());
    await this.client.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          checkbox: false,
        },
        'Completed At': {
          date: null,
        },
      },
    });
  }
}
