export interface Problem {
  id: string;
  title: string;
  topic: string; // Replaced group and category with single topic field
  difficulty: "Dễ" | "Trung bình" | "Khó";
  points: number;
  acceptanceRate: number;
  submissionCount: number;
  tags: string[];
  subject: string;
  chapter: string;
  problemType: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    level: string;
    avatar: string;
  };
  code: string;
  language: string;
  runtime: string;
  memory: string;
  views: number;
  supports: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

export interface ProblemFilters {
  id?: string;
  title?: string;
  difficulty?: string;
  topic?: string; // Changed from category to topic
  subject?: string;
  chapter?: string;
  tags?: string[];
  problemType?: string;
}

export const DIFFICULTY_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Dễ", label: "Dễ" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Khó", label: "Khó" },
];

export const TOPIC_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Mảng 1 Chiều Cơ Bản", label: "Mảng 1 Chiều Cơ Bản" },
  { value: "Lý Thuyết Số - Toán Học", label: "Lý Thuyết Số - Toán Học" },
  { value: "Thuật toán tham lam", label: "Thuật toán tham lam" },
  { value: "Cấu trúc dữ liệu", label: "Cấu trúc dữ liệu" },
];

export const SUBJECT_OPTIONS = [
  { value: "all", label: "Lập trình cơ bản" },
  { value: "Cấu trúc dữ liệu", label: "Cấu trúc dữ liệu" },
  { value: "Thuật toán", label: "Thuật toán" },
];

export const CHAPTER_OPTIONS = [
  { value: "all", label: "2. Lệnh rẽ nhánh" },
  { value: "1. Kiểu dữ liệu cơ bản", label: "1. Kiểu dữ liệu cơ bản" },
  { value: "3. Vòng lặp", label: "3. Vòng lặp" },
];

export const PROBLEM_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Cơ bản", label: "Cơ bản" },
  { value: "Nâng cao", label: "Nâng cao" },
];
