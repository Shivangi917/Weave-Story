import React, { useState } from "react";
import { BookOpen, Film, Music, Sparkles, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const genres = [
  { name: "Fantasy", icon: <Sparkles className="w-8 h-8 text-purple-500" /> },
  { name: "Drama", icon: <BookOpen className="w-8 h-8 text-blue-500" /> },
  { name: "Romance", icon: <Film className="w-8 h-8 text-pink-500" /> },
  { name: "Mystery", icon: <Music className="w-8 h-8 text-green-500" /> },
  { name: "Sci-Fi", icon: <Sparkles className="w-8 h-8 text-indigo-500" /> },
  { name: "Horror", icon: <Film className="w-8 h-8 text-red-500" /> },
];

const Genres = () => {
  const [search, setSearch] = useState("");

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(search.toLowerCase())
  );

  const highlightMatch = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(
      regex,
      '<span class="text-pink-500 font-bold">$1</span>'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center py-10">
      <h2 className="text-4xl font-extrabold text-green-700 mb-4">Genres</h2>
      <p className="text-lg text-gray-600 mb-8">✨ Explore different story vibes ✨</p>

      {/* Search Bar */}
      <div className="relative flex items-center bg-white shadow-md rounded-full px-4 py-2 mb-10 w-80">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search genres..."
          className="flex-1 outline-none text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Genre Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <AnimatePresence>
          {filteredGenres.map((genre, index) => (
            <motion.div
              key={genre.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center transition-all hover:shadow-2xl cursor-pointer"
            >
              {genre.icon}
              <h3
                className="mt-4 text-xl font-semibold text-green-800"
                dangerouslySetInnerHTML={{ __html: highlightMatch(genre.name) }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredGenres.length === 0 && (
        <motion.p
          className="mt-8 text-gray-500 italic text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No genres found 😢 Try another vibe!
        </motion.p>
      )}
    </div>
  );
};

export default Genres;
