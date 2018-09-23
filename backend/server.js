let { update, init, getStatus } = require("./gapi/gapi");
let { getDataz } = require("./hsb");

let { getWeight } = require("../weight/app");

const express = require("express");
const app = express();
const urlParse = baseUrl => req => baseUrl + require("url").parse(req.url).path;
const headerDecorator = jira => (proxyReqOpts, srcReq) => {
  proxyReqOpts.headers = srcReq.headers;
  proxyReqOpts.headers["authorization"] =
    "Basic " +
    (jira
      ? "amlyYXdhbGxib2FyZF91c2VyOkRyaWZ0ZW4xMjM0"
      : "d2ViX2Rhc2g6I1RhY29zMTIz");
  return proxyReqOpts;
};

app.use(express.static("../dist"));
let port = 8092;
app.listen(port);
console.log(`Startad på port: ${port}`);

app.get("/api/cash", async function(req, res) {
  await init();
  res.send(await getStatus());
});

app.get("/api/cash/update", async function(req, res) {
  let values = getDataz();
  await init();
  res.send(await update(await values));
});

app.get("/api/cash/getDataz", async function(req, res) {
  let values = getDataz();
  res.send(await values);
});
app.get("/api/weight", async function(req, res) {
  let weights = getWeight();
  res.send(await weights);
});
