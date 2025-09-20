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

  // Ambil data dokumen berdasarkan id
  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, "compliments", id));
        if (snap.exists()) {
          setItem({ id: snap.id, ...snap.data() });
        } else {
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <p className="text-gray-600">Memuat…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">Pesan tidak ditemukan.</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  const shareText = `"${item.message}" - untuk ${item.name}`;

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
         {/* Judul */}
      <h1 className="text-4xl font-bold tracking-tight mb-6 text-center font-sans">
         Wall of Compliments 
      </h1>
      <div className="w-full max-w-3xl">
        {/* Nav kecil */}
        <div className="mb-6 flex items-center justify-between">
        
          <Link
            href="/"
            className="text-sm text-black rounded-lg shadow hover:bg-gray-100 transition font-sans p-2 "
            aria-label="Ke beranda"
          >
            Beranda
          </Link>
        </div>

        {/* Kartu detail */}
        <article className="p-6 sm:p-8 bg-white rounded-2xl shadow-md break-words">
          <header className="mb-3">
            <p className="text-sm text-gray-500">
              To:{" "}
              <span className="font-semibold  break-words [overflow-wrap:anywhere]">
                {item.name}
              </span>
            </p>
          </header>

          {/* Pesan full */}
          <p
            className="
              text-2xl leading-relaxed mb-4 font-caveat
              whitespace-pre-wrap break-words
              [overflow-wrap:anywhere] [word-break:break-word]
            "
          >
            {item.message}
          </p>


          {/* Blok lagu (opsional, muncul hanya jika ada item.song dari iTunes API) */}
          {item.song && (
            <div className="mt-4 p-3 bg-gray-50 rounded shadow flex flex-col sm:flex-row gap-3">
              <img
                src={item.song.artworkUrl100}
                alt={item.song.trackName}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{item.song.trackName}</p>
                <p className="text-gray-500">{item.song.artistName}</p>
                {item.song.previewUrl && (
                  <audio controls src={item.song.previewUrl} className="w-full mt-2" />
                )}
                {item.song.trackViewUrl && (
                  <a
                    href={item.song.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2  text-sm"
                  >
                    Buka di Apple Music
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Aksi share */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
           
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("Link disalin!");
                } catch {
                  alert("Gagal menyalin link.");
                }
              }}
              className="text-gray-700 text-black rounded-lg shadow hover:bg-gray-100 transition font-sans p-2"
            >
              Salin Link
            </button>

          </div>
             {/* Waktu relatif */}
             <p className="text-xs text-gray-400 mb-4 pt-4">
            {item.created_at?.toDate
              ? formatDistanceToNow(item.created_at.toDate(), { addSuffix: true })
              : "Baru saja"}
          </p>
        </article>
      </div>
    </main>
  );
}
