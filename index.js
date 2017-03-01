const request = require('request');
const URL = require('url-parse');
const store = require('./store2mongo');
const async = require('async');

const url = new URL('https://jobsearch-api.cloud.seek.com.au/search?siteKey=AU-Main&userqueryid=50129d3356a510fab5ce7beb057cb2a6-3464760&userid=8cd321b4-53e9-46e0-abdc-1ffab0cc8f1a&usersessionid=8cd321b4-53e9-46e0-abdc-1ffab0cc8f1a&eventCaptureSessionId=577131d7-0bb9-4cc3-9a1c-a139f95cbcdf&where=All%20Australia&page=1&keywords=developer&sourcesystem=houston', true);

let pageNum = 0;

function countPage(body) {
  const totalCount = body.totalCount;
  const pages = Math.ceil(totalCount / 22);
  return pages;
}

function parseBody(body, outerCallback) {
  const bundle = [];
  async.series([
    (callback) => {
      async.each(body.data, (data, callback) => {
        const entry = {};
        entry.title = data.title;
        entry.teaser = data.teaser;
        entry.company = data.advertiser.description;
        entry.location = data.location;
        entry.area = data.area;
        entry.workType = data.workType;
        entry.salary = data.salary;
        bundle.push(entry);
        callback();
      }, (err) => {
        if (err) console.log('err in each');
        callback();
      });
    },
    (callback) => {
      // console.log(bundle);
      store(bundle, callback);
      // callback();
    }
  ], (err, results) => {
    console.log('finishSeries');
    outerCallback();
  });
}

/*
* start from here
*/

request(url.toString(), (error, response, body) => {
  const bodyObj = JSON.parse(body);
  pageNum = countPage(bodyObj);
  const urlArray = [];
  urlArray.push(url.toString());
  for (let i = 2; i <= pageNum; i++) {
    const currentPage = parseInt(url.query.page, 10);
    url.query.page = (currentPage + 1).toString();
    urlArray.push(url.toString());
  }

  async.eachSeries(urlArray, (url, callback) => {
    request(url, (error, response, body) => {
      const bodyObj = JSON.parse(body);
      parseBody(bodyObj, callback);
    }, (err) => {
      if (err) console.log(err);
      console.log('### complete all parse');
    });
  });
});

