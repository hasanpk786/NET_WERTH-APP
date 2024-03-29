const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("./Middleware/Auth.js");

require("./Model/AssetModel");
const Asset = mongoose.model("Asset");
const User = mongoose.model("users");
// code 0 means ok
// code 1 means error

router.get("/test", (req, res) => {
  return res.status(200).json({
    message: "asset route connected",
  });
});

router.get(`/getAssetByUser/:userId`, async (req, res) => {
  const { userId } = req.params;
  const foundAsset = await Asset.findOne({ user: userId });

  if (foundAsset) {
    res.status(200).json({
      header: {
        message: "Asset Created",
        code: 0,
      },
      data: {
        foundAsset,
      },
    });
  } else {
    return res.status(400).json({
      header: {
        message: "Asset is invalid",
        code: 1,
      },
    });
  }
});

router.post("/addAsset", async (req, res) => {
  const { user, assets, total } = req.body;
  const foundAsset = await Asset.findOne({ user });
  console.log(foundAsset);
  const foundUser = await User.findById({ _id: user });
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
  if (foundUser) {
    if (!foundAsset) {
      var m = monthNumber - 1;
      var y = year;

      for (let i = 0; i < 12; i++) {
        if (m === 12) {
          m = 0;
          y = year + 1;
        }
        foundUser.assets[i] = {
          month: `${months[m]} ${y}`,
          total: 0,
        };
        m = m + 1;
      }
      foundUser.assets[1] = {
        month: `${months[monthNumber]} ${year}`,
        total,
      };
      foundUser.save();
    } else {
      for (let i = 0; i < 12; i++) {
        if (foundUser.assets[i].month === `${months[monthNumber]} ${year}`) {
          foundUser.assets[i] = {
            month: `${months[monthNumber]} ${year}`,
            total,
          };
        }
      }
      await foundUser.save();
    }
  }
  if (foundAsset) {
    await Asset.deleteOne({ user });
    const newCategory = new Asset({
      user,
      assets,
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
    const newCategory = new Asset({
      user,
      assets,
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

router.delete("/deleteAsset/:id", async (req, res) => {
  await Asset.findOneAndDelete({ _id: req.params.id })
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

router.get("/assetCategory/:id", async (req, res) => {
  try {
    const catExist = await Asset.findById(req.params.id);

    if (catExist)
      return res.status(200).json({
        header: { message: "Asset Retrieved", code: 0 },
        data: catExist,
      });
    else
      return res.status(400).json({
        header: { message: "Asset not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "Asset not found", code: 1 },
      data: catExist,
      error,
    });
  }
});

router.get("/allAsset", async (req, res) => {
  try {
    const catList = await Asset.find({});

    if (catList)
      return res.status(200).json({
        header: { message: "Asset List Retrieved", code: 0 },
        data: catList,
      });
    else
      return res.status(400).json({
        header: { message: "Asset List not found", code: 1 },
      });
  } catch (error) {
    return res.status(400).json({
      header: { message: "Asset List not found", code: 1 },
      data: catList,
      error,
    });
  }
});

router.put("/updateAsset", async (req, res) => {
  const { _id } = req.body;
  const catName = req.body.categoryName;
  const catExist = await Asset.findById(_id);
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
