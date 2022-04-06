export class Due {
  date: string;
  timezone: null;
  string: string;
  lang: string;
  is_recurring: boolean;
}
export class Item {
  id: number;
  legacy_id: number;
  user_id: number;
  project_id: number;
  legacy_project_id: number;
  content: string;
  description: string;
  priority: number;
  due: Due;
  parent_id: null;
  legacy_parent_id: null;
  child_order: number;
  section_id: null;
  day_order: number;
  collapsed: number;
  labels: number[];
  added_by_uid: number;
  assigned_by_uid: number;
  responsible_uid: null;
  checked: number;
  in_history: number;
  is_deleted: number;
  sync_id: null;
  date_added: string;
  date_completed?: string;
}

export class Relation {
  id: string;
}

export class Project {
  id: number;
  legacy_id: number;
  name: string;
  color: number;
  parent_id: null;
  child_order: number;
  collapsed: number;
  shared: boolean;
  legacy_parent_id: null;
  sync_id: null;
  is_deleted: number;
  is_archived: number;
  is_favorite: number;
}

export class Label {
  id: number;
  name: string;
  color: number;
  item_order: number;
  is_deleted: number;
  is_favorite: number;
}
