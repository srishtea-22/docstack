export interface Folder {
  id: string;
  name: string;
  children?: Folder[]; // children are optional
}

export interface Entity {
  id: number;
  name: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
  filePath: string | null;
}