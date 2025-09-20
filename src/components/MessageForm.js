"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    await addDoc(collection(db, "compliments"), {
      name,
      message,
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
