import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import configuration from 'src/configuration/configuration';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { PageService } from 'src/common/page.service';
import { HttpService } from '@nestjs/axios';
import { ItemService } from 'src/event/item.service';
import { Item } from 'src/event/entities/item.entity';

@Injectable()
export class SyncService {
  private todoistApi: TodoistApi;
  constructor(
    private readonly pageService: PageService,
    private readonly itemService: ItemService,
    private http: HttpService,
  ) {}
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
  async syncTasks() {
    const tasks = await this.todoistApi.getTasks();
    tasks.forEach(async (task) => {
      const pageId = await this.pageService.getPageByTodoistId(
        configuration.NOTION_TASKS_DATABASE,
        task.id.toString(),
      );
      if (!pageId) {
        await this.itemService.create(task as unknown as Item);
      } else {
        await this.itemService.update(task as unknown as Item);
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
  async sync(code: string): Promise<string> {
    const token = await this.getTodoistToken(code);
    if (!token) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    this.todoistApi = new TodoistApi(token);
    await this.syncProjects();
    await this.syncLabels();
    await this.syncTasks();

    return 'Sync completed';
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
