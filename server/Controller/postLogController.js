import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    const { content } = req.body;
    const userId = req.user.id;
    if (!userId || !content) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing userId or content" });
    }
    const newPost = new Post({
      user: userId,
      content,
    });

    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost.id).populate(
      "user",
      "name email"
    );
    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost.id, postLog: savedPost.id },
    });

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
