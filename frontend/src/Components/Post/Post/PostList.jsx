import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { loadPersonalStories } from "../../../Utils/api/story.api";

const PersonalStories = ({ userId }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await loadPersonalStories(user.id);
        
        console.log(res);
        setStories(res.stories);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {stories.map((story) => (
        <div key={story._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>{story.content}</p>
          <p>By: {story.user.name}</p>
          <p> HELLLO</p>

          {/* Appended Contents */}
          {story.appendedContents.length > 0 && (
            <div style={{ marginLeft: "20px", borderLeft: "2px dashed #999", paddingLeft: "10px" }}>
              <h4>Appended Content:</h4>
              {story.appendedContents.map((append) => (
                <div key={append._id} style={{ backgroundColor: append.color, margin: "5px 0", padding: "5px" }}>
                  <p>{append.content}</p>
                  <p>By: {append.user.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comments */}
          {story.comments.length > 0 && (
            <div>
              <h4>Comments:</h4>
              {story.comments.map((c) => (
                <p key={c._id}><strong>{c.name}:</strong> {c.comment}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PersonalStories;
