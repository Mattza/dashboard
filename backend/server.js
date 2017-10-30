let { update, init, getStatus } = require('./gapi/gapi');
let { getDataz } = require('./hsb');


const express = require('express');
const app = express();
const urlParse = baseUrl => req => baseUrl + require('url').parse(req.url).path;
const headerDecorator = jira => (proxyReqOpts, srcReq) => {
  proxyReqOpts.headers = srcReq.headers;
  proxyReqOpts.headers['authorization'] = 'Basic ' + (jira ? 'amlyYXdhbGxib2FyZF91c2VyOkRyaWZ0ZW4xMjM0' : 'd2ViX2Rhc2g6I1RhY29zMTIz');
  return proxyReqOpts;
};

app.use(express.static('../dist'));
let port = 8092;
app.listen(port);
console.log(`Startad på port: ${port}`);




let getAmountFromDataWithType = data => type => data.find(item => item.type === type).amount;
let getTotala = obj => parseInt(obj[11].replace(/,/g, ''), 10);
app.get('/cash', async function (req, res) {
  console.log('taco')
  await init()
  const status = getStatus();
  console.log(`Du har nu:\t\t\t\t\t ${getTotala(status.latest)}`);
  console.log(`Förändring sen förra gången ${status.prev[0]}: \t ${getTotala(status.latest) - getTotala(status.prev)} `);
  console.log(`Förändring sen denna månaden \t\t\t ${getTotala(status.latest) - getTotala(status.firstInMonth)} `);
})
// getDataz().then(dataz => {
//   const getAmountFromType = getAmountFromDataWithType(dataz);
//   let values = [
//     new Date().toISOString().split('T')[0],
//     getAmountFromType('Konton'),
//     getAmountFromType('Fonder'),
//     getAmountFromType('Investeringsspar'),
//     getAmountFromType('Pension')
//   ];
//   console.log('HSB fetch done');
//   init().then(() => {
//     update(values).then(res => {
//       getStatus().then(status => {
//         console.log(`Du har nu:\t\t\t\t\t ${getTotala(status.latest)}`);
//         console.log(`Förändring sen förra gången ${status.prev[0]}: \t ${getTotala(status.latest) - getTotala(status.prev)} `);
//         console.log(`Förändring sen denna månaden \t\t\t ${getTotala(status.latest) - getTotala(status.firstInMonth)} `);

//       })
//     })
//   })
// });
