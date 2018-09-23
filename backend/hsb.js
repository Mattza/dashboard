const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const SEL = {
  EKOLINK: "a[href*=economic_overview]",
  TABLE: "body > table:nth-child(11) > tbody > tr:nth-child(2)"
};

async function login(page) {
  await page.goto(
    "https://secure.handelsbanken.se/bb/glss/servlet/ssco_auth2?appAction=doAuthentication&path=ssse&entryId=privmbidwebse&language=sv&country=SE"
  );

  await page.type("#pnr_input", "198803052714");
  await page.click("#pnr_submit");
  console.log("Logga in");
  await page.waitForSelector(SEL.EKOLINK);
  console.log("Inloggad!");
}

async function getDatazLoggedinPage(page) {
  await page.goto(
    "https://secure.handelsbanken.se/bb/seio/servlet/ipov?appAction=ShowEconomicOverview&appName=ipov&random=05300918636318221&pilot=true"
  );

  await page.waitForSelector(SEL.TABLE);
  let $table = await page.evaluate(() => {
    let element = document.querySelector(
      "body > table:nth-child(11) > tbody > tr:nth-child(2)"
    );
    return element ? element.innerHTML : null;
  });

  await page.goto(
    "https://secure.handelsbanken.se/se/private/sv/#!/accounts_and_cards"
  );
  await page.waitForSelector(
    '[data-spif-id="shb-priv-accounts-and-cards"] tr.shb-js-grid-row'
  );

  let $table2 = await page.evaluate(() => {
    let elements = document.querySelectorAll(
      '[data-spif-id="shb-priv-accounts-and-cards"] tr.shb-js-grid-row'
    );
    console.log(elements);
  });
  const $ = cheerio.load($table);

  let dataz = $("[id^='collapsed'] .groupHeading")
    .map((index, item) => {
      const $tableRow = cheerio.load(item);
      return {
        type: $tableRow("a")
          .text()
          .trim(),
        amount: parseInt(
          $tableRow(".whiteRow")
            .text()
            .trim()
            .replace("*", "")
            .replace(/ /g, "")
            .replace(",", ".")
        )
      };
    })
    .get();
  // let pluses = dataz.filter(item => item.type !== 'Lån').reduce((acc, item) => acc + item.amount, 0);
  let getAmountFromDataWithType = data => type =>
    data.find(item => item.type === type).amount;
  const getAmountFromType = getAmountFromDataWithType(dataz);
  let values = [
    new Date().toISOString().split("T")[0],
    getAmountFromType("Konton"),
    getAmountFromType("Fonder"),
    getAmountFromType("Investeringsspar"),
    getAmountFromType("Pension"),
    getAmountFromType("Lån")
  ];
  return values;
}

async function getDataz() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await login(page);
    const values = await getDatazLoggedinPage(page);
    browser.close();
    return values;
  } catch (e) {
    console.log("there was an error");
    console.log(e);
  }
}
async function getInfDataz() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await login(page);
    let lastValues;
    let keys = ["Konton", "Fonder", "ISK", "Pension", "Lån"];
    setInterval(async () => {
      //console.log(page)
      const values = await getDatazLoggedinPage(page);
      console.log(new Date().toTimeString().split(" ")[0]);
      if (!lastValues) {
        lastValues = values;
        console.log("init", lastValues);
      }
      const diffs = values
        .map((newVal, index) => ({ index, val: newVal }))
        .filter(obj => lastValues[obj.index] !== obj.val);
      diffs.map(({ index, val }) => {
        console.log(
          `${keys[index - 1]}\t Nytt: ${val}, innan: ${lastValues[index]}`
        );
      });
      lastValues = values;
    }, 2000);
    //browser.close();
    //return values
  } catch (e) {
    //browser.close();
    console.log("there was an error");
    console.log(e);
  }
}
module.exports = {
  getDataz,
  getInfDataz
};
