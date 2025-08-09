export interface Problem {
  id: string;
  title: string;
  group: string;
  category: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  points: number;
  acceptanceRate: number;
  submissionCount: number;
  tags: string[];
  subject: string;
  chapter: string;
  problemType: string;
}

export interface ProblemFilters {
  id?: string;
  title?: string;
  difficulty?: string;
  category?: string;
  subject?: string;
  chapter?: string;
  problemType?: string;
}

export const DIFFICULTY_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Dễ", label: "Dễ" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Khó", label: "Khó" },
];

export const CATEGORY_OPTIONS = [
  { value: "all", label: "Tham lam" },
  { value: "Mảng 1 Chiều Cơ Bản", label: "Mảng 1 Chiều Cơ Bản" },
  { value: "Lý Thuyết Số - Toán Học", label: "Lý Thuyết Số - Toán Học" },
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
