import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { createPost } from "../Controller/postLogController.js";
import { model } from "mongoose";
const router = express.Router();
router.use(protect);
//get all posts route(for feed page)
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user");
    res.status(200).json({ status: "success", data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//create a post route
router.post("/", createPost);
//get all posts from a user
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get a single post from a user
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    //extract post id from url params
    const postId = req.params.id;
    //only find/delete the post if authenticated user has ownership
    const post = await Post.findOneAndDelete({
      _id: postId,
      user: req.user._id,
    });
    //no post, return no post found
    if (!post) return res.status(400).json({ message: "Post not found" });
    //remove post from users post array(update)
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: postId, postLog: postId },
    });
    //success response in terminal
    res
      .status(200)
      .json({ message: "Post deleted successfully", deletedPost: post });
  } catch (err) {
    //unsuccessful response in terminal
    res.status(500).json({ message: err.message });
  }
});
export default router;
