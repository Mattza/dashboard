const fs = require('fs');
const util = require('util');
const googleAuth = require('google-auth-library');
const gapiValues = require('googleapis').sheets('v4').spreadsheets.values;
const gapiGet = util.promisify(gapiValues.get);
const gapiUpdate = util.promisify(gapiValues.update);
const readFile = util.promisify(fs.readFile);

let auth;
let spreadsheetId = '1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE';
let valueInputOption = 'USER_ENTERED';
let readOffset = 1;

async function init() {
  const content = await readFile('backend/gapi/client_secret.json');
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
  const gauth = new googleAuth();
  auth = new gauth.OAuth2(client_id, client_secret, redirect_uris[0]);
  auth.credentials = JSON.parse(await readFile('/.credentials/sheets.googleapis.com-nodejs-quickstart.json'));
}

async function getNextEmptyRow() {
  let { values: res } = await gapiGet({ auth, spreadsheetId, range: `HSB!A${1 + readOffset}:E` });
  let lastEntered = res.filter(row => row[0]).length;
  let sameDateAsLastRow = res[lastEntered - readOffset][0] === new Date().toISOString().split('T')[0];
  return lastEntered + readOffset + (sameDateAsLastRow ? 0 : 1);
}

async function update(params) {
  let nextEmptyRow = await getNextEmptyRow();
  let resource = { values: [params.slice(0, 5)] }
  let plus = await gapiUpdate({ auth, spreadsheetId, range: `HSB!A${nextEmptyRow}:E`, valueInputOption, resource })
  resource.values = [params.slice(-1)]
  let laan = await gapiUpdate({ auth, spreadsheetId, range: `HSB!P${nextEmptyRow}:P`, valueInputOption, resource })
}

const coolStrDateToYearMonth = ([date]) => date.split('-').slice(0, 2).join('-')
const getTotalaAsInt = obj => parseInt(obj[11].replace(/,/g, ''), 10);
const getGoalAsInt = obj => parseInt(obj[17].replace(/,/g, ''), 10);

async function getStatus() {
  let { values: res } = await gapiGet({ auth, spreadsheetId, range: `HSB!A${1 + readOffset}:R` });
  let lastEntered = res.filter(row => row[0]).length - readOffset;
  let latest = res[lastEntered];
  let latestAmount = getTotalaAsInt(latest)
  let prev = res[lastEntered - 1];
  let firstInMonth = res.find(thisRow => coolStrDateToYearMonth(thisRow) === coolStrDateToYearMonth(latest))
  return {
    latest: { amount: latestAmount },
    prev: { amount: latestAmount - getTotalaAsInt(prev), date: prev[0] },
    month: { amount: latestAmount - getTotalaAsInt(firstInMonth), date: firstInMonth[0] },
    goal: {amount: getGoalAsInt(latest)}
  };
}

module.exports = {
  init,
  update,
  getStatus
} 