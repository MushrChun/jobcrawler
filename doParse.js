const cheerio = require('cheerio');
const fs = require('fs');

/*
* return true if there is next page
* return false if it's currently the last page
*/
function parse(content) {
  const $ = cheerio.load(content);
  const zeroResult = $('div[data-automation="searchZeroResults"]');
  if (zeroResult.length !== 0) {
    return false;
  }

  const searchResult = $('div[data-automation="searchResults"]');
  const jobArticles = $('div._365Hwu1').children();
  jobArticles.each(function getLocation(i, elem) {
    console.log(`Title: ${elem.attribs['aria-label']}`);
    const companyAnchor = $(this).find('span[data-automation="jobAdvertiser"]');
    console.log(`Company: ${companyAnchor.text().trim()}`);

    const jobDesAnchor = $(this).find('p[data-automation="jobShortDescription"]');
    console.log(`Job Description: ${jobDesAnchor.children().text().trim()}`);

    const locationAnchor = $(this).find('._1_qWEhr');
    const location = locationAnchor.first().text().trim();
    const location2 = locationAnchor.first().next().text().trim();
    console.log(`Location: ${location} ${location2}`);
    console.log('--------------------------------------------');
  });

  return true;
}

function readFile() {
  fs.readFile('result.html', 'utf-8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    parse(data);
  });
}

module.exports = parse;
