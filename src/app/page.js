"use client";
import { useState } from "react";
import MessageList from "@/components/MessageList";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Judul */}
      <h1 className="text-4xl font-bold tracking-tight mb-6 text-center font-sans">
         Wall of Compliments 
      </h1>

      {/* Tombol Submit */}
      <Link
        href="/submit"
        className="mb-8 px-5 py-3 bg-white text-black rounded-lg shadow hover:bg-gray-50 transition font-sans"
      >
        Submit a Compliment
      </Link>

      {/* Search bar */}
      <div className="w-full max-w-lg mb-10 font-sans">
        <SearchBar onSearch={setSearch} />
      </div>

      {/* List pesan */}
      <div className="w-full max-w-4xl font-sans">
        <MessageList searchName={search} />
      </div>
    </main>
  );
}
