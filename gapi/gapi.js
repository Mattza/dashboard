var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

let auth;

function authorize() {
  return new Promise((res, rej) => {
    fs.readFile('gapi/client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        rej(err);
        return
      }
      let credentials = JSON.parse(content)
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var gauth = new googleAuth();
      var oauth2Client = new gauth.OAuth2(clientId, clientSecret, redirectUrl);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
          rej(err)
        } else {
          oauth2Client.credentials = JSON.parse(token);
          auth = oauth2Client
          res();
        }
      });
    });
  })
}
let gapiValues = google.sheets('v4').spreadsheets.values;

function getDocument(spreadsheetId, range) {
  return new Promise((res, rej) => {
    gapiValues.get({ auth, spreadsheetId, range }, (err, result) => {
      if (err) {
        return rej(err);
      }
      res(result.values)
    })
  })
}

function updateDocument(spreadsheetId, range, valueInputOption, resource) {
  return new Promise((res, rej) => {
    gapiValues.update({ auth, spreadsheetId, range, valueInputOption, resource }, (err, result) => {
      if (err) {
        return rej(err);
      }
      res(result)
    })
  })
}


async function getNextEmptyRow() {
  let readOffset = 1;
  let res = await getDocument('1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE', `HSB!A${1 + readOffset}:E`);
  let lastEntered = res.filter(row => row[0]).length;
  let sameDateAsLastRow = res[lastEntered - readOffset][0] === new Date().toISOString().split('T')[0];
  return lastEntered + readOffset + (sameDateAsLastRow ? 0 : 1);
}

async function updateNextRow(values) {
  let nextEmptyRow = await getNextEmptyRow();
  let body = {
    values: [values]
  }
  return await updateDocument('1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE', `HSB!A${nextEmptyRow}:E`, 'USER_ENTERED', body);
}

async function getStatus() {
  let readOffset = 1;
  let res = await getDocument('1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE', `HSB!A${1 + readOffset}:O`);
  let lastEntered = res.filter(row => row[0]).length;
  let latest = res[lastEntered - readOffset]
  let firstInMonth = res.find(row => {
    let thisDate = new Date(row[0]);
    let latestDate = new Date(latest[0]);
    return thisDate.getYear() === latestDate.getYear()
      && thisDate.getMonth() === latestDate.getMonth()

  })
  return {
    latest,
    prev: res[lastEntered - readOffset - 1],
    firstInMonth
  }
}

module.exports = {
  init: authorize,
  update: values => new Promise((res, rej) => updateNextRow(values).then(res, rej)),
  getStatus
} 