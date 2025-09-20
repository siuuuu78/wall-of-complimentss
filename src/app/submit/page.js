"use client";
import MessageForm from "@/components/MessageForm";
import Link from "next/link";

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-white 0 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 font-sans">✍️ Kirim Compliment</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 font-sans">
          Tulis pesan untuk temanmu!
        </p>
        <Link
            href="/"
            className="text-sm text-black rounded-lg shadow hover:bg-gray-100 transition font-sans p-2 "
            aria-label="Ke beranda"
          >
            Beranda
          </Link>
      </div>

      {/* Form */}
      <div className="w-full max-w-xl">
        <MessageForm />
      </div>
    </main>
  );
}
