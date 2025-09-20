"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import SongPicker from "@/components/SongPicker";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [song, setSong] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Nama penerima wajib diisi.";
    if (!message.trim()) e.message = "Pesan wajib diisi.";
    if (message.length > 140) e.message = "Maksimal 140 karakter.";
    if (!song) e.song = "Silakan pilih lagu terlebih dahulu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await addDoc(collection(db, "compliments"), {
      name: name.trim(),
      message: message.trim(),
      song, // wajib
      created_at: serverTimestamp(),
    });

    setName("");
    setMessage("");
    setSong(null);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      router.push("/");
    }, 500);
  };

  const canSubmit =
    name.trim() && message.trim() && message.length <= 140 && !!song;

  return (
    <div className="relative">
      {success && (
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg animate-bounce">
          ✅ Pesan berhasil dikirim!
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow space-y-4">
        {/* Nama */}
        <div>
          <input
            type="text"
            placeholder="Untuk siapa?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={`w-full p-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p id="err-name" className="text-xs text-red-600 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Pesan */}
        <div>
          <textarea
            placeholder="Tulis pesanmu... (max 140 karakter)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={140}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={`w-full p-2 border rounded ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex items-center justify-between">
            {errors.message && (
              <p id="err-message" className="text-xs text-red-600">
                {errors.message}
              </p>
            )}
            <p className="text-right text-xs text-gray-500">
              {message.length}/140
            </p>
          </div>
        </div>

        {/* Lagu (WAJIB) */}
        <div className={`pt-3 border-t ${errors.song ? "border-red-300" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">
              Pilih lagu <span className="text-red-600">*</span>
            </p>
            {!song && <span className="text-xs text-gray-500">wajib dipilih</span>}
          </div>

          {song ? (
            <div className="p-3 bg-white rounded shadow">
              {/* baris info */}
              <div className="flex items-start gap-3">
                <img
                  src={song.artworkUrl100}
                  alt={song.trackName}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="text-sm flex-1 min-w-0">
                  <p className="font-semibold truncate">{song.trackName}</p>
                  <p className="text-gray-500 truncate">{song.artistName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSong(null)}
                  className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  Ganti Lagu
                </button>
              </div>

              {/* audio full width di bawah, tidak tertekan flex */}
              {song.previewUrl && (
                <audio
                  controls
                  src={song.previewUrl}
                  preload="none"
                  className="w-full mt-3"
                />
              )}
            </div>
          ) : (
            <>
              <SongPicker onSelect={setSong} />
              {errors.song && (
                <p className="text-xs text-red-600 mt-1">{errors.song}</p>
              )}
            </>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 rounded transition text-black ${
            canSubmit
              ? "bg-white hover:bg-gray-100"
              : "bg-white cursor-not-allowed opacity-70"
          } shadow`}
        >
          Kirim Pesan
        </button>
      </form>
    </div>
  );
}
