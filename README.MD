This repo represents how to green hand of JS
moving on to build a Job Hunter for him self

Step 1:
* tried phantomjs as headless browser and simulated user retrieving jobs on website
* taking advantage of cheerio for DOM parsing

Step 2:
* tried requestjs after he found simulation consuming a lot of CPU and job info is passed within a json format on an independent HTTP request
* given the data is over 5k, he decided to store that into a mongodb
* to control flows he took async lib into project before something sucks would happen such as mongodb booming -.-

