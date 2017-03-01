const MongoClient = require('mongodb').MongoClient;

function store(entries, callback) {
  console.log('in store process');
  MongoClient.connect('mongodb://localhost:27017/seekJobs', (err, db) => {
    if (err) { return console.dir(err); }

    db.collection('data').insertMany(entries, (err, result) => {
      if (err) console.log('err in store process');
      console.log('finish store process');
      callback();
    });
  });
}

module.exports = store;
