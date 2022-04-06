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
      const item: Item = {
        id: task.id,
        date_added: task.created,
        project_id: task.projectId,
        content: task.content,
        description: task.description,
        priority: task.priority,
        checked: task.completed ? 1 : 0,
        labels: task.labelIds,
        legacy_id: 0,
        user_id: 0,
        legacy_project_id: 0,
        due: null,
        parent_id: null,
        legacy_parent_id: null,
        child_order: 0,
        section_id: null,
        day_order: 0,
        collapsed: 0,
        added_by_uid: 0,
        assigned_by_uid: 0,
        responsible_uid: null,
        in_history: 0,
        is_deleted: 0,
        sync_id: null,
      };
      if (!pageId) {
        await this.itemService.create(item);
      } else {
        await this.itemService.update(item);
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
