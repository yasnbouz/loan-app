import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 mt-44 px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
