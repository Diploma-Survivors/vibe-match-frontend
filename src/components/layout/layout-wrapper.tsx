"use client";

import { Footer, Header } from "@/components/layout";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide footer on problem pages
  const shouldHideFooter = pathname?.startsWith('/problems/');
  const shouldHideHeader = pathname?.startsWith('/problems/');

  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}