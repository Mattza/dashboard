const puppeteer = require("puppeteer");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const doit = () => {
  return new Promise(async (res, rej) => {
    let config = readFile("/.credentials/weight.json");
    const browser = await puppeteer.launch({
      headless: false
    });
    config = JSON.parse(await config);
    console.log(config);

    const page = await browser.newPage();
    await page.on("response", async response => {
      if ("https://scalews.withings.com/cgi-bin/measure" === response.url()) {
        let postData = response.request().postData();
        postData = postData.split("&");
        const action = postData[0].split("=")[1];
        const type = postData[2].split("=")[1];
        if (action === "getmeas" && type !== "4") {
          const data = await response.text();
          let obj = JSON.parse(data);
          const mappedObj = obj.body.measuregrps.map(item => ({
            date: new Date(item.date * 1000),
            weight: item.measures[0].value
          }));
          browser.close();
          res(mappedObj);
        }
      }
    });
    await page.goto("https://healthmate.withings.com/16193562/weight/graph", {
      waitUntil: "networkidle2"
    });
    await page.waitFor(1000);
    await sendKeys(page, '[name="email"]', "matknu@kth.se");
    await sendKeys(page, '[name="password"]', config.password);
    await page.type('[name="password"]', String.fromCharCode(13));
  });
};

const sendKeys = async (page, selector, text) => {
  await page.waitFor(selector);
  await page.type(selector, text);
};

module.exports = {
  getWeight: doit
};

doit().then(response => {
  console.log("done", response);
});
