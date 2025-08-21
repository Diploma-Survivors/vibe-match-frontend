"use client";
import { useParams } from "next/navigation";

export default function ContestRankingPage() {
    const params = useParams();

    // Mock ranking data based on the provided image
    const rankings = [
        {
            rank: 1,
            username: "nmhienbn",
            score: 5500,
            time: "01:49:27",
            problems: [
                { points: 500, time: "01:28:42", attempts: null },
                { points: 0, time: "01:42:35", attempts: 2 },
                { points: 1500, time: "01:49:27", attempts: null },
                { points: 1000, time: "01:22:10", attempts: null },
                { points: 2500, time: "01:14:05", attempts: null },
                { points: 0, time: "01:57:46", attempts: 1 },
                { points: 0, time: "01:59:41", attempts: 3 },
                { points: 0, time: "02:08:10", attempts: 1 }
            ]
        },
        {
            rank: 2,
            username: "NguyenKhangNinh_69",
            score: 4000,
            time: "05:26:00",
            problems: [
                { points: 500, time: "00:39:26", attempts: 1 },
                { points: 1250, time: "02:15:54", attempts: 4 },
                { points: 1500, time: "03:29:45", attempts: 2 },
                { points: 0, time: null, attempts: null },
                { points: 750, time: "04:51:00", attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null }
            ]
        },
        {
            rank: 3,
            username: "mondellbit009",
            score: 3500,
            time: "02:27:27",
            problems: [
                { points: 500, time: "01:53:47", attempts: null },
                { points: 500, time: "02:27:27", attempts: null },
                { points: 0, time: "04:47:49", attempts: 1 },
                { points: 0, time: null, attempts: null },
                { points: 2500, time: "01:52:48", attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null }
            ]
        },
        {
            rank: 4,
            username: "khoa2310",
            score: 2750,
            time: "04:53:17",
            problems: [
                { points: 500, time: "02:05:07", attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 1500, time: "03:28:20", attempts: 5 },
                { points: 0, time: null, attempts: null },
                { points: 750, time: "04:28:17", attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null },
                { points: 0, time: null, attempts: null }
            ]
        },
        {
            rank: 5,
            username: "ahungg_2610",
            score: 2500,
            time: "00:56:19",
            problems: [
                { points: 0, time: "00:06:28", attempts: 7 },
                { points: 0, time: "00:14:18", attempts: 2 },
                { points: 0, time: "03:47:08", attempts: 2 },
                { points: 0, time: "03:40:12", attempts: 1 },
                { points: 2500, time: "00:56:19", attempts: null },
                { points: 0, time: "01:05:09", attempts: 2 },
                { points: 0, time: "03:32:12", attempts: 1 },
                { points: 0, time: "01:22:02", attempts: 1 }
            ]
        }
    ];

    const getScoreDisplay = (problem: any) => {
        if (problem.points === 0 && problem.attempts) {
            return (
                <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 font-medium">0</div>
                    <div className="text-red-600 dark:text-red-400 text-xs">({problem.attempts})</div>
                    {problem.time && <div className="text-xs text-slate-500">{problem.time}</div>}
                </div>
            );
        } else if (problem.points > 0) {
            return (
                <div className="text-center">
                    <div className="text-green-600 dark:text-green-400 font-medium">{problem.points}</div>
                    {problem.attempts && <div className="text-green-600 dark:text-green-400 text-xs">({problem.attempts})</div>}
                    {problem.time && <div className="text-xs text-slate-500">{problem.time}</div>}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-lg border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-800 dark:bg-slate-900 text-white">
                                <th className="px-4 py-3 text-left font-bold">Hạng</th>
                                <th className="px-4 py-3 text-left font-bold min-w-[200px]">Tên truy cập</th>
                                <th className="px-4 py-3 text-center font-bold">Điểm</th>
                                <th className="px-4 py-3 text-center font-bold w-20">1<br /><span className="text-xs">500</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">2<br /><span className="text-xs">1250</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">3<br /><span className="text-xs">1500</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">4<br /><span className="text-xs">2250</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">5<br /><span className="text-xs">2500</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">6<br /><span className="text-xs">3250</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">7<br /><span className="text-xs">4000</span></th>
                                <th className="px-4 py-3 text-center font-bold w-20">8<br /><span className="text-xs">5000</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((user, index) => (
                                <tr key={user.rank} className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <td className="px-4 py-3 text-center font-bold text-lg">
                                        {user.rank}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`font-medium ${user.rank === 1 ? 'text-orange-600 dark:text-orange-400' :
                                                user.rank === 2 ? 'text-purple-600 dark:text-purple-400' :
                                                    user.rank === 3 ? 'text-blue-600 dark:text-blue-400' :
                                                        user.rank === 4 ? 'text-blue-600 dark:text-blue-400' :
                                                            'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {user.username}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="font-bold text-lg">{user.score}</div>
                                        <div className="text-xs text-slate-500">{user.time}</div>
                                    </td>
                                    {user.problems.map((problem, problemIndex) => (
                                        <td key={problemIndex} className="px-2 py-3 text-center">
                                            {getScoreDisplay(problem)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}