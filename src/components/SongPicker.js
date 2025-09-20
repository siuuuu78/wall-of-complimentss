"use client";
import { useState } from "react";

export default function SongPicker({ onSelect }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = async (e) => {
    e?.preventDefault?.();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/itunes?term=${encodeURIComponent(q)}&limit=8`);
      const json = await res.json();
      setResults(json.results || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={search} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari lagu (judul/artist)…"
          className="flex-1 p-2 border rounded"
        />
        <button className="px-4 bg-blue-500 text-white rounded">Cari</button>
      </form>

      {loading && <p className="text-sm text-gray-500">Mencari…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((r) => (
          <div key={r.trackId} className="p-3 bg-gray-50 rounded border">
            <div className="flex gap-3">
              <img
                src={r.artworkUrl100}
                alt={r.trackName}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="text-sm">
                <p className="font-semibold">{r.trackName}</p>
                <p className="text-gray-500">{r.artistName}</p>
                <audio controls src={r.previewUrl} className="w-full mt-2" />
              </div>
            </div>
            <button
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
              className="mt-3 w-full px-3 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Pilih Lagu Ini
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
