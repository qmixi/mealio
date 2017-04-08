const Crawler = require('simplecrawler')
const cheerio = require('cheerio')

// http://menudiabetyka.pl/category/sniadanie/

const category = {
  'category-sniadanie': 'Śniadanie',
  'category-obiad': 'Obiad',
  'category-deser': 'Deser',
  'category-kolacja': 'Kolacja'
}

const crawler = new Crawler('http://menudiabetyka.pl')
crawler.interval = 100;
crawler.userAgent = 'ZnanyLekarz (zdrowieton.js)'

const dbInstance = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: `${__dirname}/database.sqlite`
  },
  useNullAsDefault: true
});

const saveToDatabase = (body, url) => {
  const $ = cheerio.load(body);
  const $body = $('body');

  const $title = $body.find('.post-header h1');
  const $image = $body.find('.attachment-post-thumbnail.wp-post-image');
  const $dataPost = $body.find('.post-entry').children();
  const $dataRecipe = $body.find('table').find('tbody');
  let categoryName = false;
  // search category
  for (const keyCategory in category) {
    if (category.hasOwnProperty(keyCategory) && $body.find(`.${keyCategory}`).length > 0) {
      categoryName = category[keyCategory];
    }
  }

  if (!categoryName) {
    return false;
  }

  const preparationText = [];
  const ingredientsValue = [];
  const dataRecipeValue = [];
  let startPushPreparation = false;
  let startPushIngredients = false;

  for (let i = 0; i < $dataPost.length; i++) {
    const $item = cheerio.load($dataPost[i]);

    if ($item.root().html() === '<h2>Przygotowanie</h2>') {
      startPushPreparation = true;
    }

    if (/<table/i.test($item.root().html())) {
      startPushPreparation = false;
    }

    if (startPushPreparation && $item.root().html() !== '<h2>Przygotowanie</h2>') {
      preparationText.push($item.root().text());
    }
  };

  for (let i = 0; i < $dataPost.length; i++) {
    const $item = cheerio.load($dataPost[i]);

    if ($item.root().text() === 'Składniki') {
      startPushIngredients = true;
    }

    if ($item.root().html() === '<h2></h2>' || $item.root().html() === '<h2>Przygotowanie</h2>') {
      startPushIngredients = false;
    }

    if (startPushIngredients && $item.root().text() !== 'Składniki') {
      ingredientsValue.push($item.root().text());
    }
  };

  const ingredientsToDb = [];

  ingredientsValue.forEach((ingredient) => {
    ingredient.split('\n').forEach((item) => {
      if (item !== '') {
        ingredientsToDb.push(item);
      }
    });
  });

  const $explodeTr = $dataRecipe.find('tr');

  let getDataRecipe = false;
  for(let i = 0; i < $explodeTr.length; i++) {
    const $itemTr = cheerio.load($explodeTr[i]);

    const $explodeTd = $itemTr.root().find('td');

    for (let j = 0; j < $explodeTd.length; j++) {
      const $itemTd = cheerio.load($explodeTd[j]);

      const textTest = $itemTd.root().text();

      if (/1\sporcja/i.test(textTest) || /suma:/i.test(textTest)) {
        getDataRecipe = true;
      }

      const textTd = $itemTd.root().text();

      if (getDataRecipe && /\d+/.test(textTd) && !/1\sporcja/i.test($itemTd.root().text()) && !/WW/i.test($itemTd.root().text())) {
        dataRecipeValue.push($itemTd.root().text().trim());
      }
    }
  }

  dbInstance('recipe').insert({
    title: $title.text(),
    category: categoryName,
    image: $image.attr('src'),
    preparation: preparationText.join('<br />')
  })
  .then((idRecipe) => {
    console.log(idRecipe, url);

    const insertIngredients = [];

    for (const item of ingredientsValue) {
      insertIngredients.push({
        id_recipe: idRecipe[0],
        value: item
      });
    }

    return Promise.all([
      dbInstance('data_recipe').insert({
        id_recipe: idRecipe[0],
        energy: dataRecipeValue[0],
        protein: dataRecipeValue[1],
        fat: dataRecipeValue[2],
        carbo: dataRecipeValue[3],
        fiber: dataRecipeValue[4],
        ww: dataRecipeValue[5],
        wbt: dataRecipeValue[6]
      }),
      dbInstance('ingredients').insert(insertIngredients)
    ])
  });
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
      saveToDatabase(responseBuffer.toString(), queueItem.url);
    }
  }
});

process.on('uncaughtException', (err) => {
  console.error(err);
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