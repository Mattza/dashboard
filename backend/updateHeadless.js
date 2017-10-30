let { update, init, getStatus } = require('./gapi/gapi');
let { getDataz } = require('./hsb');

let getAmountFromDataWithType = data => type => data.find(item => item.type === type).amount;
let getTotala = obj => parseInt(obj[11].replace(/,/g, ''), 10);

getDataz().then(dataz => {
  const getAmountFromType = getAmountFromDataWithType(dataz);
  let values = [
    new Date().toISOString().split('T')[0],
    getAmountFromType('Konton'),
    getAmountFromType('Fonder'),
    getAmountFromType('Investeringsspar'),
    getAmountFromType('Pension')
  ];
  console.log('HSB fetch done');
  init().then(() => {
    update(values).then(res => {
      getStatus().then(status => {
        console.log(`Du har nu:\t\t\t\t\t ${getTotala(status.latest)}`);
        console.log(`Förändring sen förra gången ${status.prev[0]}: \t ${getTotala(status.latest) - getTotala(status.prev)} `);
        console.log(`Förändring sen denna månaden \t\t\t ${getTotala(status.latest) - getTotala(status.firstInMonth)} `);

      })
    })
  })
});
