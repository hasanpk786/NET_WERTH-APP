const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/PFS_Model");
const PFS = mongoose.model("PFS");

router.post("/addPfs", async (req, res) => {
  const { _id, user } = req.body;
  const pfsExist = await PFS.findOne({ user });
  if (pfsExist) {
    return res.status(400).json({
      header: {
        message: "User have already completed PFS",
        code: 1,
      },
    });
  }

  const newPFS = new PFS({
    questions: req.body.questions,
    user: req.body.user,
  });

  if (newPFS) {
    await newPFS
      .save()
      .then(() => {
        console.log("Question added");
        res.status(200).json({
          header: {
            message: "Question Created",
            code: 0,
          },
          data: {
            newPFS,
          },
        });
      })
      .catch((err) =>
        res.status(400).json({
          header: {
            message: "Question cannot be saved",
            err,
            code: 1,
          },
        })
      );
  } else {
    return res.status(400).json({
      header: {
        message: "Question is invalid",
        code: 1,
      },
    });
  }
});

router.get("/allPfs", async (req, res) => {
  try {
    const pfsList = await PFS.find({});

    if (pfsList)
      return res.status(200).json({
        header: { message: "PFS List Retrieved", code: 0 },
        data: pfsList,
      });
    else
      return res.status(400).json({
        header: { message: "PFS not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "PFS not found", code: 1 },
      data: pfsList,
      error,
    });
  }
});

router.get("/getPfsByUser/:id", async (req, res) => {
  const { id } = req.params;
  const pfsExist = await PFS.find({ user: id });

  if (pfsExist) {
    res.status(200).json({
      header: {
        message: "Question Created",
        code: 0,
      },
      data: {
        pfs: pfsExist,
      },
    });
  } else {
    return res.status(400).json({
      header: {
        message: "PFS is not found",
        code: 1,
      },
    });
  }
});

module.exports = router;
