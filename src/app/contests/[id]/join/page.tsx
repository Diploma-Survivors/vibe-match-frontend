"use client";
import { useParams } from "next/navigation";

export default function ContestJoinPage() {
  const params = useParams();

  // Mock data cho lịch sử làm bài của người dùng hiện tại
  const userHistory = {
    username: "vu_the_vy_810[2]",
    displayName: "Vũ Thế Vỹ",
    rank: 2,
    score: 0,
    time: "00:00:00",
    language: "python",
    problems: [
      { points: 0, time: null, attempts: null, maxPoints: 100 },
      { points: 0, time: "00:00:06", attempts: 1, maxPoints: 100 },
      { points: 0, time: null, attempts: null, maxPoints: 100 },
      { points: 0, time: null, attempts: null, maxPoints: 100 },
      { points: 0, time: null, attempts: null, maxPoints: 100 },
    ],
  };

  const getScoreDisplay = (problem: any) => {
    if (problem.points === 0 && problem.attempts) {
      return (
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 font-medium">0</div>
          <div className="text-red-600 dark:text-red-400 text-xs">
            ({problem.attempts})
          </div>
          {problem.time && (
            <div className="text-xs text-slate-500">{problem.time}</div>
          )}
        </div>
      );
    } else if (problem.points > 0) {
      return (
        <div className="text-center">
          <div className="text-green-600 dark:text-green-400 font-medium">
            {problem.points}
          </div>
          {problem.attempts && (
            <div className="text-green-600 dark:text-green-400 text-xs">
              ({problem.attempts})
            </div>
          )}
          {problem.time && (
            <div className="text-xs text-slate-500">{problem.time}</div>
          )}
        </div>
      );
    }
    return (
      <div className="text-center">
        <div className="text-slate-400 dark:text-slate-500 font-medium">-</div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border">
            Xem thành viên tham gia
          </button>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showNames" className="rounded" />
            <label
              htmlFor="showNames"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              Hiển thị tên/tổ chức
            </label>
          </div>
        </div>
      </div>

      {/* Personal ranking table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-lg border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 dark:bg-slate-900 text-white">
                <th className="px-4 py-3 text-left font-bold">Hạng</th>
                <th className="px-4 py-3 text-left font-bold min-w-[200px]">
                  Tên truy cập
                </th>
                <th className="px-4 py-3 text-center font-bold">Điểm</th>
                <th className="px-4 py-3 text-center font-bold w-20">
                  1<br />
                  <span className="text-xs">100</span>
                </th>
                <th className="px-4 py-3 text-center font-bold w-20">
                  2<br />
                  <span className="text-xs">100</span>
                </th>
                <th className="px-4 py-3 text-center font-bold w-20">
                  3<br />
                  <span className="text-xs">100</span>
                </th>
                <th className="px-4 py-3 text-center font-bold w-20">
                  4<br />
                  <span className="text-xs">100</span>
                </th>
                <th className="px-4 py-3 text-center font-bold w-20">
                  5<br />
                  <span className="text-xs">100</span>
                </th>
                <th className="px-4 py-3 text-center font-bold">Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 bg-blue-50 dark:bg-blue-900/20">
                <td className="px-4 py-3 text-center font-bold text-lg">
                  {userHistory.rank}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {userHistory.username}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {userHistory.displayName}
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      {userHistory.language}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="font-bold text-lg">{userHistory.score}</div>
                  <div className="text-xs text-slate-500">
                    {userHistory.time}
                  </div>
                </td>
                {userHistory.problems.map((problem, problemIndex) => (
                  <td key={problemIndex} className="px-2 py-3 text-center">
                    {getScoreDisplay(problem)}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <span className="text-slate-400 dark:text-slate-500">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total AC row */}
        <div className="bg-slate-100 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-4 py-2 text-center font-bold" colSpan={3}>
                  Total AC
                </td>
                {userHistory.problems.map((problem, index) => (
                  <td
                    key={index}
                    className="px-2 py-2 text-center font-bold w-20"
                  >
                    {problem.points > 0 ? 1 : 0}
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-bold">
                  {userHistory.problems.reduce(
                    (acc, p) => acc + (p.points > 0 ? 1 : 0),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
