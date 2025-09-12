const { User } = require('../../models/v2/User.model');

const toggleFollow = async (req, res) => {
  const { currentUserId, targetUserId } = req.params;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if(isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: currentUser.following,
      followers: targetUser.followers
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { toggleFollow };