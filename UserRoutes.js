const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("./Model/UserModel.js");
const User = mongoose.model("users");
const { protect } = require("./Middleware/Auth.js");
// const bodyParser = require("body-parser");

// Creates a user / Sign Up API
router.post("/addUser", async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({
      header: {
        message: "User Already exist with this email",
        code: 1,
      },
    });
  }

  const TestUser = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,

    // password: req.body.password,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  // const token = jwt.sign(
  //     { id: TestUser.id },
  //     'process.env.JWT_Secret',
  //     {
  //         expiresIn: '1h',
  //     }
  // );

  if (!TestUser) {
    res.status(400).json({
      header: {
        message: "User is invalid",
        err,
        code: 1,
      },
    });
  } else {
    let error = false;
    await TestUser.save()
      .then(console.log("works?"))
      .catch((err) => {
        error = true;
        console.log(err);
        res.status(400).json({
          header: {
            message: "User cannot be saved",
            code: 1,
            err,
          },
        });
      });

    if (error) {
      return;
    }

    res.status(200).json({
      header: {
        message: "User Created successfully",
        code: 0,
      },
      data: {
        id: TestUser.id,
        name: TestUser.name,
        email: TestUser.email,
        role: TestUser.role,
        date: TestUser.date,
      },
    });
  }
});

// Get user by Id
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId)
    .select("-password")
    .then(res.status(200))
    .catch((err) =>
      res.status(400).json({
        header: { message: "Unable to find user with given id", err, code: 1 },
      })
    );

  //do not .json data inside 'then()' as that exits out of the request. (Although that should work as well)
  if (user) {
    return res.status(200).json({
      header: { message: "User retrieved successfully", code: 0 },
      data: user,
    });
  } else {
    return res.status(400).json({
      header: { message: "Error in retrieiving User", code: 1 },
      data: user,
    });
  }
});

// Get all users
router.get(
  "/allUsers",
  // + ":lim/:pg"
  // protect,
  // checkAdmin,
  async (req, res) => {
    // var numslimit = parseInt(req.params.lim);
    // var page = parseInt(req.params.pg) - 1;
    const userList = await User.find({}).select("-password");
    // .limit(numslimit)
    // .skip(numslimit * page);
    const count = await User.countDocuments();

    if (userList) {
      return res.status(200).json({
        header: { message: "User list retrieved successfully", code: 0 },
        data: {
          Users: { count: count, listlength: userList.length, userList },
        },
      });
    } else {
      return res.status(400).json({
        header: { message: "User list cannot be retrieved", code: 1 },
        data: userList,
      });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json({
      header: { message: "Body fields cannot be empty.", code: 1 },
    });
  }

  let credentials = new User({
    email: req.body.email,
    // password: req.body.password,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  const user = await User.findOne({ email: credentials.email });

  if (!user) {
    return res.status(500).json({
      header: { message: "User doesn't exist.", code: 1 },
    });
  } else {
    if (
      user &&
      (bcrypt.compareSync(req.body.password, user.password) ||
        (user && req.body.password === user.password))
    ) {
      // if (user.isVerified === false) {
      //     return res.status(401).send({
      //         header: { message: "user not verified", code: 1 },
      //     });
      // }
      // if (user.isDeleted === true) {
      //     return res.status(401).send({
      //         header: { message: "Account has been Deleted", code: 1 },
      //     });
      // }

      console.log("here in paswd check");
      return res.status(200).json({
        header: { message: "User Logged In successfully!", code: 0 },
        data: {
          name: user.name,
          email: user.email,
          _id: user.id,
          token: jwt.sign({ id: user.id }, "process.env.JWT_Secret", {
            expiresIn: "24h",
          }),
          goalNetWorth: user.goalNetWorth,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({
        header: { message: "Please enter correct credentials", code: 1 },
      });
    }
  }
});

// update
router.put("/updateUser/:id", async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);

    if (foundUser) {
      foundUser.name = req.body.name || foundUser.name;
      foundUser.role = req.body.role || foundUser.role;
      foundUser.goalNetWorth = req.body.goalNetWorth || foundUser.goalNetWorth;
      // foundUser.password = req.body.password || foundUser.password;
      if (req.body.password) {
        foundUser.password = bcrypt.hashSync(req.body.password, 10);
      }
    } else {
      return res.status(404).json({
        header: { message: "User not found", code: 1 },
      });
    }

    const updatedUser = await foundUser.save();
    if (updatedUser) {
      return res.status(200).json({
        header: { message: "User updated successfully", code: 0 },
        data: updatedUser,
      });
    } else {
      return res.status(400).json({
        header: { message: "User cannot be updated", code: 1 },
      });
    }
  } catch (err) {
    return res.status(401).json({
      header: { message: "Error in updating User", err, code: 1 },
    });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id })
    .select("-password")
    .then((user) =>
      res.status(200).json({
        header: { message: "User Deleted", code: 0 },
        data: user,
      })
    )
    .catch((err) =>
      res.status(400).json({
        header: {
          message: "Unable to find and delete user with given id",
          err,
          code: 1,
        },
      })
    );
});

module.exports = router;
