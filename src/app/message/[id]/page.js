"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export default function MessageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "compliments", id));
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      } else {
        setItem(null);
      }
      setLoading(false);
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <p className="text-gray-500">Memuat…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Pesan tidak ditemukan.</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Kembali</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl">
         {/* Judul */}
      <h1 className="text-4xl font-bold tracking-tight mb-6 text-center font-sans">
         Wall of Compliments 
      </h1>
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black hover:underline"
          >
            ← Kembali
          </Link>
        </div>

        <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-md break-words">
          <p className="text-sm text-gray-500 mb-2">
            To:{" "}
            <span className="font-semibold  break-words [overflow-wrap:anywhere]">
              {item.name}
            </span>
          </p>

          {/* FULL message */}
          <p className="
            text-2xl leading-relaxed mb-4 font-caveat
            whitespace-pre-wrap break-words
            [overflow-wrap:anywhere] [word-break:break-word]
          ">
            {item.message}
          </p>

          <p className="text-xs text-gray-400 mb-4">
            {item.created_at?.toDate
              ? formatDistanceToNow(item.created_at.toDate(), { addSuffix: true })
              : "Baru saja"}
          </p>

          {/* Share */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `"${item.message}" - untuk ${item.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Bagikan ke WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `"${item.message}" - untuk ${item.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Bagikan ke Twitter/X
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
