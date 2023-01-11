const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl.js");
const PORT = process.env.PORT || 3000;
const methodOverride = require("method-override");
mongoose
  .connect(
    "mongodb+srv://vercel-admin-user:asN1UpR73MRMesEl@shrinkify.d6lyhwq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((e) => {
    console.log("DATABASE ERROR");
    console.log(e);
  });

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/", async (req, res) => {
  if (req.body.short) {
    await ShortUrl.create({
      full: req.body.fullUrl,
      short: req.body.short,
      createdAt: new Date(),
      lastVisitedAt: new Date(),
    });
  } else {
    await ShortUrl.create({
      full: req.body.fullUrl,
      createdAt: new Date(),
      lastVisitedAt: new Date(),
    });
  }
  res.redirect("/");
});
app.delete("/:shortUrl", async (req, res) => {
  await ShortUrl.findOneAndDelete({ short: req.params.shortUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.lastVisitedAt = new Date();
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(PORT);
