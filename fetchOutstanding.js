const request = require('request-promise'); // -promise
const cheerio = require('cheerio');
const q = require('q');
const fs = require('fs');

let allNewsArry = [];
// 歷史新聞查詢 link: https://www2.nchu.edu.tw/news-history
// 興新聞: https://www2.nchu.edu.tw/news/page/820/id/1
// 榮譽榜: https://www2.nchu.edu.tw/news/id/3/sdate/2017/04/01/edate/2018/07/18/pu/0

let Outstanding_url = 'https://www2.nchu.edu.tw/news/page/'; // 0-820 + /id/3
let pageUrls = [];
let articlesJson = [];
let promises = [];
let urls = [];

// 產生頁面連結
for (let index = 0; index <= 20; index += 20) {
  let pgNum = Outstanding_url + index + '/id/3';
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
  fs.writeFile('allOutstandings.json', JSON.stringify(allNewsArry), function (err) {
    if (err)
      console.log(err);
    else
      console.log('File ' + 'allOutstandings.json' + ' written!');
  })
}

fetchPages(pageUrls).then((pagesQ) => {
  console.log('共' + pagesQ.length + ' 個頁面');
  for (let pgI = 0; pgI < pagesQ.length; pgI++) {
    let $ = pagesQ[pgI];
    // console.log($.html())
    let newsPerPage = [];
    articleArr = $('div.item-group li');
    for (let articleI = 0; articleI < articleArr.length; articleI++) {
      articleName = $($(articleArr[articleI]).find('h2')).text();
      articleDate = $($(articleArr[articleI]).find('.date')).text();
      articleSource = $($(articleArr[articleI]).find('.source')).text();
      articleSource = (articleSource == ' ' ? 'null' : articleSource);
      // ' ' 這個字符，很邪惡(/&nbsp;/g)
      articleLink = $($(articleArr[articleI]).find('a')).attr('href');
      allNewsArry.push({ articleDate: articleDate, articleName: articleName, articleSource: articleSource, articleLink: articleLink });
    }
  }
  writeJSON();
}).catch((err) => {
  console.log(err)
});