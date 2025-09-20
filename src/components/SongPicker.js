"use client";
import { useState } from "react";

export default function SongPicker({ onSelect }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!q.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/itunes?term=${encodeURIComponent(q)}&limit=8`);
      const json = await res.json();
      setResults(json.results || []);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Jangan submit form utama
      e.preventDefault();
      search();
    }
  };

  return (
    <div className="space-y-3">
      {/* BUKAN form: hanya wrapper biasa */}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari lagu (judul/artist)…"
          className="flex-1 p-2 shadow rounded"
        />
        <button
          type="button"               
          onClick={search}
          disabled={loading}
          className="px-4 bg-white text-black rounded disabled:opacity-50"
        >
          {loading ? "Mencari…" : "Cari"}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Mencari…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((r) => (
          <div key={r.trackId} className="p-3 bg-gray-50 rounded ">
            <div className="flex gap-3">
              <img
                src={r.artworkUrl100}
                alt={r.trackName}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="text-sm min-w-0">
                <p className="font-semibold truncate">{r.trackName}</p>
                <p className="text-gray-500 truncate">{r.artistName}</p>
              </div>
            </div>
            <button
              type="button"           
              onClick={() =>
                onSelect({
                  trackId: r.trackId,
                  trackName: r.trackName,
                  artistName: r.artistName,
                  artworkUrl100: r.artworkUrl100,
                  previewUrl: r.previewUrl,
                  trackViewUrl: r.trackViewUrl,
                  collectionName: r.collectionName,
                })
              }
              className="mt-3 w-full px-3 py-2 bg-white text-black shadow rounded hover:bg-gray-100"
            >
              Pilih Lagu Ini
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
