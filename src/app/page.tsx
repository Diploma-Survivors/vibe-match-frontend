import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            VibeMatch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Nền tảng luyện tập lập trình và tổ chức cuộc thi trực tuyến. Tìm
            kiếm, luyện tập và nộp bài cho hàng trăm bài toán, theo dõi tiến độ,
            và tham gia các cuộc thi để cải thiện kỹ năng thuật toán của bạn.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/problems">
              <Button className="px-6">Khám phá bài toán</Button>
            </Link>
            <Link href="/contests">
              <Button variant="outline" className="px-6">
                Xem cuộc thi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">Bộ sưu tập bài toán</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Lọc theo độ khó, chủ đề và thẻ để tập trung vào kỹ năng bạn muốn.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">Trình soạn thảo hiện đại</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Monaco Editor, hỗ trợ nhiều ngôn ngữ và định dạng mã nguồn.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">Thi và xếp hạng</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Tham gia contest, theo dõi kết quả và nâng cao thứ hạng của bạn.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
