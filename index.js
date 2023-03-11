const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios").default;
const cheerio = require("cheerio");

const app = express();

const sources = [
  {
    name: "pff",
    address: "https://www.pff.com/fantasy",
    base: "https://www.pff.com",
  },
  {
    name: "cbs",
    address: "https://www.cbssports.com/fantasy/football/",
    base: "https://www.cbssports.com",
  },
  {
    name: "espn",
    address: "https://www.espn.com/fantasy/football/",
    base: "https://www.espn.com",
  },
  {
    name: "yahoo",
    address: "https://football.fantasysports.yahoo.com/",
    base: "",
  },
];

const articles = [];

const titlesToOmit = [
  "Fantasy Football",
  "Fantasy Football Today",
  "Fantasy Football Home",
  "Yahoo Sports Fantasy Football",
  "Fantasy Football Live",
  "College Fantasy Football",
  "Fantasy Football 101",
];

// scrape sources for articles related to fantasy football and add to array
sources.forEach((source) => {
  axios
    .get(source.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $("a:contains('fantasy football')", html).each(function () {
        // explanation of regular expression: /\s+/g
        // \s: matches any whitespace symbol: spaces, tabs, and line breaks
        // +: match one or more of the preceding tokens (referencing \s)
        // g: the g at the end indicates iterative searching throughout the full string
        const title = $(this).text().replace(/\s+/g, " ").trim();
        const url = $(this).attr("href");

        articles.push({
          title,
          url: source.base + url,
          source: source.name,
        });
      });

      $("a:contains('Fantasy Football')", html).each(function () {
        const title = $(this).text().replace(/\s+/g, " ").trim();
        const url = $(this).attr("href");
        const omitArr = titlesToOmit.map((t) => title !== t);

        if (!omitArr.includes(false)) {
          articles.push({
            title,
            url: source.base + url,
            source: source.name,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.json("Welcome the best API for all things NFL fantasy football.");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:sourceId", (req, res) => {
  const sourceId = req.params.sourceId;
  const sourceAddress = sources.filter((source) => source.name === sourceId)[0]
    .address;
  const sourceBase = sources.filter((source) => source.name === sourceId)[0]
    .base;

  axios
    .get(sourceAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $("a:contains('fantasy football')", html).each(function () {
        const title = $(this).text().replace(/\s+/g, " ").trim();
        const url = $(this).attr("href");

        specificArticles.push({
          title,
          url: sourceBase + url,
          source: sourceId,
        });
      });

      $("a:contains('Fantasy Football')", html).each(function () {
        const title = $(this).text().replace(/\s+/g, " ").trim();
        const url = $(this).attr("href");
        const omitArr = titlesToOmit.map((t) => title !== t);

        if (!omitArr.includes(false)) {
          specificArticles.push({
            title,
            url: sourceBase + url,
            source: sourceId,
          });
        }
      });

      res.json(specificArticles);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
