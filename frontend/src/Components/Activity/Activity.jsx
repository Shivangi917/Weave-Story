import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getActivities, markActivitySeen } from '../../Utils/api/api';
import useOpenAccount from '../../Hooks/useOpenAccount';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const openAccount = useOpenAccount();

  useEffect(() => {
    if (user?.id) loadActivities();
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

  const handleClick = async (index, id) => {
    if (!id) return;
    try {
      if (!activities[index].seen) {
        await markActivitySeen(id);
        setActivities((prev) =>
          prev.map((a, i) => (i === index ? { ...a, seen: true } : a))
        );
      }
    } catch (err) {
      console.error("Error marking activity seen:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 italic mt-4">
        Loading activities...
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center text-gray-500 italic mt-4">
        No activities yet... Write your first story ✨
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-4">
      <AnimatePresence>
        {activities.map((activity, index) => (
          <motion.div
            key={activity._id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 mb-2 rounded shadow cursor-pointer ${
              activity.seen ? "bg-white" : "bg-gray-200"
            }`}
            onClick={() => handleClick(index, activity._id)}
          >
            <span>
              <b>
                {activity.actor?._id ? (
                  <span
                    className="hover:cursor-pointer text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAccount(activity.actor._id);
                    }}
                  >
                    {activity.actor?.name}
                  </span>
                ) : (
                  activity.actor?.name || "Someone"
                )}
              </b>{" "}
              {activity.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Activity;
