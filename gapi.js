var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

function authorize() {
  return new Promise((res, rej) => {
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        rej(err);
      }
      let credentials = JSON.parse(content)
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
          rej(err)
        } else {
          oauth2Client.credentials = JSON.parse(token);
          res(oauth2Client);
        }
      });
    });
  })
}


function listMajors(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE',
    range: 'HSB!A2:E',
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        if (row[0]) {
          console.log('%s, %s', row[0], row[11]);
        }
      }
      const nextEmptyRow = rows.filter(row => row[0]).length + 2
      console.log('next empty = ', nextEmptyRow);
      let body = {
        values: [
        [
          new Date().toISOString().split('T')[0],
          "88000",
          "3600",
          "3630000",
          "38000"
        ]
      ]
      }
      // range: `HSB!A${nextEmptyRow}:E${nextEmptyRow}`,
      sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: '1QRxPRMHGseNTW24QJRgp3oD6E2BqkmanRvuHTdqqwfE',
        range: `HSB!A${nextEmptyRow}:E`,
        valueInputOption: 'USER_ENTERED',
        resource: body,
      }, function (err, result) {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          console.log('%d cells updated.', result.updatedCells);
        }
      })

    }
  });
}

authorize().then(listMajors);