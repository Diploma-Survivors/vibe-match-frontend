export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}
