const express = require("express");
const connectDB = require("./Db.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const UserRoutes = require("./UserRoutes.js");
const asset = require("./asset.js");
const liability = require("./liabilties.js");
const pfs = require("./PFS_Routes.js");
const mediaRoutes = require("./MediaRoutes");
const PostRoutes = require("./PostRoutes");

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/UserRoutes", UserRoutes);
app.use("/assetRoutes", asset);
app.use("/liabilityRoutes", liability);
app.use("/pfsRoutes", pfs);
app.use("/mediaRoutes", mediaRoutes);
app.use("/postRoutes", PostRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 4500;

// var server =
app.listen(PORT, () => {
  console.log(`Example app listening at ${PORT}`);
});
