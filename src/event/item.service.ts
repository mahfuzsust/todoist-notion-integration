import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import configuration from 'src/configuration/configuration';
import { Item, Relation } from './entities/item.entity';

@Injectable()
export class ItemService {
  private client: Client;
  constructor() {
    this.client = new Client({ auth: configuration.NOTION_TOKEN });
  }
  async create(item: Item) {
    const projectId = await this.getPageByTodoistId(
      configuration.NOTION_PROJECTS_DATABASE,
      item.project_id.toString(),
    );
    const labels = await this.getLabels(item.labels);
    await this.client.pages.create({
      parent: {
        database_id: configuration.NOTION_TASKS_DATABASE,
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
          date: item.date_completed
            ? { start: item.date_completed, time_zone: 'Asia/Qatar' }
            : null,
        },
        Priority: {
          select: {
            name: this.getPriority(item.priority),
          },
        },
        Project: {
          relation: [
            {
              id: projectId,
            },
          ],
        },
        Label: {
          relation: labels,
        },
      },
    });
  }
  async getLabels(labels: number[]): Promise<Relation[]> {
    return new Promise((resolve, reject) => {
      if (labels.length == 0) {
        return resolve([]);
      }
      const promises = [];
      const relations: Relation[] = [];
      labels.forEach((label) => {
        promises.push(
          this.getPageByTodoistId(
            configuration.NOTION_LABELS_DATABASE,
            label.toString(),
          ),
        );
      });
      Promise.all(promises)
        .then((value) => {
          value.forEach((item) => {
            relations.push({
              id: item,
            });
          });
          return resolve(relations);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
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
  async update(item: Item) {
    const pageId = await this.getPageByTodoistId(
      configuration.NOTION_TASKS_DATABASE,
      item.id.toString(),
    );
    if (!pageId) {
      await this.create(item);
    }
    const projectId = await this.getPageByTodoistId(
      configuration.NOTION_PROJECTS_DATABASE,
      item.project_id.toString(),
    );
    const labels = await this.getLabels(item.labels);
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
        Project: {
          relation: [
            {
              id: projectId,
            },
          ],
        },
        Label: {
          relation: labels,
        },
      },
    });
  }
  async delete(item: Item) {
    const pageId = await this.getPageByTodoistId(
      configuration.NOTION_TASKS_DATABASE,
      item.id.toString(),
    );

    if (!pageId) {
      await this.create(item);
    }

    await this.client.pages.update({
      page_id: pageId,
      archived: true,
    });
  }
  async complete(item: Item) {
    const pageId = await this.getPageByTodoistId(
      configuration.NOTION_TASKS_DATABASE,
      item.id.toString(),
    );

    if (!pageId) {
      await this.create(item);
    }

    let completedDate = item.date_completed;
    let id = pageId;

    const d = new Date();

    if (item.due != null && item.due.is_recurring) {
      id = `${d.getTime()}`;
    }

    if (!completedDate) {
      completedDate = d.toISOString();
    }

    await this.client.pages.update({
      page_id: pageId,
      properties: {
        id: {
          rich_text: [
            {
              text: {
                content: id,
              },
            },
          ],
        },
        Status: {
          checkbox: true,
        },
        'Completed At': {
          date: { start: completedDate, time_zone: 'Asia/Qatar' },
        },
      },
    });
  }
  async uncomplete(item: Item) {
    const pageId = await this.getPageByTodoistId(
      configuration.NOTION_TASKS_DATABASE,
      item.id.toString(),
    );

    if (!pageId) {
      await this.create(item);
    }

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
