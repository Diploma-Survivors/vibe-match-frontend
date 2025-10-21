export interface Topic {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTopicRequest {
  name: string;
  description: string;
}

export interface UpdateTopicRequest extends Partial<CreateTopicRequest> {}

// Temporary constants - will be replaced by dynamic data from backend
export const TOPIC_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'algorithms', label: 'Thuật toán' },
  { value: 'data-structures', label: 'Cấu trúc dữ liệu' },
  { value: 'math', label: 'Toán học' },
];
