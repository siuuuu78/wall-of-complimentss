"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import SongPicker from "./SongPicker";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [song, setSong] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    await addDoc(collection(db, "compliments"), {
      name,
      message,
      song: song || null, 
      created_at: serverTimestamp(),
    });

    setName("");
    setMessage("");
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      router.push("/");
    }, 500);
  };

  return (
    <div className="relative">
      {success && (
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg animate-bounce">
          ✅ Pesan berhasil dikirim!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-lg shadow space-y-3"
      >
        <input
          type="text"
          placeholder="Untuk siapa?"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 shadow rounded font-sans focus:outline"
        />
        <textarea
          placeholder="Tulis pesanmu... (max 140 karakter)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={140}
          className="w-full p-2 shadow rounded font-sans focus:outline"
        />
        <p className="text-right text-xs text-gray-500 font-sans">{message.length}/140</p>

         {/* Picker lagu (opsional) */}
         <div className="pt-2 border-t">
          <p className="font-medium mb-2">Tambahkan lagu (opsional)</p>
          {song ? (
            <div className="p-3 bg-gray-50 rounded border flex items-center gap-3">
              <img src={song.artworkUrl100} alt={song.trackName} className="w-12 h-12 rounded" />
              <div className="text-sm">
                <p className="font-semibold">{song.trackName}</p>
                <p className="text-gray-500">{song.artistName}</p>
                {song.previewUrl && <audio controls src={song.previewUrl} className="w-full mt-2" />}
              </div>
              <button
                type="button"
                onClick={() => setSong(null)}
                className="ml-auto px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Hapus
              </button>
            </div>
          ) : (
            <SongPicker onSelect={setSong} />
          )}
        </div>

        <button
          type="submit"
          className="w-full shadow  text-black py-2 rounded hover:bg-gray-100 transition font-sans"
        >
          Kirim Pesan
        </button>
      </form>
    </div>
  );
}
