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



app.get('/api/cash', async function (req, res) {
  await init();
  res.send(await getStatus())
});

app.get('/api/cash/update', async function (req, res) {
  let values = getDataz();
  await init();
  res.send(await update(await values));
});


var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
      console.log('received: %s', message);
      ws.send('tyst!');
  });
  ws.send('something');
});
