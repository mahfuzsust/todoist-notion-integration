import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import configuration from 'src/configuration/configuration';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { PageService } from 'src/common/page.service';

@Injectable()
export class SyncService {
  private client: Client;
  private todoistApi: TodoistApi;
  constructor(private readonly pageService: PageService) {
    this.todoistApi = new TodoistApi(configuration.TODOIST_API_TOKEN);
    this.client = new Client({ auth: configuration.NOTION_TOKEN });
  }
  async syncProjects() {
    const projects = await this.todoistApi.getProjects();
    projects.forEach(async (project) => {
      const pageId = await this.pageService.getPageByTodoistId(
        configuration.NOTION_PROJECTS_DATABASE,
        project.id.toString(),
      );
      if (!pageId) {
        await this.pageService.createPage(
          project,
          configuration.NOTION_PROJECTS_DATABASE,
        );
      } else {
        await this.pageService.updatePage(project, pageId);
      }
    });
  }
  async syncLabels() {
    const labels = await this.todoistApi.getLabels();
    labels.forEach(async (label) => {
      const pageId = await this.pageService.getPageByTodoistId(
        configuration.NOTION_LABELS_DATABASE,
        label.id.toString(),
      );
      if (!pageId) {
        await this.pageService.createPage(
          label,
          configuration.NOTION_LABELS_DATABASE,
        );
      } else {
        await this.pageService.updatePage(label, pageId);
      }
    });
  }
  async sync() {
    await this.syncProjects();
    await this.syncLabels();
  }
}
