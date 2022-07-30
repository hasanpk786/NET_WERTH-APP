const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("./Model/PostModel");
const Post = mongoose.model("Post");

router.post("/create", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json("Body fields cannot be empty.");
  }
  try {
    const newPost = new Post({
      title: req.body.title,
      text: req.body.text,
      user: req.body.user,
    });

    const post = await newPost.save();
    if (post) {
      return res.status(201).json({
        mesage: "Post Created Successfully",
        post,
      });
    } else {
      return res.status(400).json("Post cannot be created!");
    }
  } catch (err) {
    return next(err);
  }
});
router.get("/all", async (req, res) => {
  const postCount = 6;
  const page = Number(req.query.pageNumber) || 1;
  let count = await Post.countDocuments({});
  if (req.query.pageNumber) {
    let posts;

    posts = await Post.find({})
      .populate("user")
      .populate("comments.user")
      .sort({ date: -1 })
      .limit(postCount)
      .skip(postCount * (page - 1));

    if (posts) {
      if (posts.length > 0) {
        res.status(200).json({
          currentPage: page,
          lastPage: Math.ceil(count / postCount),
          postCount: posts.length,
          posts,
        });
      } else {
        return res.status(200).json({ message: "No more posts" });
      }
    } else {
      res.status(404);
      throw new Error("Posts Cannot be fetched");
    }
  } else {
    let posts;

    posts = await Post.find({})
      .populate("user")
      .populate("comments.user")
      .sort({ date: -1 });

    if (posts) {
      res.status(200).json({
        posts,
      });
    } else {
      return res.status(200).json({ message: "No more posts" });
    }
  }
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user");

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

router.post("/:id/update", async (req, res, next) => {
  try {
    const update = req.body;
    const postId = req.params.id;
    await Post.findByIdAndUpdate(postId, update, {
      useFindAndModify: false,
    });
    const post = await Post.findById(postId);
    if (post) {
      res.status(200).json({
        data: post,
        message: "Post has been updated",
      });
    } else {
      res.status(400).json({
        message: "Post Cannnot be updated",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/delete", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(401).json({ msg: "Post Not Found" });
  }
  await post.remove();
  return res.json({ msg: "Post removed" });
});

router.post("/like/:id/update/:userId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.likes.unshift({ user: req.params.userId });

    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
router.post("/unlike/:id/update/:userId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if post already being liked by user
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.params.userId);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/comment/:id/:userId", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json("Body fields cannot be empty.");
  }
  try {
    console.log("checking", req.params);
    const post = await Post.findById(req.params.id);

    // console.log(user.firstName);
    if (post) {
      const newComment = {
        text: req.body.text,
        user: req.params.userId,
      };
      console.log(newComment);

      post.comments.unshift(newComment);
      await post.save();
      const newPost = await Post.findById(req.params.id).populate(
        "comments.user"
      );
      res.status(200).json(newPost.comments);
    } else {
      return res.status(400).json({ message: "Post Not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.post("/comment/:id/:comment_id/delete/:userId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure if comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // get remove Index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.params.userId);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
