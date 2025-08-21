"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockContests } from "@/lib/data/mock-contests";
import { CONTEST_STATUS_COLORS, CONTEST_STATUS_LABELS } from "@/types/contest";
import { useParams } from "next/navigation";
import { Calendar, Clock, Users, Trophy, Award, BookOpen, FileText, Globe } from "lucide-react";

export default function ContestInfoPage() {
    const params = useParams();
    const contest = mockContests.find(c => c.id === params.id);
    if (!contest) return null;

    const isUpcoming = contest.status === "upcoming";
    const isOngoing = contest.status === "ongoing";
    const isFinished = contest.status === "finished";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        {/* Contest Header */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
                            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-start justify-between mb-4">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                        {contest.name}
                                    </h1>
                                    <Badge className={CONTEST_STATUS_COLORS[contest.status]}>
                                        {CONTEST_STATUS_LABELS[contest.status]}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Ngày thi</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                {new Date(contest.startTime).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Giờ bắt đầu</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                {new Date(contest.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Thời lượng</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{contest.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Thí sinh</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                {contest.participantCount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contest Status & Rules */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                    {isFinished ? "Kỳ thi đã kết thúc." : isOngoing ? "Kỳ thi đang diễn ra." : "Kỳ thi sắp diễn ra."}
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400">
                                    {isFinished ? `Kết thúc vào ${new Date(contest.startTime).toLocaleDateString("vi-VN")}, ${new Date(contest.startTime).getHours()}:${new Date(contest.startTime).getMinutes().toString().padStart(2, '0')} +07` :
                                        `${new Date(contest.startTime).getHours()} giờ, ${new Date(contest.startTime).getMinutes().toString().padStart(2, '0')} phút ngày ${new Date(contest.startTime).toLocaleDateString("vi-VN")}, ${new Date(contest.startTime).getHours()}:${new Date(contest.startTime).getMinutes().toString().padStart(2, '0')} +07`}
                                </p>
                            </div>

                            <div className="space-y-4 text-slate-700 dark:text-slate-300">
                                <p>Kỳ thi này <strong>không</strong> tính rating.</p>
                                <div className="space-y-2">
                                    <p className="pl-4">Một số (hoặc tất cả) bài tập cho phép bạn nhận điểm mà không cần phải đúng toàn bộ test.</p>
                                    <p className="pl-4">Kỳ thi này <strong>không</strong> sử dụng pretest.</p>
                                    <p className="pl-4">Kỳ thi này <strong>không</strong> giới hạn số lần nộp bài.</p>
                                    <p className="pl-4">Kỳ thi sử dụng format VNOI.</p>
                                    <div className="pl-8 space-y-1">
                                        <p>Điểm của bài sẽ là điểm của lần nộp bài có điểm lớn nhất.</p>
                                        <p>Các lần nộp bài trước lần nộp bài có điểm lớn nhất sẽ tính <strong>penalty 5 phút</strong>.</p>
                                        <p>Các thí sinh bằng điểm sẽ được phân định bằng thời gian của <strong>lần nộp bài cuối cùng làm thay đổi kết quả</strong> (cộng với penalty).</p>
                                    </div>
                                    <p>Bảng điểm được hiển thị trong quá trình diễn ra kỳ thi.</p>
                                </div>
                            </div>
                        </div>

                        {/* Problems List */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
                            <div className="bg-slate-800 dark:bg-slate-900 text-white p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6" />
                                    <h2 className="text-xl font-bold">Bài</h2>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {[
                                    { id: "1", name: "Thuyền Giấy", points: 500 },
                                    { id: "2", name: "Hội Hoa", points: 1250 },
                                    { id: "3", name: "Bài học về sáng số nguyên tố đầu tiên", points: 1500 },
                                    { id: "4", name: "Độ Thị, Hoán Vị và Xâu Nhị Phân", points: 2250 },
                                    { id: "5", name: "Hikamura, kỳ thủ cờ tướng", points: 2500 },
                                    { id: "6", name: "Eo Xi Cây Cúp", points: 3250 },
                                    { id: "7", name: "Max tiền tố của Tổng tiền tố", points: 4000 },
                                    { id: "8", name: "Tàhp và dãy ngẫu xếp đơn điệu", points: 5000 }
                                ].map((problem, index) => (
                                    <div key={problem.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                                                <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{problem.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded"></div>
                                                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                                                    {problem.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {problem.points}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                                <Button variant="outline" className="w-full">
                                    Tất cả bài tập
                                </Button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bình luận</h2>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                    Hãy đọc nội quy trước khi bình luận.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                        D
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">dex1112223334455</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">đã bình luận 8:12:06 sáng, 18/07/2025</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300">Chúc mọi người thi tốt!</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                    <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
                                        Bạn cần đăng nhập hoặc đăng ký để bình luận.
                                    </p>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Bình luận mới</h3>
                                        <textarea
                                            placeholder="Bạn cần giải được 5 bài trước khi bình luận."
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                                            rows={4}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Writers Section */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Người ra đề</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {contest.writers.map(writer => (
                                    <div key={writer} className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 to-slate-600 rounded-full hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800 dark:hover:to-emerald-700 transition-all duration-300 cursor-pointer">
                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {writer.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                            {writer}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        {/* Contest Status */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                            <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Trạng thái cuộc thi
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Badge className={`${CONTEST_STATUS_COLORS[contest.status]} text-lg px-4 py-2`}>
                                        {CONTEST_STATUS_LABELS[contest.status]}
                                    </Badge>
                                </div>
                                {isUpcoming && (
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Cuộc thi sẽ bắt đầu trong:</p>
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            2 ngày 14 giờ
                                        </div>
                                    </div>
                                )}
                                {isOngoing && (
                                    <div className="text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Thời gian còn lại:</p>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            1:45:30
                                        </div>
                                    </div>
                                )}
                                <Button
                                    className={`w-full ${isUpcoming ? "bg-blue-600 hover:bg-blue-700" :
                                        isOngoing ? "bg-green-600 hover:bg-green-700" :
                                            "bg-slate-600 hover:bg-slate-700"
                                        }`}
                                    disabled={isFinished}
                                >
                                    {isUpcoming ? "Đăng ký tham gia" :
                                        isOngoing ? "Vào thi ngay" :
                                            "Xem kết quả"}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                            <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200">Thống kê nhanh</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">Số bài tập:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">8 bài</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">Điểm tối đa:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">5000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">Đã đăng ký:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {contest.participantCount.toLocaleString()}
                                    </span>
                                </div>
                                {contest.isVirtual && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Chế độ:</span>
                                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                                            Virtual
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
