import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import configuration from 'src/configuration/configuration';
import { TodoistApi } from '@doist/todoist-api-typescript';

@Injectable()
export class SyncService {
  private client: Client;
  private todoistApi: TodoistApi;
  constructor() {
    this.todoistApi = new TodoistApi(configuration.TODOIST_API_TOKEN);
    this.client = new Client({ auth: configuration.NOTION_TOKEN });
  }
  async syncProjects() {
    const projects = await this.todoistApi.getProjects();
    projects.forEach(async (project) => {
      const pageId = await this.getPageByTodoistId(
        configuration.NOTION_PROJECTS_DATABASE,
        project.id.toString(),
      );
      if (!pageId) {
        await this.createPage(project, configuration.NOTION_PROJECTS_DATABASE);
      } else {
        await this.updatePage(project, pageId);
      }
    });
  }
  async syncLabels() {
    const labels = await this.todoistApi.getLabels();
    labels.forEach(async (label) => {
      const pageId = await this.getPageByTodoistId(
        configuration.NOTION_LABELS_DATABASE,
        label.id.toString(),
      );
      if (!pageId) {
        await this.createPage(label, configuration.NOTION_LABELS_DATABASE);
      } else {
        await this.updatePage(label, pageId);
      }
    });
  }
  async createPage(project: any, parentId: string) {
    await this.client.pages.create({
      parent: {
        database_id: parentId,
      },
      properties: {
        id: {
          rich_text: [
            {
              text: {
                content: project.id.toString(),
              },
            },
          ],
        },
        Title: {
          title: [
            {
              text: {
                content: project.name,
              },
            },
          ],
        },
      },
    });
  }
  async updatePage(project: any, id: string) {
    await this.client.pages.update({
      page_id: id,
      properties: {
        Title: {
          title: [
            {
              text: {
                content: project.name,
              },
            },
          ],
        },
      },
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
  async sync() {
    await this.syncProjects();
    await this.syncLabels();
  }
}
