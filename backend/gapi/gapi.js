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

async function init() {
  const content = await readFile('backend/gapi/client_secret.json');
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
  const gauth = new googleAuth();
  auth = new gauth.OAuth2(client_id, client_secret, redirect_uris[0]);
  auth.credentials = JSON.parse(await readFile('/.credentials/sheets.googleapis.com-nodejs-quickstart.json'));
}

async function getNextEmptyRow() {
  let readOffset = 1;
  let { values: res } = await gapiGet({ auth, spreadsheetId, range: `HSB!A${1 + readOffset}:E` });
  let lastEntered = res.filter(row => row[0]).length;
  let sameDateAsLastRow = res[lastEntered - readOffset][0] === new Date().toISOString().split('T')[0];
  return lastEntered + readOffset + (sameDateAsLastRow ? 0 : 1);
}

async function update(values) {
  let nextEmptyRow = await getNextEmptyRow();
  let resource = {
    values: [values]
  }
  return await gapiUpdate({ auth, spreadsheetId, range: `HSB!A${nextEmptyRow}:E`, valueInputOption, resource });
}

async function getStatus() {
  let readOffset = 1;
  let { values: res } = await gapiGet({ auth, spreadsheetId, range: `HSB!A${1 + readOffset}:O` });
  let lastEntered = res.filter(row => row[0]).length;
  let latest = res[lastEntered - readOffset];
  let prev = res[lastEntered - readOffset - 1];
  let firstInMonth = res.find(row => {
    let thisDate = new Date(row[0]);
    let latestDate = new Date(latest[0]);
    return thisDate.getYear() === latestDate.getYear()
      && thisDate.getMonth() === latestDate.getMonth()
  })

  let getTotalaAsInt = obj => parseInt(obj[11].replace(/,/g, ''), 10);

  return {
    latest: { amount: getTotalaAsInt(latest) },
    prev: { amount: getTotalaAsInt(latest) - getTotalaAsInt(prev), date: prev[0] },
    month: { amount: getTotalaAsInt(latest) - getTotalaAsInt(firstInMonth), date: firstInMonth[0] },
  };
}

module.exports = {
  init,
  update,
  getStatus
} 