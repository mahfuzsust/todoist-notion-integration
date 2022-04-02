import { Injectable } from '@nestjs/common';
import configuration from 'src/configuration/configuration';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { PageService } from 'src/common/page.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SyncService {
  private todoistApi: TodoistApi;
  constructor(
    private readonly pageService: PageService,
    private http: HttpService,
  ) {
    this.todoistApi = new TodoistApi(configuration.TODOIST_API_TOKEN);
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
  async sync(code: string) {
    const token = await this.getTodoistToken(code);
    this.todoistApi = new TodoistApi(token);
    await this.syncProjects();
    await this.syncLabels();
  }

  async getTodoistToken(code: string): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      try {
        const body = {
          client_id: configuration.TODOIST_CLIENT_ID,
          client_secret: configuration.TODOIST_CLIENT_SECRET,
          code: code,
        };
        return this.http
          .post(configuration.TODOIST_OAUTH_URL, body)
          .subscribe((x) => {
            resolve(x.data['access_token']);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}
