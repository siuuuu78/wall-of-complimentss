"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection, query, orderBy, limit, getDocs, startAfter,
} from "firebase/firestore";
import { format } from "date-fns";

const PREVIEW_CHARS = 25; // jumlah karakter yang tampil di list

export default function MessageList({ searchName }) {
  const [messages, setMessages] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  const pageSize = 6;

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let q = query(
      collection(db, "compliments"),
      orderBy("created_at", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, "compliments"),
        orderBy("created_at", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snap = await getDocs(q);
    const batch = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // dedup id saat merge
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const merged = [...prev];
      for (const m of batch) if (!seen.has(m.id)) { merged.push(m); seen.add(m.id); }
      return merged;
    });

    if (snap.docs.length < pageSize) setHasMore(false);
    if (snap.docs.length > 0) setLastDoc(snap.docs[snap.docs.length - 1]);

    setLoading(false);
  };

  useEffect(() => {
    if (searchName || !hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadMessages();
      },
      { rootMargin: "200px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [hasMore, searchName, loading]);

  const filtered = searchName
    ? messages.filter((m) =>
        (m.name || "").toLowerCase().includes(searchName.toLowerCase())
      )
    : messages;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((msg) => {
          const full = msg.message || "";
          const preview = full.length > PREVIEW_CHARS
            ? full.slice(0, PREVIEW_CHARS) + "…"
            : full;

          return (
            <Link
              key={msg.id}
              href={`/message/${msg.id}`}
              className="block group"
              aria-label={`Buka detail pesan untuk ${msg.name}`}
            >
              <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition break-words">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  To:{" "}
                  <span className="font-semibold  break-words [overflow-wrap:anywhere]">
                    {msg.name}
                  </span>
                </p>

                {/* preview (dipotong) */}
                <p className="
                  text-base sm:text-xl leading-relaxed mb-3
                  font-caveat
                  whitespace-pre-wrap break-words
                  [overflow-wrap:anywhere] [word-break:break-word]
                ">
                  {preview}
                </p>

                
                {msg.song?.previewUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={msg.song.artworkUrl100} alt={msg.song.trackName} className="w-10 h-10 rounded" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{msg.song.trackName}</p>
                        <p className="text-xs text-gray-500 truncate">{msg.song.artistName}</p>
                      </div>
                    </div>
                  )}  

                <div className="flex pt-4 items-center justify-between">
                <p className="text-xs text-gray-400">
            {msg.created_at?.toDate
              ? format(msg.created_at.toDate(), "dd MMM yyyy HH:mm")
              : "Baru saja"}
          </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && !searchName && (
        <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
          {loading && <p className="text-gray-500 text-sm">Loading...</p>}
        </div>
      )}

      {!hasMore && !searchName && (
        <p className="text-center text-gray-500 mt-6">Semua pesan sudah ditampilkan.</p>
      )}
    </div>
  );
}
