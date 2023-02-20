const fetch = require('node-fetch');
const { faker } = require('@faker-js/faker');
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');


const randstr = length => {
    var text = "";
    var possible =
        "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


const registerWithRef = (firstName, lastName, email, ref) => new Promise((resolve, reject) => {
    fetch('https://app.viral-loops.com/api/v2/events', {
        method: 'POST',
        headers: {
            'authority': 'app.viral-loops.com',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'content-type': 'application/json',
            'origin': 'https://www.cryptogpt.org',
            'referer': 'https://www.cryptogpt.org/',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'x-ucid': '7ZPrKYPrpDItGsySTU6iwJ0dZMI'
        },
        body: JSON.stringify({
            'params': {
                'event': 'registration',
                'captchaJWT': null,
                'user': {
                    'firstname': firstName,
                    'lastname': lastName,
                    'email': email,
                    'initialAcquiredFrom': `https://www.cryptogpt.org/refer?referralCode=${ref}&refSource=copy`
                },
                'referrer': {
                    'referralCode': ref
                },
                'refSource': 'copy',
                'acquiredFrom': 'form_widget'
            },
            'publicToken': '7ZPrKYPrpDItGsySTU6iwJ0dZMI'
        })
    })
        .then(res => res.json())
        .then(res => resolve(res))
        .catch(err => reject(err))
});


const functionGetLink = (email, domain) =>
    new Promise((resolve, reject) => {
        fetch(`https://generator.email/${domain}/${email}`, {
            method: "get",
            headers: {
                accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(
                    3
                )}; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
            },
        })
            .then((res) => res.text())
            .then((text) => {
                const $ = cheerio.load(text);
                const src = $(
                    "#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy > div > div > table.jumbotron > tbody > tr > td > div > div > table > tbody > tr > td > table > tbody > tr > td > a"
                ).attr("href");
                resolve(src);
            })
            .catch((err) => reject(err));
    });

const confirmRef = (link, cookie, referer) => new Promise((resolve, reject) => {
    const options = {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'authority': 'app.viral-loops.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'id-ID,id;q=0.9',
            'cache-control': 'max-age=0',
            // 'cookie': '__cf_bm=XDMtmCcJYAtWytacGfq5hBxe3DR_v.SF1vhKCoxQEh0-1676772271-0-AXRLPl0xKZCg2Q5CUu2ATP2PmqyCiHTOChuRKyCes2KArPSHOjAgiP4OIeNMzcF04aH2BedtVQ7SovVrWjQ0eNhsuPmeLaCqcG8UYQw6QmWyUIKu0vGJ6BujPNs3VK8rhCocN7zORRIXsv5ChI9HA28=; cf_chl_2=182e07e89e83278',
            'origin': 'https://app.viral-loops.com',
            // 'referer': 'https://app.viral-loops.com/api/v1/confirm_registration?dt=14ae39ccdbcd9404334d1e66f52d3806&sdt=bcb37951052c58a33b6db29b05cef540&pk=7ZPrKYPrpDItGsySTU6iwJ0dZMI&__cf_chl_tk=km.RcER5QyNcNgKbiw9MRTm0pIlskA0fbuMDe_aczP8-1676772300-0-gaNycGzNDJA',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
    };

    if (cookie) {
        options.headers.cookie = cookie
    }

    if (referer) {
        options.headers.referer = referer
    }
    fetch(link, options)
        .then(res => {
            let cookie = res.headers.raw()['set-cookie'];

            if(cookie){
                cookie = cookieHelpers(cookie)
            }

            const result = {
                location: res.headers.raw()['location'],
                cookie
            }
            resolve(result)
        })
        .catch(err => reject(err))
});

const refFunc = (link, cookie) => new Promise((resolve, reject) => {
    const options = {
        method: 'GET',
        redirect: 'manual'
    };

    if (cookie) {
        options.headers = {
            cookie
        };
    }
    fetch(link, {
        headers: {
            'authority': 'cryptogpt.org',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'id-ID,id;q=0.9',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        }
    })
        .then(res => {
            let cookie = res.headers.raw()['set-cookie'];

            if(cookie){
                cookie = cookieHelpers(cookie)
            }
            const result = {
                location: res.headers.raw()['location'],
                cookie
            }
            resolve(result)
        })
        .catch(err => reject(err))
});


const cookieHelpers = (arrayCookie) => {
    let newCookie = "";
    for (let index = 0; index < arrayCookie.length; index++) {
      const element = arrayCookie[index];
      if (index < arrayCookie.length - 1) {
        newCookie += element.split(";")[0] + "; ";
      } else {
        newCookie += element.split(";")[0];
      }
    }
    return newCookie;
  };


(async () => {
    const ref = '0ltt4z7'
    while(true){

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = `${firstName}${lastName}${await randstr(5)}@mtcxmail.com`.toLowerCase();
        const registerResult = await registerWithRef(firstName, lastName, email, ref);
        if (registerResult.dt) {
            let otpCode;
            do {
                otpCode = await functionGetLink(email.split("@")[0], email.split("@")[1]);
            } while (!otpCode);

            fs.appendFileSync('./confirmLink.txt', `\n${otpCode}`);
            fs.appendFileSync('./email.txt', `\n${email}`);
            console.log('Success - ' +email)
        
            
        } else {
            console.log('gagal send')
        }
}

})();
