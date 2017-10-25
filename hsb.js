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
        //   await page.screenshot({path: 'example.png'});

        await page.click('#pnr_input');
        await page.screenshot({path: 'example.png'});
        console.log('?')
        await page.type('198803052714');
        console.log('?2')
        await page.click('#pnr_submit');
        console.log('logga in');
        await page.waitForSelector(SEL.EKOLINK);
        await page.goto('https://secure.handelsbanken.se/bb/seio/servlet/ipov?appAction=ShowEconomicOverview&appName=ipov&random=05300918636318221&pilot=true');
        console.log('Klickat vidare');
        await page.screenshot({ path: 'pre.png' });
        await page.waitForSelector(SEL.TABLE)
        await page.screenshot({ path: 'post.png' });
        let listLength = await page.evaluate(() => {
            let element = document.querySelector('body > table:nth-child(11) > tbody > tr:nth-child(2)');
            console.log('taco2', element)
            return element ? element.innerHTML : null;
        });
        const $ = cheerio.load(listLength);

        let dataz = $("[id^='collapsed'] .groupHeading").map((index, item) => {
            const row = cheerio.load(item);
            return { type: row('a').text().trim(), amount: parseInt(row('.whiteRow').text().trim().replace('*', '').replace(/ /g, '').replace(',', '.')) }
        }).get();
        console.log('dataz', dataz);
        let pluses = dataz.filter(item => item.type !== 'Lån').reduce((acc, item) => acc + item.amount, 0);
        await page.screenshot({ path: 'out.png' });
        await browser.close();
        return dataz;
    } catch (e) {
        console.log('there was an error');
        console.log(e);
    }
}

module.exports = {
    getDataz,
}