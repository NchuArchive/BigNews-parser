# BigNews-parser
校史館網頁大事記需要每年手動抓取更新

## Intro
主程式以 node js 撰寫。
分為抓取「興新聞」及「榮譽榜」的文章。

## Instruction
1. https://www2.nchu.edu.tw/news/page/ 是新聞頁面首頁，`.../page/` 後面接上數字 `[0-你想去的頁數]` 以 20 為 step。第一頁為 `/page/0`，第二頁為 `/page/20`
2. `fetchNews.js`: 抓取[「興新聞」](https://www2.nchu.edu.tw/news/page/0/id/1)，網址後面需加上 `/id/1`
3. `fetchOutstanding.js`: 抓取[「榮譽榜」](https://www2.nchu.edu.tw/news/page/0/id/3)，網址後面需加上 `/id/3`

## Usage
run command `node [filename.js]`

**remember to npm install all the needed packages.**

## Files
After executing the fetching program, you will get two json files (allNews and allOutstandings) then you can use [JSON to CSV Converter](https://json-csv.com/) to conver them to csv format([allNews.csv](https://github.com/NchuArchive/BigNews-parser/blob/master/allNews.csv), [allOutstandings.csv](https://github.com/NchuArchive/BigNews-parser/blob/master/allOutstandings.csv)) and read it via Excel.