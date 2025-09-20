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
      e.preventDefault();
      search();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input & tombol: stack di mobile, sejajar di ≥sm */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari lagu (judul/artist)…"
          className="w-full sm:flex-1 h-12 px-3 border rounded"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="w-full sm:w-auto h-12 px-4 bg-white text-black rounded disabled:opacity-50"
        >
          {loading ? "Mencari…" : "Cari"}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Mencari…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((r) => (
          <div key={r.trackId} className="p-3 bg-gray-50 rounded shadow">
            <div className="flex gap-3">
              <img
                src={r.artworkUrl100}
                alt={r.trackName}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="text-sm min-w-0 flex-1">
                <p className="font-semibold truncate">{r.trackName}</p>
                <p className="text-gray-500 truncate">{r.artistName}</p>
              </div>
            </div>
            {r.previewUrl && (
              <audio controls src={r.previewUrl} className="w-full mt-2" />
            )}
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
              className="mt-3 w-full px-3 py-2 bg-white text-black rounded hover:bg-gray-100 shadow"
            >
              Pilih Lagu Ini
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
