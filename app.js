let { update, init } = require('./gapi/gapi');
let { getDataz } = require('./hsb');

let getAmountFromDataWithType = data => type => data.find(item => item.type === type).amount;

getDataz().then(dataz => {
  const getAmountFromType = getAmountFromDataWithType(dataz);
  console.log('ypoypyp', dataz)
  let values = [
    new Date().toISOString().split('T')[0],
    getAmountFromType('Konton'),
    getAmountFromType('Fonder'),
    getAmountFromType('Investeringsspar'),
    getAmountFromType('Pension')
  ];
  init().then(() => {
    update(values).then(res => {
      console.log(res);
    })
  })
});
