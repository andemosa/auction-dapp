"use client";

import Header from "./components/internal/Header";
import Details from "./components/auction/Details";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col justify-between gap-16">
      <Header />

      <section className="mt-40 grid p-4 md:px-8">
        <Details />
      </section>
    </main>
  );
}
