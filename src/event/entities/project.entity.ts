export interface Project {
  id: number;
  parent: number;
  parent_id: number;
  order: number;
  color: number;
  name: string;
  comment_count: number;
  shared: boolean;
  favorite: boolean;
  sync_id: number;
  url: string;
}
