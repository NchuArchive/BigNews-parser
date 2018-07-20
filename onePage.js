// 單一頁
request(Outstanding_url, (error, response, body) => {
	console.log('error: ', error);
	console.log('sratusCode: ', response && response.statusCode);
	// console.log('body: ', body);

  var $ = cheerio.load(body);
  articleArr = $('div.item-group li');

	for (var i = 0; i < articleArr.length; i++) {
		articleName = $($(articleArr[i]).find('h2')).text();
    articleDate = $($(articleArr[i]).find('.date')).text();
    articleSource = $($(articleArr[i]).find('.source')).text();
    articleLink = $($(articleArr[i]).find('a')).attr('href');

    articlesJson.push({ articleName: articleName, articleDate: articleDate, articleSource: articleSource, articleLink: articleLink });
    // console.log(`${articleName}\n>> ${articleLink}\n>> 分類：${articleDate}\n>> 來源: ${articleSource}\n`);
	}
  fs.writeFile('OutstandingArticles.json', JSON.stringify(articlesJson), function (err) {
		if (err)
			console.log(err);
		else
      console.log('File ' + 'OutstandingArticles.json' + ' written!');
	})
  console.log('共 ' + articlesJson.length + ' 篇\n');
});