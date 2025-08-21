export interface Contest {
    id: string;
    name: string;
    startTime: string;
    duration: string;
    writers: string[];
    status: "upcoming" | "ongoing" | "finished";
    participantCount: number;
    isVirtual?: boolean;
    registrationOpen?: boolean;
    image?: string;
    description?: string;
}

export interface User {
    id: string;
    username: string;
    avatar: string;
    country: string;
    rating: number;
    attendedContests: number;
    rank: number;
}

export interface ContestStatus {
    upcoming: Contest[];
    ongoing: Contest[];
    finished: Contest[];
}

export const CONTEST_STATUS_COLORS = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ongoing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    finished: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export const CONTEST_STATUS_LABELS = {
    upcoming: "Sắp diễn ra",
    ongoing: "Đang diễn ra",
    finished: "Đã kết thúc",
};
