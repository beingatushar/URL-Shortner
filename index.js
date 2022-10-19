const express = require("express");
const { get } = require("http");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;
const ShortURL = require("./models/ShortURL");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/url-shortner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((e) => {
    console.log("DATABASE ERROR");
    console.log(e);
  });

app.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;
  const obj = await ShortURL.find({ shortURL });
  if (obj.length == 0) {
    res.render("error", { shortURL });
  } else {
    obj[0].clicks += 1;
    await obj[0].save();
    res.redirect(obj[0].url);
  }
});
app.get("/", async (req, res) => {
  const allURL = await ShortURL.find({});
  res.render("home", { allURL });
});
app.post("/", async (req, res) => {
  const { url } = req.body;
  const { shortURL } = req.body;
  const findPrevious = await ShortURL.find({ shortURL });
  if (findPrevious == 0) {
    const newUrl = new ShortURL({ url, shortURL, clicks: 0 });
    await newUrl.save();
    res.redirect("/");
  } else {
    res.send(`${shortURL} already exists`);
  }
});
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
