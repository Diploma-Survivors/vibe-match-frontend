import { ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Không có quyền truy cập | Vibematch',
  description: 'Bạn không có quyền xem trang này.',
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <ShieldAlert className="h-20 w-20 text-destructive" />
        </div>

        <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl text-destructive">
          403
        </h1>

        <h2 className="font-heading text-2xl font-semibold sm:text-3xl md:text-4xl">
          Không có quyền truy cập
        </h2>

        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên nếu
          bạn cho rằng đây là lỗi.
        </p>
      </div>
    </div>
  );
}
