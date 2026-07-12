const axios = require("axios");
const cheerio = require("cheerio");

exports.tiktok = async (url) => {
  fetch = await axios.get(`https://www.tikwm.com/api/?url=${url}`)
  if (fetch.status !== 200) {
    throw new Error('Failed to fetch data')
  }
  result = {
    name: fetch.data.data.author.nickname,
    username: fetch.data.data.author.unique_id,
    description: fetch.data.data.title,
    videoUrl: fetch.data.data.play,
    duration: fetch.data.data.duration,
    play_count: fetch.data.data.play_count,
    like: fetch.data.data.digg_count,
    comment: fetch.data.data.comment_count,
    share: fetch.data.data.share_count
  }
  return result;
}

const getPinterestCookie = require("./getPinterestCookie");
const fs = require("fs");
const path = require("path");

function getCachedCookie() {
  try {
    const p = path.join(__dirname, "pinterestCookie.json");
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8")).cookie;
    }
  } catch (_) {}
  return null;
}

exports.pinterest = async (query) => {
  let cookie = getCachedCookie() || (await getPinterestCookie());

  const makeRequest = async (cookieStr) => {
    const { data } = await axios({
      url: "https://www.pinterest.com/resource/BaseSearchResource/get/",
      params: {
        source_url: "/search/pins/?q=" + encodeURIComponent(query),
        data: JSON.stringify({
          options: {
            query: query,
            scope: "pins",
            page_size: 20,
          },
          context: {},
        }),
        _: Date.now(),
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.pinterest.com/",
        Cookie: cookieStr,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
    });

    const results = data?.resource_response?.data?.results;
    if (!results?.length) throw new Error("Tidak ada hasil");
    return results.filter((r) => r.images?.orig?.url).map((r) => r.images.orig.url);
  };

  try {
    return await makeRequest(cookie);
  } catch (err) {
    // Jika gagal (403), generate cookie baru & coba lagi
    if (err.response?.status === 403 || err.message.includes("403")) {
      console.log("[PINTEREST] Cookie expired, generating new...");
      cookie = await getPinterestCookie();
      if (cookie) return await makeRequest(cookie);
    }
    throw err;
  }
};

exports.wallpaper = (query, page = "1") => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${query}`)
      .then(({ data }) => {
        let $ = cheerio.load(data)
        let hasil = []
        $('div.grid-item').each(function (a, b) {
          hasil.push({
            title: $(b).find('div.info > a > h3').text(),
            type: $(b).find('div.info > a:nth-child(2)').text(),
            source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),
            image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
          })
        })
        resolve(hasil)
      })
  })
}