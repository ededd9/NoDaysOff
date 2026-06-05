import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    const newPost = new Post({
      user: userId,
      content,
    });

    const savedPost = await newPost.save();
    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost.id },
    });
    const responsePost = {
      ...savedPost.toObject(),
      user: {
        _id: req.user._id,
        name: req.user.name,
      },
    };
    res.status(201).json(responsePost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
