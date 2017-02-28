const phantom = require('phantom');
const doParse = require('./doPhantomParse');

let mPage;
let mInstance;
const urlToVisit = 'https://www.seek.com.au/jobs?keywords=developer/';

function exit() {
  mPage.close();
  mInstance.exit();
}

function parse(content) {
  doParse(content);
}

phantom.create()
  .then((instance) => {
    mInstance = instance;
    const page = instance.createPage();
    return page;
  })
  .then((page) => {
    mPage = page;
    return page.open(urlToVisit);
  })
  .then((status) => {
    console.log(status);
    if (status === 'success') {
      return mPage.property('content');
    }
    exit();
    return false;
  })
  .then((content) => {
    parse(content);
    // console.log(content);
    exit();
  })
  .catch(e => console.log(e));

