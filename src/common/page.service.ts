import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import configuration from 'src/configuration/configuration';

@Injectable()
export class PageService {
  private client: Client;
  constructor() {
    this.client = new Client({ auth: configuration.NOTION_TOKEN });
  }
  async createPage(page: any, parentId: string) {
    await this.client.pages.create({
      parent: {
        database_id: parentId,
      },
      properties: {
        id: {
          rich_text: [
            {
              text: {
                content: page.id.toString(),
              },
            },
          ],
        },
        Title: {
          title: [
            {
              text: {
                content: page.name,
              },
            },
          ],
        },
      },
    });
  }
  async updatePage(page: any, id: string) {
    await this.client.pages.update({
      page_id: id,
      properties: {
        Title: {
          title: [
            {
              text: {
                content: page.name,
              },
            },
          ],
        },
      },
    });
  }
  async deletePage(id: string) {
    await this.client.pages.update({
      page_id: id,
      archived: true,
    });
  }

  async getPageByTodoistId(parentId: string, id: string): Promise<string> {
    const response = await this.client.databases.query({
      database_id: parentId,
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
}
