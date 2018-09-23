let { update, init, getStatus } = require('./backend/gapi/gapi');
let { getDataz } = require('./backend/hsb');

async function doit(){
    let values = getDataz();
    await init();
    console.log((await update(await values)));
}

doit()