const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiClaim(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-clicker.pixelverse.xyz/api/mining/claim',
    headers: { 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'content-length': '0', 
      'initdata': `${account?.initData}`, 
      'origin': 'https://sexyzbot.pxlvrs.io', 
      'priority': 'u=1, i', 
      'referer': 'https://sexyzbot.pxlvrs.io/', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'cross-site', 
      'secret': `${account?.secret}`,
      'tg-id': `${account?.tgId}`,
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 
      'username': `${account?.username}`
    }
  };

  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let isRun = true;
    while (isRun) {
      const response = await callApiClaim(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim done", response);
        isRun = false;
      } else if (response?.statusCode === 500) {
        console.log(response?.message);
        isRun = false;
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 241 * 1000 * 60);
}


run();
