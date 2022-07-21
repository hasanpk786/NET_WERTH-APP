const bodyParser = require("body-parser");
const express = require("express");
const connectDB = require("./Db.js");
// const dotenv = require("dotenv");
// dotenv.config();
const mongoose = require("mongoose");

connectDB();
const app = express();

app.use(express.json());
const port = 4500;
// let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

const cors = require("cors");
app.use(cors());

const UserRoutes = require("./UserRoutes.js");
const asset = require("./asset.js");
const liability = require("./liabilties.js");
const pfs = require("./PFS_Routes.js");
const mediaRoutes = require("./MediaRoutes");

app.use("/UserRoutes", UserRoutes);
app.use("/assetRoutes", asset);
app.use("/liabilityRoutes", liability);
app.use("/pfsRoutes", pfs);
app.use("/mediaRoutes", mediaRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// var server =
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
