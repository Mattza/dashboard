const puppeteer = require('puppeteer');
const cheerio = require('cheerio')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDataz() {
    try {
        const SEL = {
            EKOLINK: 'a[href*=economic_overview]',
            TABLE: 'body > table:nth-child(11) > tbody > tr:nth-child(2)',
        };
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://secure.handelsbanken.se/bb/glss/servlet/ssco_auth2?appAction=doAuthentication&path=ssse&entryId=privmbidwebse&language=sv&country=SE');
        await page.click('#pnr_input');
        await page.type('198803052714');
        await page.click('#pnr_submit');
        console.log('Logga in');
        await page.waitForSelector(SEL.EKOLINK);
        await page.goto('https://secure.handelsbanken.se/bb/seio/servlet/ipov?appAction=ShowEconomicOverview&appName=ipov&random=05300918636318221&pilot=true');
        console.log('Inloggad!');
        await page.waitForSelector(SEL.TABLE)
        let $table = await page.evaluate(() => {
            let element = document.querySelector('body > table:nth-child(11) > tbody > tr:nth-child(2)');
            return element ? element.innerHTML : null;
        });
        browser.close();
        const $ = cheerio.load($table);

        let dataz = $("[id^='collapsed'] .groupHeading").map((index, item) => {
            const $tableRow = cheerio.load(item);
            return {
                type: $tableRow('a').text().trim(),
                amount: parseInt($tableRow('.whiteRow').text().trim().replace('*', '').replace(/ /g, '').replace(',', '.'))
            }
        }).get();
        // let pluses = dataz.filter(item => item.type !== 'Lån').reduce((acc, item) => acc + item.amount, 0);
        
        return dataz;
    } catch (e) {
        console.log('there was an error');
        console.log(e);
    }
}

module.exports = {
    getDataz,
}