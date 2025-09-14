import { useEffect, useState } from "react";
import { loadPersonalStories, getFilteredStories } from "../../../Utils/api/api";
import ContentCard from "./ContentCard";

const ContentList = ({ personalStories, userId, filter = "random" }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personalStories && userId) {
      loadUserStories(userId);
    } else {
      loadStories(filter);
    }
  }, [filter, personalStories, userId]);

  const loadStories = async (filterObj) => {
    try {
      setLoading(true);
      const { type, genre, search } = filterObj || {};
      const data = await getFilteredStories(type, genre, search);
      setStories(data.stories || []);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStories = async (userId) => {
    try {
      setLoading(true);
      const data = await loadPersonalStories(userId);
      setStories(data.stories || []);
    } catch (err) {
      console.error("Error fetching personal stories:", err);
    } finally {
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
            reloadStories={() =>
              personalStories ? loadUserStories(userId) : loadStories(filter)
            }
          />
        ))}
      </div>
    </>
  );
};

export default ContentList;
