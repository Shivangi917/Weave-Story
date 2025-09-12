import { useEffect, useState } from "react";
import { getFilteredStories } from "../../../Utils/api/story.api";
import ContentCard from "./ContentCard";

const ContentList = ({ filter = "random" }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories(filter);
  }, [filter]);

  const loadStories = async (filterObj) => {
    try {
      const { type, genre, search } = filterObj || {};
      const data = await getFilteredStories(type, genre, search);
      setStories(data.stories || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-600 text-lg">Loading stories...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl text-gray-900">Weaves</h1>
      <div className="w-full mx-auto space-y-6 p-4">
        {stories.map((story) => (
          <ContentCard
            key={story._id}
            story={story}
            reloadStories={() => loadStories(filter)} // ✅ pass reload
          />
        ))}
      </div>
    </>
  );
};

export default ContentList;
