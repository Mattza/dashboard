let { update, init, getStatus } = require('./gapi/gapi');
let { getDataz } = require('./hsb');



async function doit() {
  let values = getDataz();
  await init();
  await update(await values);
  return await getStatus();
 };

 doit().then(data=>{
   
  process.stdin.resume();
  
  console.log(`Toti \t\t\t${data.latest.amount}`);
  console.log(`Månaden:\t\t${data.month.amount}`);
  console.log(`VS Mål:\t\t\t${data.goal.amount}`);
  console.log(`Sen den ${data.prev.date}: \t${data.prev.amount}`);

  process.stdin.once("data", function (data) {
      process.exit(0);
  });
 });