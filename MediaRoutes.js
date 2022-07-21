const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/MediaModel");

const media = mongoose.model("media");

router.get("/test", (req, res) => {
  return res.status(200).json({
    message: "Personal Finance System (PFS) route connected",
  });
});

router.post("/addVideo", async (req, res) => {
  const { link, title, user } = req.body;

  const newMedia = new media({
    link,
    title,
    user,
  });

  if (newMedia) {
    await newMedia
      .save()
      .then(() => {
        res.status(200).json({
          header: {
            message: "Media Created",
            code: 0,
          },
          data: {
            newMedia,
          },
        });
      })
      .catch((err) =>
        res.status(400).json({
          header: {
            message: "Media cannot be saved",
            err,
            code: 1,
          },
        })
      );
  } else {
    return res.status(400).json({
      header: {
        message: "Media is invalid",
        code: 1,
      },
    });
  }
});

router.get("/allVideos", async (req, res) => {
  try {
    const mediaList = await media.find({});

    if (mediaList)
      return res.status(200).json({
        header: { message: "Media List Retrieved", code: 0 },
        data: mediaList,
      });
    else
      return res.status(400).json({
        header: { message: "mediaList not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "mediaList not found", code: 1 },
      data: mediaList,
      error,
    });
  }
});

router.put("/updateVideo/:id", async (req, res) => {
  try {
    const foundMedia = await media.findById(req.params.id);

    if (foundMedia) {
      foundMedia.title = req.body.title || foundUser.title;
      foundMedia.link = req.body.link || foundUser.link;
      foundMedia.user = req.body.user || foundUser.user;
    } else {
      return res.status(404).json({
        header: { message: "Media not found", code: 1 },
      });
    }

    const updatedMedia = await foundMedia.save();
    if (updatedMedia) {
      return res.status(200).json({
        header: { message: "Media updated successfully", code: 0 },
        data: updatedMedia,
      });
    } else {
      return res.status(400).json({
        header: { message: "Media cannot be updated", code: 1 },
      });
    }
  } catch (err) {
    return res.status(401).json({
      header: { message: "Error in updating User", err, code: 1 },
    });
  }
});

router.delete("/deleteVideo/:id", async (req, res) => {
  await media
    .findOneAndDelete({ _id: req.params.id })
    .then((user) =>
      res.status(200).json({
        header: { message: "Media Deleted", code: 0 },
        data: user,
      })
    )
    .catch((err) =>
      res.status(400).json({
        header: {
          message: "Unable to find and delete video with given id",
          err,
          code: 1,
        },
      })
    );
});

module.exports = router;
