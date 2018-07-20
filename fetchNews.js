const request = require('request-promise'); // -promise
const cheerio = require('cheerio');
const q = require('q');
const fs = require('fs');

let allNewsArry = [];
// 歷史新聞查詢 link: https://www2.nchu.edu.tw/news-history
// 興新聞: https://www2.nchu.edu.tw/news/page/820/id/1
// 榮譽榜: https://www2.nchu.edu.tw/news/id/3/sdate/2017/04/01/edate/2018/07/18/pu/0

let HsingNews_url = 'https://www2.nchu.edu.tw/news/page/'; // 0-820 + /id/1
let pageUrls = [];
let articlesJson = [];
let promises = [];
let urls = [];

// 產生頁面連結
for (let index = 0; index <= 820; index+=20) {
  let pgNum = HsingNews_url + index + '/id/1';
  pageUrls.push({
    uri: pgNum,
    transform: (body) => {
      return cheerio.load(body);
    }
  });
}
console.log(pageUrls);


let fetchPages = (pageUrls) => {
  console.log('requesting all pagesQ in period')
  pageUrls.forEach((page) => {
    promises.push(request(page));
  });
  return q.all(promises);
}
let writeJSON = () => {
  console.log(`共 ${allNewsArry.length} 篇新聞`);
  fs.writeFile('allNews.json', JSON.stringify(allNewsArry), function (err) {
    if (err)
      console.log(err);
    else
      console.log('File ' + 'allNews.json' + ' written!');
  })
}

fetchPages(pageUrls).then((pagesQ) => {
  console.log('共' + pagesQ.length + ' 個頁面');
  for (let pgI = 0; pgI < pagesQ.length; pgI++) {
    let $ = pagesQ[pgI];
    // console.log($)
    let newsPerPage = [];
    articleArr = $('div.item-group li');
    for (let articleI = 0; articleI < articleArr.length; articleI++) {
      articleName = $($(articleArr[articleI]).find('h2')).text();
      articleDate = $($(articleArr[articleI]).find('.date')).text();
      articleSource = $($(articleArr[articleI]).find('.source')).text();
      articleSource = (articleSource == ' ' ? 'null' : articleSource); // ' ' 這個字符，很邪惡(/&nbsp;/g)
      articleLink = $($(articleArr[articleI]).find('a')).attr('href');
      allNewsArry.push({ articleDate: articleDate, articleName: articleName, articleSource: articleSource, articleLink: articleLink });
    }
  }
  writeJSON();
}).catch((err) => {
  console.log(err)
});

// 單一頁
// request(pageUrls[0], (error, response, body) => {
// 	console.log('error: ', error);
// 	console.log('sratusCode: ', response && response.statusCode);
// 	// console.log('body: ', body);

//   var $ = cheerio.load(body);
//   articleArr = $('div.item-group li');

// 	for (var i = 0; i < articleArr.length; i++) {
// 		articleName = $($(articleArr[i]).find('h2')).text();
//     articleDate = $($(articleArr[i]).find('.date')).text();
//     articleSource = $($(articleArr[i]).find('.source')).text();
//     articleLink = $($(articleArr[i]).find('a')).attr('href');

//     articlesJson.push({ articleName: articleName, articleDate: articleDate, articleSource: articleSource, articleLink: articleLink });
//     // console.log(`${articleName}\n>> ${articleLink}\n>> 分類：${articleDate}\n>> 來源: ${articleSource}\n`);
// 	}
//   fs.writeFile('Articles.json', JSON.stringify(articlesJson), function (err) {
// 		if (err)
// 			console.log(err);
// 		else
//       console.log('File ' + 'Articles.json' + ' written!');
// 	})
//   console.log('共 ' + articlesJson.length + ' 篇\n');
// });