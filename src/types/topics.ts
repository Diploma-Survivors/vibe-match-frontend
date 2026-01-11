export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  postCount?: number; // Added for UI
}

export interface CreateTopicRequest {
  name: string;
  description: string;
}

export interface UpdateTopicRequest extends Partial<CreateTopicRequest> {}
