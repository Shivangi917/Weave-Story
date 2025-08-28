import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getActivities } from '../../Utils/api';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadActivities();
  }, [user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities(user.id);
      const data = Array.isArray(response.data) ? response.data : [];
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities: ", err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 italic mt-4">
        Loading activities...
      </div>
    );
  }

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <div className="text-center text-gray-500 italic mt-4">
        No activities yet... Write your first story ✨
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-4">
      <AnimatePresence>
        {activities.map((activity, index) => {
          let content = null;

          if (activity.type === "like" && activity.post.authorId === user.id) {
            content = (
              <span>
                <b>{activity.actor.name}</b> liked your story "{activity.post.title}"
              </span>
            );
          }

          if (
            activity.type === "like" &&
            activity.post.authorId !== user.id &&
            (activity.userLiked || activity.userCommented)
          ) {
            content = (
              <span>
                <b>{activity.actor.name}</b> liked a story you interacted with "{activity.post.title}"
              </span>
            );
          }

          if (
            activity.type === "comment" &&
            activity.post.authorId !== user.id &&
            (activity.userLiked || activity.userCommented)
          ) {
            content = (
              <span>
                <b>{activity.actor.name}</b> commented on a story you interacted with "{activity.post.title}"
              </span>
            );
          }

          // 🚀 Only render if content exists
          if (!content) return null;

          return (
            <motion.div
              key={`${activity.type}-${activity.actor.id}-${activity.post.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 mb-2 bg-white rounded shadow"
            >
              {content}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Activity;
