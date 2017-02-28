const phantom = require('phantom');
const cheerio = require('cheerio');
const fs = require('fs');
const doParse = require('./doParse');

let mPage;
let mInstance;

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
    return page.open('https://www.seek.com.au/jobs?keywords=developer/');
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

