# Fantasy Football API

An API that responds with the latest NFL fantasy football news from several sources, including PFF, CBS, ESPN, and Yahoo Sports.

## Tech Stack

* Axios - Promise based HTTP client for Node.js
* Cheerio - Implementation of core jQuery designed specifically for the server
* Express - Fast, unopinionated, minimalist web framework for Node.js
* Nodemon - Helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected

## Setup
* `npm install` Install dependencies
* `npm run start` Run locally and open in browser at `http://localhost:8000/`

## Endpoints
* `/news` Get all of the news articles from all sources
* `/news/sourceId` Get all the new articles from a specific source

## Example Response
An array of objects containing the article's title, URL, and source.
```
[
  ...
  {
    "title": "Fantasy Football Utilization Report: Latest player trends for Super Bowl 57 DFS and player prop bets",
    "url": "https://www.pff.com/news/fantasy-football-utilization-report-latest-player-trends-for-super-bowl-57-dfs-and-player-prop-bets",
    "source": "pff"
  },
  ...
]
```
