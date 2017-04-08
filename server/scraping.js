const Crawler = require('simplecrawler')
const cheerio = require('cheerio')

// http://menudiabetyka.pl/category/sniadanie/

const crawler = new Crawler('http://menudiabetyka.pl')
crawler.interval = 100;
crawler.userAgent = 'ZnanyLekarz (zdrowieton.js)'

const dbInstance = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true
});

const saveToDatabase = (body) {

};

crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
  callback(null, queueItem.path.match(/category\/(sniadanie|obiad|kolacja|deser)\/?/i) || queueItem.path.match(/(\/|-)/i));
});

crawler.on('fetcherror', function (queueItem, responseBuffer, response) {
  // console.log('Fetched', queueItem.url, responseBuffer.toString());
  console.log('fetcherror', queueItem.url);
});

crawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
  const $ = cheerio.load(responseBuffer.toString());

  const searchTitleIngredients = $('body').find('.post-entry h2');

  for (let i = 0; i < searchTitleIngredients.length; i++) {
    if (/(Składniki)/i.test(cheerio.load(searchTitleIngredients[i]).text())) {
      saveToDatabase(responseBuffer.toString());
    }
  }
});


crawler.start();
// dbInstance('recipe').insert({title: 'Slaughterhouse Five'})
//   .then((aa) => {
//     console.log(aa);
//   });

// dbInstance.select('*').from('recipe')
//   .then((rows) => {
//     console.log(rows);
//   })
//   .catch((err) => {
//     console.log(err);
//   });