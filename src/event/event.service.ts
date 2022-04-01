import { Injectable } from '@nestjs/common';
import { PageService } from 'src/common/page.service';
import configuration from 'src/configuration/configuration';
import { Event } from './dto/event.dto';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

@Injectable()
export class EventService {
  constructor(
    private readonly itemService: ItemService,
    private readonly pageService: PageService,
  ) {}
  create(event: Event) {
    switch (event.event_name) {
      case 'item:added':
        this.itemService.create(event.event_data as Item);
        break;
      case 'item:completed':
        this.itemService.complete(event.event_data as Item);
        break;
      case 'item:updated':
        this.itemService.update(event.event_data as Item);
        break;
      case 'item:deleted':
        this.itemService.delete(event.event_data as Item);
        break;
      case 'item:uncompleted':
        this.itemService.uncomplete(event.event_data as Item);
        break;
      case 'project:added':
        this.createProject(event.event_data);
        break;
      case 'project:updated':
        this.updateProject(event.event_data);
        break;
      case 'project:deleted':
        this.deleteProject(event.event_data);
        break;
      case 'label:added':
        this.createLabel(event.event_data);
        break;
      case 'label:updated':
        this.updateLabel(event.event_data);
        break;
      case 'label:deleted':
        this.deleteLabel(event.event_data);
        break;
      default:
        break;
    }
  }
  async createProject(event_data: any) {
    await this.pageService.createPage(
      event_data,
      configuration.NOTION_PROJECTS_DATABASE,
    );
  }
  async updateProject(event_data: any) {
    const pageId = await this.pageService.getPageByTodoistId(
      configuration.NOTION_PROJECTS_DATABASE,
      event_data.id.toString(),
    );
    if (pageId) {
      await this.pageService.updatePage(event_data, pageId);
    }
  }
  async deleteProject(event_data: any) {
    const pageId = await this.pageService.getPageByTodoistId(
      configuration.NOTION_PROJECTS_DATABASE,
      event_data.id.toString(),
    );
    if (pageId) {
      await this.pageService.deletePage(pageId);
    }
  }
  async createLabel(event_data: any) {
    await this.pageService.createPage(
      event_data,
      configuration.NOTION_LABELS_DATABASE,
    );
  }
  async updateLabel(event_data: any) {
    const pageId = await this.pageService.getPageByTodoistId(
      configuration.NOTION_LABELS_DATABASE,
      event_data.id.toString(),
    );
    if (pageId) {
      await this.pageService.updatePage(event_data, pageId);
    }
  }
  async deleteLabel(event_data: any) {
    const pageId = await this.pageService.getPageByTodoistId(
      configuration.NOTION_LABELS_DATABASE,
      event_data.id.toString(),
    );
    if (pageId) {
      await this.pageService.deletePage(pageId);
    }
  }
}
