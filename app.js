let { update, init } = require('./gapi/gapi');

let values = [
  new Date().toISOString().split('T')[0],
  "121039",
  "3694",
  "3623683",
  "38074"
];
init().then(
  () => {
    update(values).then(res => {
      console.log(res);
    })
  }
)

