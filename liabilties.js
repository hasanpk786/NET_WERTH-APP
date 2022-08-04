const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/LiabilitiesModel");
const Liability = mongoose.model("Liability");
const User = mongoose.model("users");
// code 0 means ok
// code 1 means error

router.get("/test", (req, res) => {
  return res.status(200).json({
    message: "asset route connected",
  });
});

router.get(`/getLiabilityByUser/:userId`, async (req, res) => {
  const { userId } = req.params;
  const foundLiability = await Liability.findOne({ user: userId });

  if (foundLiability) {
    res.status(200).json({
      header: {
        message: "Asset Created",
        code: 0,
      },
      data: {
        foundLiability,
      },
    });
  } else {
    return res.status(400).json({
      header: {
        message: "Liability is not found",
        code: 1,
      },
    });
  }
});

const getLiabilityAccordingToMonth = (
  userLiabilities,
  total,
  monthNumber,
  monthName,
  year
) => {
  const temp = 0;
  while (temp !== 12) {}

  return userLiabilities;
};

router.post("/addLiability", async (req, res) => {
  const { user, liabilities, total } = req.body;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date();
  const monthNumber = d.getMonth();
  const year = d.getFullYear();
  const foundLiability = await Liability.findOne({ user });
  const foundUser = await User.findById({ _id: user });

  console.log("first", foundUser);
  if (foundUser) {
    console.log(foundUser.liabilities);
    if (!foundLiability) {
      foundUser.liabilities[0] = {
        month: `${months[monthNumber]} ${year}`,
        total,
      };
      var m = monthNumber;
      var y = year;
      for (let i = 1; i < 12; i++) {
        m = m + 1;
        if (m === 12) {
          m = 0;
          y = year + 1;
        }
        foundUser.liabilities[i] = {
          month: `${months[m]} ${y}`,
          total: 0,
        };
      }
      await foundUser.save();
    } else {
      for (let i = 0; i < 12; i++) {
        if (
          foundUser.liabilities[i].month === `${months[monthNumber]} ${year}`
        ) {
          foundUser.liabilities[i] = {
            month: `${months[monthNumber]} ${year}`,
            total,
          };
        }
      }
      await foundUser.save();
    }
  }
  if (foundLiability) {
    await Liability.deleteOne({ user });
    const newCategory = new Liability({
      user,
      liabilities,
    });

    if (newCategory) {
      await newCategory
        .save()
        .then(() => {
          res.status(200).json({
            header: {
              message: "Category Created",
              code: 0,
            },
            data: {
              newCategory,
            },
          });
        })
        .catch((err) =>
          res.status(400).json({
            header: {
              message: "Category cannot be saved",
              err,
              code: 1,
            },
          })
        );
    } else {
      return res.status(400).json({
        header: {
          message: "Category is invalid",
          code: 1,
        },
      });
    }
  } else {
    const newCategory = new Liability({
      user,
      liabilities,
    });

    if (newCategory) {
      await newCategory
        .save()
        .then(() => {
          res.status(200).json({
            header: {
              message: "Category Created",
              code: 0,
            },
            data: {
              newCategory,
            },
          });
        })
        .catch((err) =>
          res.status(400).json({
            header: {
              message: "Category cannot be saved",
              err,
              code: 1,
            },
          })
        );
    } else {
      return res.status(400).json({
        header: {
          message: "Category is invalid",
          code: 1,
        },
      });
    }
  }
});

router.delete("/deleteLiability/:id", async (req, res) => {
  await Liability.findOneAndDelete({ _id: req.params.id })
    .then((asset) =>
      res.status(200).json({
        header: { message: "Asset Deleted", code: 0 },
        data: asset,
      })
    )
    .catch((err) =>
      res.status(400).json({
        header: {
          message: "Unable to find and delete Asset with given id",
          err,
          code: 1,
        },
      })
    );
});

router.get("/liabilityCategory/:id", async (req, res) => {
  try {
    const catExist = await Liability.findById(req.params.id);

    if (catExist)
      return res.status(200).json({
        header: { message: "Liability Retrieved", code: 0 },
        data: catExist,
      });
    else
      return res.status(400).json({
        header: { message: "Liability not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "Liability not found", code: 1 },
      data: catExist,
      error,
    });
  }
});

router.get("/allLiability", async (req, res) => {
  try {
    const catList = await Liability.find({});

    if (catList)
      return res.status(200).json({
        header: { message: "Liability List Retrieved", code: 0 },
        data: catList,
      });
    else
      return res.status(400).json({
        header: { message: "Liability List not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "Liability List not found", code: 1 },
      data: catList,
      error,
    });
  }
});

router.put("/updateLiability", async (req, res) => {
  const { _id } = req.body;
  const catName = req.body.categoryName;
  const catExist = await Liability.findById(_id);
  // console.log(catName, 'checking Update', catExist)

  if (!catExist) {
    return res.status(400).json({
      header: {
        message: "Category doesn't exist with this Name",
        code: 1,
      },
    });
  } else {
    if (req.body.categoryName) {
      const cat2 = await Asset.findOne({ categoryName: catName });
      console.log(catName, "wut", cat2);
      if (!cat2 || cat2.categoryName === catExist.categoryName) {
        // console.log(' updating category Name', cat2 ? cat2.categoryName : 'no cat with this name')
        catExist.categoryName = req.body.categoryName || catExist.categoryName;
      }
      // else console.log(catExist.categoryName, ' names dont match or no cat found with name', cat2.categoryName)
      else {
        // console.log(' here')
        return res.status(400).json({
          header: {
            message:
              "Cannot change Category Name a category already exists with this Name",
            code: 1,
          },
        });
      }
    }

    catExist.fields = req.body.fields || catExist.fields;

    try {
      const updaedAsset = await catExist.save();
      console.log("updated Asset is saved");

      res.status(200).json({
        header: {
          message: "Category updated successfully",
          code: 0,
          updaedAsset,
        },
      });
    } catch (error) {
      res.status(400).json({
        header: {
          message: "Category cannot be saved",
          error,
          code: 1,
        },
      });
    }
  }
});

module.exports = router;
