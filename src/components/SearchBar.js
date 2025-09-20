"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleReset = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <input
        type="text"
        placeholder="Cari berdasarkan nama..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:flex-1 h-12 px-3  rounded-lg shadow focus:outline font-sans"
      />

      <div className="flex gap-3 sm:gap-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-5 h-12  text-black rounded-lg shadow hover:bg-gray-100 transition font-sans"
        >
          Search
        </button>

        {query && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 h-12  text-black rounded-lg shadow hover:bg-gray-100 transition"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
