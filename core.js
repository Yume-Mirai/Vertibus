const { generateWAMessageFromContent, proto } = require("baileys");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const speed = require("performance-now");
const imgbb = require("imgbb-uploader");
const moment = require("moment-timezone");
const { color } = require("./lib/color");
const { performance } = require("perf_hooks");
const ind = require("./language/ind");
const eng = require("./language/eng");
const piercerData = require("./piercer");
const abilityDB = require("./ability");
const { searchRegislet, searchByLocation, formatRegislet } = require("./registlet");
const calculateMQ = require("./lib/MQcalculator");
// Fungsi ambil cookie Pinterest secara otomatis
async function getPinterestCookie() {
  try {
    const res = await axios.get('https://www.pinterest.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const setCookie = res.headers['set-cookie'];
    if (!setCookie) return null;
    let csrf = '', sess = '';
    for (const c of setCookie) {
      const part = c.split(';')[0];
      if (part.startsWith('csrftoken=')) csrf = part.split('=')[1];
      if (part.startsWith('_pinterest_sess=')) sess = part.split('=')[1];
    }
    if (!csrf || !sess) return null;
    return `csrftoken=${csrf}; _pinterest_sess=${sess}`;
  } catch (e) {
    return null;
  }
}

// Cache cookie di memori
let pinterestCookie = null;
let cookieExpire = 0;

async function getValidCookie() {
  if (pinterestCookie && Date.now() < cookieExpire) return pinterestCookie;
  pinterestCookie = await getPinterestCookie();
  cookieExpire = Date.now() + 30 * 60 * 1000; // 30 menit
  return pinterestCookie;
}
const {
  getBuffer,
  getRandom,
  formatp,
  runtime,
} = require("./lib/general-function");
const { pinterest } = require("./lib/downloader");

/* Database */
let Create_Update;
let Read;
let Delete;
if (global.mongoDB === true) {
  Create_Update = require("./mongoDB/create-update");
  Read = require("./mongoDB/read");
  Delete = require("./mongoDB/delete");
} else {
  Create_Update = require("./db/create-update");
  Read = require("./db/read");
  Delete = require("./db/delete");
}

//set your Timezone in tz()
var currentTime = moment().tz("Asia/Jakarta").format("HH:mm");

//Consigment Function
const separate = (int) => {
  price = int.toString();

  reversed = price.split("").reverse().join("");
  dotReserve = reversed.match(/.{1,3}/g).join(".");
  reverses = dotReserve.split("").reverse().join("");

  return reverses;
};

module.exports = core = async (client, m, chatUpdate) => {
  if (!m.message) return; // abaikan pesan tanpa konten
  var body =
    (m.mtype === "conversation")
      ? m.message.conversation
      : (m.mtype == "imageMessage")
        ? m.message.imageMessage.caption
        : (m.mtype == "videoMessage")
          ? m.message.videoMessage.caption
          : (m.mtype == "extendedTextMessage")
            ? m.message.extendedTextMessage.text
            : (m.mtype == "buttonsResponseMessage")
              ? m.message.buttonsResponseMessage.selectedButtonId
              : (m.mtype == "listResponseMessage")
                ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                : (m.mtype == "templateButtonReplyMessage")
                  ? m.message.templateButtonReplyMessage.selectedId
                  : (m.mtype == 'interactiveResponseMessage')
                    ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id
                    : (m.mtype == 'templateButtonReplyMessage')
                      ? m.msg.selectedId
                      : (m.mtype === "messageContextInfo")
                        ? (m.message.buttonsResponseMessage?.selectedButtonId ||
                          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                          m.text)
                        : "";
  const prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
  const command = body
    .replace(prefix, "")
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();
  const isUrl = (url) => {
    return url.match(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
        "gi"
      )
    );
  };
  const mik = m.quoted || m;
  const quoted =
    mik.mtype == "buttonsMessage"
      ? mik[Object.keys(mik)[1]]
      : mik.mtype == "templateMessage"
        ? mik.hydratedTemplate[Object.keys(mik.hydratedTemplate)[1]]
        : mik.mtype == "product"
          ? mik[Object.keys(mik)[0]]
          : m.quoted
            ? m.quoted
            : m;
  const args = body.trim().split(/ +/).slice(1);
  const isCmd = body.startsWith(prefix);
  const pushname = m.pushName || "No Name";
  const botNumber = await client.decodeJid(client.user.id);
  const itsMe = m.key.fromMe
  let text = (q = args.join(" "));
  const budy = typeof m.text == "string" ? m.text : "";
  const qms = quoted.msg || quoted;
  const mime = qms.mimetype || "";
  const mek = chatUpdate.messages[0];
  const content = JSON.stringify(m.message);
  const sender = m.isGroup ? (m.key.fromMe ? m.sender : (m.key?.participantPn || m.key.participant || m.sender)) : m.sender;
  const from = m.chat;
  const reply = m.reply;

  //Database instance
  let check = new Read();
  let create = new Create_Update();
  let remove = new Delete();

  //security
  const isGroup = m.isGroup;
  const groupMetadata = m.isGroup
    ? await client.groupMetadata(m.chat).catch((e) => { })
    : "";
  const getSenderNumber = (jid) => {
    if (!jid) return "";
    return jid.replace(/@(s\.whatsapp\.net|lid|g\.us)/, "");
  };
  const senderNumber = getSenderNumber(sender);
  const isOwner = global.owner.includes(senderNumber) || false;
  const getGroupAdmins = (participants) => {
    admins = [];
    for (let i of participants) {
      i.admin ? admins.push(i.id || i.jid) : "";
    }
    return admins;
  };
  const groupName = m.isGroup ? groupMetadata.subject : "";
  const groupId = m.isGroup ? groupMetadata.id : "";
  const groupMembers = m.isGroup ? groupMetadata.participants : "";
  const groupAdmins = m.isGroup ? getGroupAdmins(groupMembers) : "";
  const adminNumbers = m.isGroup && groupMembers ? groupMembers.filter(p => p.admin).map(p => getSenderNumber(p.jid)) : [];
  const isAdminByPn = m.key.participantPn && adminNumbers.includes(getSenderNumber(m.key.participantPn));
  const isOwnerFromLid = m.key.participantLid ? global.owner.includes(getSenderNumber(m.key.participantLid)) : false;
  const isGroupAdmins = m.isGroup ? (groupAdmins.includes(sender) || adminNumbers.includes(senderNumber) || isAdminByPn || isOwner || isOwnerFromLid) : false;
  const botAdmin = m.isGroup ? groupAdmins.includes(botNumber) || false : false;

  //Media init
  const isMedia = m.mtype === "imageMessage" || m.mtype === "videoMessage";
  const isQuotedImage =
    m.mtype === "extendedTextMessage" && content.includes("imageMessage");
  const isQuotedSticker =
    m.mtype === "extendedTextMessage" && content.includes("stickerMessage");
  const isQuotedVideo =
    m.mtype === "extendedTextMessage" && content.includes("videoMessage");

  //Language
  senderType = m.isGroup ? groupMetadata.id : sender;
  user = global.db.user.findIndex((user) => user.id === senderType);
  if (global.db.user[user]?.language === "ind") {
    lang = ind;
    language = "ind";
  } else if (global.db.user[user]?.language === "eng") {
    lang = eng;
    language = "eng";
  } else {
    lang = ind; //default language
    language = "ind"; //default language
  }

  //Proccess
  const progress = (reaction) => {
    const reactions = {
      react: {
        text: reaction,
        key: m.key,
      },
    };
    client.sendMessage(from, reactions);
  };

  //auto read incoming message
  await client.readMessages([m.key]);

  //mongoDB Error Handler
  if (
    global.mongoDB == true &&
    global.mongoString === "Enter Your Connection String!!"
  ) {
    return console.log(
      color(
        "Be sure your connection mongoDB string is corrrect!!\nCheck it on setting.js Line : 13",
        "red"
      )
    );
  }

  //Message Detector
  if (!isCmd && !isGroup && !itsMe) {
    if (body && !isOwner) {
      template = `
      ${global.botName} has new message
      Message ID: ${m.key.id}
      Sender: ${sender}
      Name: ${pushname}
      Text: ${body}`;
      client.sendText(global.owner[0] + "@s.whatsapp.net", template);
    }

    //forward message replied by owner
    if (
      sender.includes(global.owner[0]) &&
      m.quoted &&
      qms.text.includes(`${global.botName} has new message`)
    ) {
      messageMatchID = qms.text.match(/Message ID: ([A-Z0-9]+)/);
      messageID = messageMatchID ? messageMatchID[1] : null;
      if (messageID === null) return;
      messageMatchSender = qms.text.match(/\d+@s\.whatsapp\.net/);
      messageSender = messageMatchSender ? messageMatchSender[0] : null;
      if (messageSender === null) return;
      for (let mess of global.store.messages[messageSender].array) {
        if (mess.match(messageID)) {
          quotedMessage = mess.message.extendedTextMessage;
          imgMessage = mess.message.imageMessage;
          vidMessage = mess.message.videoMessage;
          defaultMessage = mess.message.conversation;
          teksTemplate = `
        *Reply from owner*
        ${body}
        `;
          client.sendMessage(
            mess.key.remoteJid,
            { text: teksTemplate },
            { quoted: mess }
          );
        }
      }
    }
  }

  //antilink
  if (
    budy.match(
      /\b((https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([\s\S]*?)?)\b/gm
    ) &&
    m.isGroup &&
    !isCmd
  ) {
    if (!isGroup && isOwner) return;
    if (isGroupAdmins) return;
    if (itsMe) return;

    restricted = global.db.groups[groupMetadata.id]?.antilink || false;

    if (restricted) {
      await client.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });
    }
  }

  //AntilinkGC
  if (budy.match("chat.whatsapp.com") && m.isGroup) {
    if (!botAdmin) return;
    if (isGroupAdmins) return;
    if (itsMe) return;

    restricted = global.db.groups[groupMetadata.id]?.antilinkgc || false;

    if (restricted) {
      await client.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });
    }
  }

  // ON/OFF BOT
  // if (isCmd && m.isGroup) {
  //   if (!global.db.groups[groupMetadata.id]) {
  //     global.db.groups[groupMetadata.id] = {
  //       open: true,
  //     }
  //   }
  //   global.db.groups[groupMetadata.id].open ??= true;
  //   opened = global.db.groups[groupMetadata.id].open;
  //   const isActive = global.db.groups[groupMetadata.id]?.active !== false;

  //   // .bot off → semua diblokir kecuali owner bot
  //   if (!isActive && !isOwner && !itsMe) return;

  //   // .bot close → hanya member biasa diblokir, admin masih bisa
  //   if (!opened && !isGroupAdmins && !itsMe) return;
  // }
  // ON/OFF BOT & GROUP ACTIVE CHECK
  if (isCmd && m.isGroup) {
    if (!global.db.groups[groupMetadata.id]) {
      global.db.groups[groupMetadata.id] = {
        active: true,
        open: true,
      };
    }
    const groupSettings = global.db.groups[groupMetadata.id];
    groupSettings.active ??= true;   // default aktif
    groupSettings.open ??= true;     // default terbuka untuk semua

    // ⚠️ PENTING: Jika bot nonaktif, hanya izinkan command "bot"
    if (!groupSettings.active && command !== "bot") {
      return;
    }
    // Jika mode admin-only, hanya admin yang bisa pakai command (selain "bot")
    if (groupSettings.active && !groupSettings.open && !isGroupAdmins && !itsMe) return;
  }
  // BLOKIR PESAN PRIVATE — hanya izinkan dari grup
  if (isCmd && !m.isGroup) {
    // Izinkan owner akses via private
    if (!isOwner) {
      return client.sendMessage(from, {
        text: `⚠️ *${global.botName}*\n\nBot ini hanya bisa digunakan di *grup*!\nSilakan gunakan bot di grup yang sudah ditambahkan.`
      });
    }
  }
  // Push Message To Console
  let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

  if (isCmd && !isGroup) {
    console.log(
      chalk.black(chalk.bgWhite("[ LOGS ]")),
      color(argsLog, "turquoise"),
      chalk.magenta("From"),
      chalk.green(pushname),
      chalk.yellow(`[ ${sender.replace("@s.whatsapp.net", "")} ]`),
      chalk.black.bgYellow(`[ ${currentTime} ]`)
    );
  } else if (isCmd && m.isGroup) {
    console.log(
      chalk.black(chalk.bgWhite("[ LOGS ]")),
      color(argsLog, "turquoise"),
      chalk.magenta("From"),
      chalk.green(pushname),
      chalk.yellow(`[ ${sender.replace("@s.whatsapp.net", "")} ]`),
      chalk.blueBright("IN"),
      chalk.green(groupName),
      chalk.black.bgYellow(`[ ${currentTime} ]`)
    );
  }

  // ============= TORAM NEWS HELPER =============
  const _toramHeaders = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };
  const _toramBase = (lang) => `https://${lang === "eng" ? "en" : "id"}.toram.jp`;

  const _toramGetLatest = async (typeCode, lang) => {
    try {
      const { base, items } = await _toramGetList(typeCode, lang, 1);
      if (!items.length) return null;

      const latestItem = items[0];
      const detailUrl = `${base}${latestItem.href}`;

      const detailRes = await axios.get(detailUrl, { headers: _toramHeaders });
      const $d = cheerio.load(detailRes.data);

      // Judul
      const title = $d("h1.smallTitle").text().trim()
        || $d(".smallTitleLine h1").text().trim()
        || latestItem.title;

      // Tanggal
      const detailDate = $d("p.news_date time").text().trim() || latestItem.date;

      // === AMBIL KONTEN UTAMA ===
      // Prioritas: #news (berdasarkan pengalaman sebelumnya), lalu .infoDetailBox, p.pTxt
      let contentBox = $d("#news");
      if (!contentBox.length) contentBox = $d(".infoDetailBox");
      if (!contentBox.length) contentBox = $d("p.pTxt");

      let rawText = "";
      if (contentBox.length) {
        rawText = contentBox.text(); // ambil teks mentah
      }

      if (!rawText) {
        return {
          title,
          date: detailDate,
          content: "_Tidak dapat memuat konten. Silakan buka link._",
          url: detailUrl
        };
      }

      // Bersihkan teks
      let content = rawText
        // Hapus kalimat yang tidak perlu
        .replace(/Tweet/g, "")
        .replace(/Kembali ke atas/g, "")
        .replace(/Back to top/g, "")
        // Hapus whitespace di awal & akhir tiap baris
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        // Hapus baris kosong berlebih (maks 1 baris kosong)
        .replace(/\n{3,}/g, '\n\n')
        // Hapus spasi ganda
        .replace(/ {2,}/g, ' ')
        .trim();

      if (!content) {
        content = "_Tidak dapat memuat konten. Silakan buka link._";
      } else if (content.length > 2000) {
        content = content.substring(0, 2000) + "\n\n_...(terpotong, baca selengkapnya di link)_";
      }

      return { title, date: detailDate, content, url: detailUrl };
    } catch (err) {
      console.error("[_toramGetLatest Error]", err.message);
      return null;
    }
  };

  const _toramGetList = async (typeCode, lang, limit = 5) => {
    const base = _toramBase(lang);
    const listRes = await axios.get(`${base}/?type_code=${typeCode}`, { headers: _toramHeaders });
    const $l = cheerio.load(listRes.data);
    const items = [];
    $l(".common_list .news_border").each(function (i) {
      if (i >= limit) return false;
      const href = $l(this).find("a").attr("href");
      const title = $l(this).find(".news_title").text().trim();
      const date = $l(this).find("time").text().trim().replace(/[\[\]「」]/g, "");
      if (href) items.push({ title, date, href });
    });
    return { base, items };
  };

  // ============= AVATAR BANNER HELPER =============
  const _toramGetAvatarBanner = async (lang) => {
    const base = _toramBase(lang);
    const listRes = await axios.get(`${base}/?type_code=all#contentArea`, { headers: _toramHeaders });
    const $ = cheerio.load(listRes.data);

    const newsList = [];
    $('.common_list li a').each((_, el) => {
      const href = $(el).attr('href');
      const dateStr = $(el).find('.time time').text().trim();
      if (!href || !dateStr) return;
      const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return;
      newsList.push({
        url: base + href,
        dateStr,
        dateObj: new Date(m[1], m[2] - 1, m[3])
      });
    });

    if (newsList.length === 0) return [];

    let newestDate = null;
    let newestBanners = [];

    for (const news of newsList) {
      const detailRes = await axios.get(news.url, { headers: _toramHeaders });
      const $detail = cheerio.load(detailRes.data);
      const banners = [];

      $detail('h2.deluxetitle').each((_, h2) => {
        const title = $detail(h2).text().trim();
        const img = $detail(h2).nextAll('center').first().find('img');
        const src = img.attr('src') || img.attr('data-src');
        if (src && /toram_avatar_/i.test(src)) {
          banners.push({
            title,
            image: src.startsWith('http') ? src : base + src
          });
        }
      });

      if (banners.length === 0) continue;

      if (!newestDate || news.dateObj > newestDate) {
        newestDate = news.dateObj;
        newestBanners = banners.map(b => ({
          ...b,
          dateStr: news.dateStr
        }));
      }
    }

    return newestBanners;
  };

  // ============= NEWS BY ID HELPER =============
  const _toramGetNewsById = async (newsId, lang) => {
    const base = _toramBase(lang);
    const url = `${base}/information/detail/?information_id=${newsId}`;
    try {
      const res = await axios.get(url, { headers: _toramHeaders });
      const $ = cheerio.load(res.data);
      let title = $("h1").first().text().trim() || `Berita ID: ${newsId}`;
      let content = $("body").text().trim();
      content = content
        .replace(/kembali ke atas.*/gi, "")
        .replace(/tim operasi toram online.*/gi, "")
        .replace(/\s+/g, " ")
        .replace(/([.!?])\s+([A-Z•・])/g, "$1\n\n$2")
        .replace(/・/g, "\n- ")
        .trim();
      if (content.length > 1000) content = content.substring(0, 1000) + "...";
      return { success: true, title, content, url };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ============= SITE STATUS =============
  const _toramCheckStatus = async (lang) => {
    const base = _toramBase(lang);
    try {
      const res = await axios.head(base, { headers: _toramHeaders, timeout: 10000 });
      return { status: res.status < 400, code: res.status };
    } catch (error) {
      return { status: false, error: error.message };
    }
  };

  // ============= AVAILABLE NEWS IDS =============
  const _toramGetAvailableNewsIds = async (lang, limit = 10) => {
    const base = _toramBase(lang);
    try {
      const res = await axios.get(`${base}/?type_code=update`, { headers: _toramHeaders });
      const $ = cheerio.load(res.data);
      const newsIds = [];
      $('a[href*="information_id"]').each((i, el) => {
        if (i >= limit) return false;
        const href = $(el).attr("href");
        const match = href?.match(/information_id=(\d+)/);
        if (match) {
          newsIds.push({
            id: match[1],
            title: $(el).text().trim(),
            url: href.startsWith("/") ? base + href : href
          });
        }
      });
      return newsIds;
    } catch (err) {
      return [];
    }
  };

  // ============= BOOST BOSS HELPER =============
  const _toramGetBoostBoss = async (lang) => {
    const base = _toramBase(lang);
    const listUrl = `${base}/top/?type_code=event`;
    try {
      const listRes = await axios.get(listUrl, { headers: _toramHeaders });
      const $ = cheerio.load(listRes.data);
      const boostNews = [];

      $('ul li a[href*="information_id"]').each((i, el) => {
        const fullText = $(el).text().trim();
        const lower = fullText.toLowerCase();
        const href = $(el).attr('href');
        const dateMatch = fullText.match(/［(\d{4}-\d{2}-\d{2})］/);
        const dateStr = dateMatch ? dateMatch[1] : '';
        const dateParts = dateStr.split('-');
        if (lower.includes('boost')) {
          boostNews.push({
            title: fullText.replace(/［\d{4}-\d{2}-\d{2}］/, '').trim(),
            href: href.startsWith('http') ? href : base + href,
            date: dateStr,
            parsedDate: dateStr ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) : null
          });
        }
      });

      if (!boostNews.length) return { active: false, reason: 'no_news' };

      let latest = boostNews[0];
      for (const n of boostNews) {
        if (n.parsedDate && latest.parsedDate && n.parsedDate > latest.parsedDate)
          latest = n;
      }

      const detailRes = await axios.get(latest.href, { headers: _toramHeaders });
      const $d = cheerio.load(detailRes.data);
      const bodyText = $d('body').text();

      let endDate = null;
      let endStr = '';

      const indMatch = bodyText.match(
        /(?:Selesai|Berakhir)\s*[:]\s*[^,]*,?\s*(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\s+(?:pukul|jam)\s*(\d{1,2})[:.](\d{2})\s*WIB/i
      );
      if (indMatch) {
        const bulanInd = {
          'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
          'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
        };
        const d = parseInt(indMatch[1]), m = bulanInd[indMatch[2].toLowerCase()],
          y = parseInt(indMatch[3]), hh = parseInt(indMatch[4]), mm = parseInt(indMatch[5]);
        if (m !== undefined) {
          endDate = new Date(Date.UTC(y, m, d, hh - 7, mm, 0));
          endStr = `${d} ${indMatch[2]} ${y} ${hh}:${mm.toString().padStart(2, '0')} WIB`;
        }
      }

      if (!endDate) {
        const engMatch = bodyText.match(
          /Until:\s*([A-Za-z]+)\s+(\d+)[a-z]{2}\s+at\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s+\(JST/i
        );
        if (engMatch) {
          const bulanEng = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
          };
          const d = parseInt(engMatch[2]), m = bulanEng[engMatch[1].toLowerCase()],
            hhRaw = parseInt(engMatch[3]), mm = parseInt(engMatch[4]),
            ampm = engMatch[5];
          let hh = hhRaw;
          if (ampm === 'PM' && hh !== 12) hh += 12;
          if (ampm === 'AM' && hh === 12) hh = 0;
          const y = new Date().getFullYear();
          if (m !== undefined) {
            const jst = new Date(Date.UTC(y, m, d, hh - 9, mm, 0));
            endDate = new Date(jst.getTime() + 2 * 60 * 60 * 1000);
            endStr = `${endDate.getDate()} ${engMatch[1]} ${y} ${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')} WIB`;
          }
        }
      }

      if (endDate && new Date() > endDate) {
        return { active: false, reason: 'expired', endStr };
      }

      const bosses = [];
      $d('.subtitle').each((i, el) => {
        const txt = $d(el).text().trim();
        const match = txt.match(/^(Lv\d+)\s+([^(]+)(?:\(([^)]+)\))?/);
        if (!match) return;

        const level = match[1];
        const name = match[2].trim();
        const location = match[3] || '';

        let img = null;
        let next = $d(el).next();
        for (let j = 0; j < 3 && next.length; j++) {
          const found = next.find('img');
          if (found.length) {
            img = found.first().attr('src');
            break;
          }
          next = next.next();
        }

        if (!img) return;

        let imageUrl;
        if (img.startsWith('http')) imageUrl = img;
        else if (img.includes('akamaized.net'))
          imageUrl = (img.startsWith('//') ? 'https:' : 'https://') + img;
        else if (img.startsWith('/'))
          imageUrl = 'https://toram-jp.akamaized.net' + img;
        else
          imageUrl = 'https://toram-jp.akamaized.net/img/announcement/bossevent/' + img.replace(/^\.\/.*\//, '');

        bosses.push({
          level, name, location,
          fullName: `${level} ${name}${location ? ` (${location})` : ''}`,
          image: imageUrl
        });
      });

      return {
        active: true,
        bosses,
        endStr,
        eventTitle: latest.title
      };

    } catch (err) {
      console.error('[BoostBoss Error]', err.message);
      throw err;
    }
  };

  // ============= LIVE STREAM HELPERS =============
  const _toramGetLiveDetail = async (lang) => {
    const base = _toramBase(lang);
    const listUrl = `${base}/?type_code=event#contentArea`;
    const LIVE_KEYWORDS = ['live', 'livestream', 'live stream', 'viewer present', 'bemmo', 'youtube', 'watch'];

    const listRes = await axios.get(listUrl, { headers: _toramHeaders });
    const $ = cheerio.load(listRes.data);
    const liveNews = [];

    $('a[href*="/information/detail/"]').each((i, elem) => {
      const title = $(elem).text().trim();
      const url = $(elem).attr('href');
      const isLive = LIVE_KEYWORDS.some(k => title.toLowerCase().includes(k.toLowerCase()));
      if (isLive && title) {
        const infoId = url.match(/information_id=(\d+)/)?.[1];
        let dateText = $(elem).find('[class*="date"], time').first().text().trim();
        if (!dateText) {
          dateText = $(elem).closest('li').find('[class*="date"], time').first().text().trim();
        }
        liveNews.push({
          title: title.replace(/\s+/g, ' ').trim(),
          url: url.startsWith('http') ? url : base + url,
          date: dateText,
          infoId
        });
      }
    });

    if (!liveNews.length) return null;

    const latest = liveNews[0];

    const detailRes = await axios.get(latest.url, { headers: _toramHeaders });
    const $detail = cheerio.load(detailRes.data);
    const content = $detail.text();

    const detail = {
      title: latest.title,
      date: latest.date,
      time: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      programs: [],
      presents: false,
      url: latest.url
    };

    const timePatterns = [
      /(\d{1,2}\/\d{1,2}\([A-Za-z]+\)\s+\d{1,2}:\d{2}\s+[AP]M\s+\(JST\/?\s*GMT\+9\))/i,
      /(\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s+[AP]M)/i,
      /Start:\s*(.+?(?:JST|GMT\+9))/i,
      /Time:\s*(.+?(?:JST|GMT\+9))/i
    ];
    for (const pat of timePatterns) {
      const m = content.match(pat);
      if (m) { detail.time = m[1].trim(); break; }
    }

    const iframe = $detail('iframe[src*="youtube"]').first();
    if (iframe.length) {
      detail.youtubeUrl = iframe.attr('src');
    }
    if (!detail.youtubeUrl) {
      $detail('a[href*="youtube.com"], a[href*="youtu.be"]').each((i, el) => {
        const href = $detail(el).attr('href');
        if (href && !detail.youtubeUrl) detail.youtubeUrl = href;
      });
    }
    if (!detail.youtubeUrl) {
      const urlMatch = content.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (urlMatch) detail.youtubeUrl = urlMatch[0];
    }

    if (detail.youtubeUrl) {
      const vidMatch = detail.youtubeUrl.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (vidMatch) detail.thumbnailUrl = `https://img.youtube.com/vi/${vidMatch[1]}/maxresdefault.jpg`;
    } else {
      const bannerImg = $detail('img[src*="banner"], img[src*="live"], .live-banner img').first();
      if (bannerImg.length) {
        let src = bannerImg.attr('src');
        detail.thumbnailUrl = src?.startsWith('http') ? src : base + src;
      }
    }

    const progMatch = content.match(/★:Live Contents([\s\S]*?)(?:Live Viewer Present|BeMMO Show|\*Only the players)/i);
    if (progMatch) {
      detail.programs = progMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('★:') || line.trim().startsWith('・'))
        .map(line => line.replace(/^[★・]\s*:?\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    detail.presents = /viewer present|lucky draw|keyword/i.test(content);

    return detail;
  };

  const _toramGetLiveList = async (lang, limit = 5) => {
    const base = _toramBase(lang);
    const listRes = await axios.get(`${base}/?type_code=event`, { headers: _toramHeaders });
    const $ = cheerio.load(listRes.data);
    const liveList = [];

    $('a[href*="/information/detail/"]').each((i, elem) => {
      const title = $(elem).text().trim();
      const url = $(elem).attr('href');
      const isLive = /live|livestream|viewer present|bemmo/i.test(title);
      if (isLive && liveList.length < limit) {
        const dateText = $(elem).closest('li').find('[class*="date"], time').first().text().trim();
        liveList.push({
          title: title.replace(/\s+/g, ' ').trim(),
          url: url.startsWith('http') ? url : base + url,
          date: dateText
        });
      }
    });
    return liveList;
  };

  const _toramGetShopList = async (lang, limit = 5) => {
    const base = _toramBase(lang);
    try {
      // Ambil list berita shop
      const { base: _, items } = await _toramGetList("shop", lang, limit);
      if (!items.length) return [];

      const results = [];

      for (const item of items) {
        try {
          const detailUrl = base + item.href;
          const detailRes = await axios.get(detailUrl, { headers: _toramHeaders });
          const $d = cheerio.load(detailRes.data);
          const rawText = $d("#news").text() || $d(".infoDetailBox").text() || $d("body").text();

          // Cari tanggal mulai dan selesai (dwibahasa)
          const startPattern = /(?:Mulai|Start)\s*:\s*([^\n]+)/i;
          const endPattern = /(?:Selesai|Berakhir|End|Until)\s*:\s*([^\n]+)/i;

          const startMatch = rawText.match(startPattern);
          const endMatch = rawText.match(endPattern);

          const title = item.title || $d("h1").first().text().trim();
          const start = startMatch ? startMatch[1].trim() : "";
          const end = endMatch ? endMatch[1].trim() : "";

          results.push({ title, start, end });
        } catch (err) {
          // Lewati item yang gagal
          results.push({ title: item.title, start: "", end: "" });
        }
      }

      return results;
    } catch (err) {
      console.error("[_toramGetShopList Error]", err.message);
      return [];
    }
  };

  // =============================================
  const buffAlias = {
    waterres: "waterres", maxmp: "maxmp", pres: "pres", aggro: "+aggro",
    dtefire: "dtefire", dtelight: "dtelight", mbarrier: "mbarrier", windres: "windres",
    pbarrier: "pbarrier", exp: "exp", mres: "magicres", drop: "drop", darkres: "darkres",
    dteearth: "dteearth", maxhp: "maxhp", lightres: "lightres", dtewind: "dtewind",
    str: "str", fracbarrier: "fracbarrier", atk: "atk", watk: "watk", earthres: "earthres",
    dex: "dex", matk: "matk", dodge: "dodge", acc: "acc", dtedark: "dtedark",
    fireres: "fireres", cr: "cr", vit: "vit", int: "int", neutralres: "neutralres",
    dtewater: "dtewater", ampr: "ampr", agi: "agi"
  };
  if (buffAlias[command]) {
    text = buffAlias[command];
    // langsung panggil logika buff
    const foodData = require("./lib/foodbuff.json");
    const items = foodData[text];
    if (items) {
      const msg = `*${text}*\n${items.join("\n")}\n────────────`;
      return reply(msg);
    }
  }

  //Command Handler
  if (isCmd) {
    switch (command) {
      case "menu":
        m.reply(lang.menu(prefix));
        break;

      /* ================ Toram Online Menu ================ */
      case "cwatk":
        if (!q) return reply(lang.format(prefix, command));
        int = parseInt(q);
        proc = eval((int * 110) / 100 + 10);
        str = proc.toString();
        m.reply(str);
        break;

      case "piercer":
      case "pembolong":
        reply(piercerData.piercer());
        break;

      case "owner":
        reply(lang.ownerContact());
        break;

      case "cdmg":
        if (!q) return reply(lang.format(prefix, command));
        if (!q.includes("/"))
          return reply(
            'use "/" as separator!\nex: total STR/total STR on eq/total cd percent/cd flat/LV of skill critical UP\nOr:\n/cdmg 250/5/20/40/10\nDon\'t use space!\n\nPenjelasan:\n- Total Str di personal status\n- Total STR di equipment/avatar\n- Total critical damage % di eq/avatar\n- Total critical damage di eq/avatar\n Level skill Crit. UP(Di skill tempur'
          );
        str = q.split("/")[0];
        strP = q.split("/")[1];
        eq = q.split("/")[2];
        xtall = q.split("/")[3];
        skill = q.split("/")[4];
        strength = parseInt(str);
        strengthPers = parseInt(strP);
        percent = parseInt(eq);
        flat = parseInt(xtall);
        crit = parseInt(skill);
        //RUMUS
        base = 150 + strength / 5;
        cdPers = (base * percent) / 100;
        pasif = (crit / 2 / 100) * 200;
        strPer = (strength * strengthPers) / 100 / 5;
        total = base + cdPers + pasif + strPer + flat;
        rounded = Math.floor(total);
        result = rounded.toString();
        reply(result);
        break;

      case "cb-novip":
        if (!text) return;
        dotPrice = text.replace(/\./g, "");
        price = parseInt(dotPrice);
        fee = Math.floor(price * 0.1);
        profit = price - fee;

        //Indonesia Server
        taxIn = price * 0.2;
        indo = price + taxIn;

        //Chinesse Server 0 tax
        taxCh = price * 0;
        china = price + taxCh;

        //Japan Server
        taxJp = price * 0.03;
        japan = price + taxJp;

        result = `
*Result*: 
Harga: \`\`\`${separate(price)}\`\`\`
Fee: \`\`\`${separate(fee)}\`\`\`
Profit: \`\`\`${separate(profit)}\`\`\`
Global Price: 
- Indonesia: \`\`\`${separate(indo)}\`\`\`
- China: \`\`\`${separate(china)}\`\`\`
- Japan: \`\`\`${separate(japan)}\`\`\`
      `;
        client.sendText(from, result, mek);
        break;

      case "cb-vip":
        if (!text) return;
        dotPrice = text.replace(/\./g, "");
        price = parseInt(dotPrice);
        fee = Math.floor(price * 0.1 * 0.6);

        profit = price - fee;

        //Indonesia Server
        taxIn = price * 0.2;
        indo = price + taxIn;

        //Chinesse Server 0 tax
        taxCh = price * 0;
        china = price + taxCh;

        //Japan Server
        taxJp = price * 0.03;
        japan = price + taxJp;

        result = `
*Result*: 
Harga: \`\`\`${separate(price)}\`\`\`
Fee: \`\`\`${separate(fee)}\`\`\`
Profit: \`\`\`${separate(profit)}\`\`\`
Global Price: 
- Indonesia: \`\`\`${separate(indo)}\`\`\`
- China: \`\`\`${separate(china)}\`\`\`
- Japan: \`\`\`${separate(japan)}\`\`\`
      `;
        client.sendText(from, result, mek);
        break;

      case "cb":
        if (!text) return reply("please input the price!");
        if (isNaN(text)) return reply("Price should be number!");
        teks = "Do you have 30-Day Tickets/VIP?\nOpen button bellow ⬇";
        await client.sendButtonMsg(
          from,
          {
            text: teks,
            footer: global.botName,
            mentions: [m.sender],
            contextInfo: {
              forwardingScore: 10,
              isForwarded: true,
            },
            buttons: [
              {
                buttonId: `${prefix}cb-vip ${text}`,
                buttonText: { displayText: "Yes ✅" },
                type: 1,
              },
              {
                buttonId: `${prefix}cb-novip ${text}`,
                buttonText: { displayText: "No ❌" },
                type: 1,
              },
            ],
          },
          { quoted: m }
        );
        break;

      case "lv":
      case "lvl":
      case "lvling":
      case "leveling": {
        try {
          let lvl = q.split("|")[0];
          let bexp = q.split("|")[1] || "0";
          if (!lvl) return m.reply(lang.format(prefix, command));
          if (q.toLowerCase() === "bs") return reply(lang.bs());
          if (isNaN(lvl) || isNaN(bexp)) return m.reply(lang.format(prefix, command));
          progress("⏳");

          const response = await axios.get(
            `https://coryn.club/leveling.php?lv=${lvl}&gap=7&bonusEXP=${bexp}`,
            {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
              }
            }
          );

          const $ = cheerio.load(response.data);
          const array = [];

          $("article.level-entry").each(function () {
            const level = $(this).find(".level-entry-level").text().trim().replace("Lv ", "");
            const boss = $(this).find(".level-entry-main p:first-child b").text().trim();
            const location = $(this).find(".level-entry-main p:nth-child(2)").text().trim();

            const expLines = [];
            $(this).find(".level-entry-exp p").each(function () {
              const line = $(this).clone();
              // hapus tag <small> agar teks % dan bintang tidak campur
              line.find("small").remove();
              expLines.push(line.text().trim());
            });

            const starLines = [];
            $(this).find(".level-entry-exp p small").each(function () {
              starLines.push($(this).text().trim());
            });

            if (boss && expLines.length > 0) {
              array.push({
                level,
                boss,
                location,
                exp: {
                  fullBreak: expLines[0] || "-",
                  secondBreak: expLines[1] || "-",
                  firstBreak: expLines[2] || "-",
                  noBreak: expLines[3] || "-",
                },
                star: {
                  allBreak: starLines[0] || "",
                  twoBreak: starLines[1] || "",
                  oneBreak: starLines[2] || "",
                  zeroBreak: starLines[3] || "",
                },
              });
            }
          });

          if (array.length === 0) {
            progress("❌");
            return m.reply(`Tidak ada data leveling untuk level *${lvl}*.\nCoba level lain atau cek https://coryn.club/leveling.php`);
          }

          let gb = `*⚔️ Leveling Guide - Level ${lvl}*\n`;
          if (bexp !== "0") gb += `*Bonus EXP:* ${bexp}%\n`;
          gb += `━━━━━━━━━━━━━━━\n`;

          for (const a of array) {
            gb += `\n*Lv ${a.level} - ${a.boss}*\n`;
            gb += `📍 ${a.location}\n`;
            gb += `💠 Full Break: ${a.exp.fullBreak} ${a.star.allBreak}\n`;
            gb += `💠 Two Break:  ${a.exp.secondBreak} ${a.star.twoBreak}\n`;
            gb += `💠 One Break:  ${a.exp.firstBreak} ${a.star.oneBreak}\n`;
            gb += `💠 No Break:   ${a.exp.noBreak} ${a.star.zeroBreak}\n`;
            gb += `───────────────\n`;
          }

          client.sendText(from, gb, mek);
          progress("✔");

        } catch (err) {
          progress("❌");
          console.log("[LVL ERROR]", err.message);
          m.reply(`Error: ${err.message}`);
        }
        break;
      }

      case "item":
      case "items": {
        if (!text) return m.reply(`Format: ${prefix}item <nama item>\nContoh: ${prefix}item Mythriller Blade`);
        try {
          progress("⏳");

          // Cari item via API dulu
          const itemRes = await axios.get(
            `https://coryn.club/api/v1/items.php?name=${encodeURIComponent(text)}`,
            { headers: { "User-Agent": "Mozilla/5.0" } }
          );
          if (!itemRes.data.success || itemRes.data.data.length === 0) {
            progress("❌");
            return m.reply(`Item *${text}* tidak ditemukan!`);
          }
          const items = itemRes.data.data;

          // Ambil detail via API
          const detailRes = await axios.get(
            `https://coryn.club/api/v1/items.php?id=${items[0].id}`,
            { headers: { "User-Agent": "Mozilla/5.0" } }
          );
          const d = detailRes.data.data;

          // Scrape halaman item.php untuk Obtained From
          const pageRes = await axios.get(
            `https://coryn.club/item.php?name=${encodeURIComponent(text)}`,
            { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }
          );
          const $ = cheerio.load(pageRes.data);

          // Ambil data Obtained From
          const obtainedFrom = [];
          const obtainId = `obtain-list-${items[0].id}`;
          $(`#${obtainId} .pagination-js-item`).each(function () {
            const cols = $(this).children("div");
            const monster = $(cols[0]).text().trim().replace(/\s+/g, " ");
            const dye = $(cols[1]).text().trim();
            const map = $(cols[2]).text().trim().replace(/\s+/g, " ");
            if (monster) obtainedFrom.push({ monster, dye, map });
          });

          // Format pesan
          let msg = `*🔍 Item: ${d.name}*\n`;
          msg += `━━━━━━━━━━━━━━━\n`;
          if (items.length > 1) msg += `_Ditemukan ${items.length} item, menampilkan pertama_\n\n`;

          msg += `*📦 Tipe:* ${d.type_label}\n`;
          if (d.meta?.badge) msg += `*🎖️ Badge:* ${d.meta.badge}\n`;
          if (d.meta?.note) msg += `*📝 Catatan:* ${d.meta.note}\n`;
          msg += `*💰 Sell:* ${d.sell > 0 ? d.sell.toLocaleString() + " Spina" : "-"}\n`;
          msg += `*⚗️ Process:* ${d.process > 0 ? d.process.toLocaleString() + " Mana" : "-"}\n`;

          // Stats
          if (d.stats?.length > 0) {
            msg += `\n*📊 Stats:*\n`;
            for (const s of d.stats) {
              msg += `  • ${s.effect_name}: ${s.amount > 0 ? "+" : ""}${s.amount}\n`;
            }
          }

          // Obtained From
          if (obtainedFrom.length > 0) {
            msg += `\n*📍 Obtained From:*\n`;
            const maxShow = Math.min(obtainedFrom.length, 8);
            for (let i = 0; i < maxShow; i++) {
              const o = obtainedFrom[i];
              msg += `  • ${o.monster}\n`;
              msg += `    📌 ${o.map}\n`;
              if (o.dye) msg += `    🎨 Dye: ${o.dye}\n`;
            }
            if (obtainedFrom.length > 8) {
              msg += `  _...dan ${obtainedFrom.length - 8} monster lainnya_\n`;
            }
          } else {
            msg += `\n*📍 Obtained From:* -\n`;
          }

          // List item lain
          if (items.length > 1) {
            msg += `\n*📋 Item lain yang ditemukan:*\n`;
            for (let i = 1; i < Math.min(items.length, 6); i++) {
              msg += `  ${i}. ${items[i].name} ${items[i].type_label}\n`;
            }
            if (items.length > 6) msg += `  _...dan ${items.length - 6} lainnya_\n`;
          }

          m.reply(msg);
          progress("✔");

        } catch (err) {
          progress("❌");
          console.log("[ITEM ERROR]", err.message);
          m.reply("Gagal mengakses Coryn Club!");
        }
        break;
      }

      case "monster":
      case "searchmonster":
      case "cari":
      case "findmob": {
        if (!text) return m.reply(`Format: ${prefix}cari <nama monster>\nContoh: ${prefix}cari Mycodian`);
        try {
          progress("⏳");
          const mobRes = await axios.get(`https://coryn.club/api/v1/monsters.php?name=${encodeURIComponent(text)}`);
          if (!mobRes.data.success || mobRes.data.data.length === 0) {
            progress("❌");
            return m.reply(`Monster *${text}* tidak ditemukan!`);
          }
          const monsters = mobRes.data.data;

          // Ambil detail monster pertama
          const first = monsters[0];
          const detailRes = await axios.get(`https://coryn.club/api/v1/monsters.php?id=${first.id}`);
          const detail = detailRes.data.data;

          let msg = `*🔍 Monster Search: ${text}*\n`;
          msg += `━━━━━━━━━━━━━━━\n`;

          if (monsters.length > 1) {
            msg += `_Ditemukan ${monsters.length} monster, menampilkan yang pertama_\n\n`;
          }

          msg += `*👾 Nama:* ${detail.name}\n`;
          msg += `*📍 Lokasi:* ${detail.map_name}\n`;
          msg += `*⚔️ Tipe:* ${detail.type_label}\n`;
          msg += `*🎮 Mode:* ${detail.mode || "-"}\n`;
          msg += `*📈 Level:* ${detail.level}\n`;
          msg += `*❤️ HP:* ${detail.hp > 0 ? detail.hp.toLocaleString() : "?"}\n`;
          msg += `*✨ EXP:* ${detail.exp > 0 ? detail.exp.toLocaleString() : "?"}\n`;
          msg += `*🌀 Elemen:* ${detail.element_label || "-"}\n`;
          msg += `*🐾 Tameable:* ${detail.tameable ? "Ya" : "Tidak"}\n`;
          if (detail.meta?.badge) msg += `*🎖️ Badge:* ${detail.meta.badge}\n`;
          if (detail.meta?.note) msg += `*📝 Catatan:* ${detail.meta.note}\n`;

          if (detail.drops && detail.drops.length > 0) {
            msg += `\n*💎 Drops:*\n`;
            for (const drop of detail.drops) {
              msg += `  • ${drop.name} ${drop.type_label}\n`;
            }
          } else {
            msg += `\n*💎 Drops:* -\n`;
          }

          if (monsters.length > 1) {
            msg += `\n*📋 Monster lain yang ditemukan:*\n`;
            for (let i = 1; i < Math.min(monsters.length, 5); i++) {
              msg += `  ${i}. ${monsters[i].name} - Lv.${monsters[i].level} (${monsters[i].mode || monsters[i].type_label}) @ ${monsters[i].map_name}\n`;
            }
            if (monsters.length > 5) msg += `  _...dan ${monsters.length - 5} lainnya_\n`;
          }

          m.reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log(err);
          m.reply("Gagal mengakses Coryn Club API!");
        }
      }
        break;
      case "ability":
      case "trait":
      case "abil": {
        const tierLabels = {
          "1": 1, "i": 1, "t1": 1, "tier1": 1, "tier i": 1,
          "2": 2, "ii": 2, "t2": 2, "tier2": 2, "tier ii": 2,
          "3": 3, "iii": 3, "t3": 3, "tier3": 3, "tier iii": 3,
          "4": 4, "iv": 4, "t4": 4, "tier4": 4, "tier iv": 4,
          "5": 5, "v": 5, "t5": 5, "tier5": 5, "tier v": 5,
        };

        if (!text) {
          return m.reply(
            `*🔮 Ability/Trait Search*\n━━━━━━━━━━━━━━━\n` +
            `Format:\n` +
            `  • ${prefix}ability <nama>\n` +
            `  • ${prefix}ability tier <1-5>\n\n` +
            `Contoh:\n` +
            `  • ${prefix}ability blood regen\n` +
            `  • ${prefix}ability fighting power\n` +
            `  • ${prefix}ability tier 3\n` +
            `  • ${prefix}ability vengeful\n\n` +
            `_Source: Phantom's Library Drop Item Special Ability List_`
          );
        }

        const lowerText = text.toLowerCase().trim();

        // Cek kalau input adalah tier filter
        const tierNum = tierLabels[lowerText] ||
          (lowerText.startsWith("tier ") ? tierLabels[lowerText.replace("tier ", "")] : null) ||
          (lowerText.startsWith("t") && !isNaN(lowerText.slice(1)) ? parseInt(lowerText.slice(1)) : null);

        if (tierNum && tierNum >= 1 && tierNum <= 5) {
          const results = abilityDB.getByTier(tierNum);
          const emoji = abilityDB.tierEmoji[tierNum];
          const tierLabel = abilityDB.tierName[tierNum];

          let msg = `${emoji} *Drop Ability - ${tierLabel}*\n`;
          msg += `━━━━━━━━━━━━━━━\n`;
          msg += `_Total: ${results.length} abilities_\n\n`;

          for (const a of results) {
            msg += `• *${a.name}*\n`;
          }

          msg += `\n_Ketik *${prefix}ability <nama>* untuk detail_`;
          return m.reply(msg);
        }

        // Search by keyword
        const results = abilityDB.searchAbility(text);

        if (results.length === 0) {
          return m.reply(`❌ Ability *${text}* tidak ditemukan!\n\nCoba:\n• ${prefix}ability blood\n• ${prefix}ability tier 3\n• ${prefix}ability vengeful`);
        }

        // Kalau exact match / hanya 1 hasil → tampilkan detail
        if (results.length === 1) {
          return m.reply(abilityDB.formatAbility(results[0]));
        }

        // Kalau 2-5 hasil → tampilkan semua dengan detail
        if (results.length <= 5) {
          let msg = `*🔮 Ability Search: "${text}"*\n`;
          msg += `━━━━━━━━━━━━━━━\n`;
          msg += `_Ditemukan ${results.length} ability_\n\n`;
          for (const a of results) {
            msg += abilityDB.formatAbility(a) + "\n\n";
          }
          msg = msg.trimEnd();
          return m.reply(msg);
        }

        // Kalau banyak hasil → tampilkan list ringkas
        let msg = `*🔮 Ability Search: "${text}"*\n`;
        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `_Ditemukan ${results.length} ability_\n\n`;

        for (const a of results) {
          const emoji = abilityDB.tierEmoji[a.tier];
          msg += `${emoji} *${a.name}* (${abilityDB.tierName[a.tier]})\n`;
        }

        msg += `\n_Perjelas pencarian untuk melihat detail_`;
        return m.reply(msg);
      }
      case "regis":
      case "registlet": {
        if (!text) return m.reply(`Format: ${prefix}regis <nama/lokasi>\nContoh: ${prefix}regis accuracy\n${prefix}regis dark dragon`);

        // Cari berdasarkan nama dulu
        let results = searchRegislet(text);

        // Jika tidak ketemu, coba cari berdasarkan lokasi
        if (results.length === 0) {
          results = searchByLocation(text);
        }

        if (results.length === 0) {
          return m.reply(`❌ Registlet *${text}* tidak ditemukan!\n\nCoba cek nama atau lokasi Stoodie.`);
        }

        // Jika hasil > 5, tampilkan list
        if (results.length > 5) {
          let list = `🔍 *Pencarian: "${text}"*\n━━━━━━━━━━━━━━━\n_Ditemukan ${results.length} registlet_\n\n`;
          for (const r of results) {
            list += `• *${r.name}* (Max Lv ${r.maxLv})\n`;
          }
          list += `\n_Ketik *${prefix}regis <nama spesifik>* untuk detail._`;
          return m.reply(list);
        }

        // Tampilkan detail setiap hasil
        for (const r of results) {
          m.reply(formatRegislet(r));
        }
        break;
      }
      case "mt":
      case "torammt":
      case "maintenance": {
        try {
          progress("⏳");
          const data = await _toramGetLatest("update", language);
          if (!data) { progress("❌"); return m.reply("Tidak ada data maintenance!"); }
          let msg = `🔧 *TORAM MAINTENANCE*\n━━━━━━━━━━━━━━━\n`;
          if (data.title) msg += `*📌 ${data.title}*\n`;
          if (data.date) msg += `*📅 ${data.date}*\n`;
          msg += `━━━━━━━━━━━━━━━\n${data.content}\n━━━━━━━━━━━━━━━\n🔗 ${data.url}`;
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[MT ERROR]", err.message);
          m.reply("Gagal mengakses website Toram!\nError: " + err.message);
        }
        break;
      }

      case "toramupdate": {
        try {
          progress("⏳");
          const { base, items } = await _toramGetList("update", language, 5);
          if (!items.length) { progress("❌"); return m.reply("Tidak ada data update!"); }
          let msg = `📢 *TORAM UPDATE - 5 Terbaru*\n━━━━━━━━━━━━━━━\n`;
          for (let i = 0; i < items.length; i++) {
            msg += `\n*${i + 1}.* ${items[i].title || "(no title)"}\n`;
            if (items[i].date) msg += `    📅 ${items[i].date}\n`;
            msg += `    🔗 ${base}${items[i].href}\n`;
          }
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[TORAMUPDATE ERROR]", err.message);
          m.reply("Gagal mengakses website Toram!\nError: " + err.message);
        }
        break;
      }

      case "banner":
      case "toramava":
      case "ava": {
        try {
          progress("⏳");
          const banners = await _toramGetAvatarBanner(language);
          if (banners.length === 0) {
            progress("❌");
            return m.reply("Tidak ditemukan banner avatar saat ini.");
          }
          progress("✔");
          for (const banner of banners) {
            await client.sendMessage(from, {
              image: { url: banner.image },
              caption: `👗 *${banner.title}*\n📅 ${banner.dateStr}`
            }, { quoted: mek });
            await new Promise(r => setTimeout(r, 700));
          }
        } catch (err) {
          progress("❌");
          console.log("[BANNERAVA ERROR]", err.message);
          m.reply(`Gagal: ${err.message}`);
        }
        break;
      }

      case "toramboost":
      case "boost":
      case "dropboost": {
        try {
          progress("⏳");
          const data = await _toramGetLatest("event", language);
          if (!data) { progress("❌"); return m.reply("Tidak ada data boost/event!"); }
          let msg = `🚀 *TORAM BOOST / EVENT*\n━━━━━━━━━━━━━━━\n`;
          if (data.title) msg += `*📌 ${data.title}*\n`;
          if (data.date) msg += `*📅 ${data.date}*\n`;
          msg += `━━━━━━━━━━━━━━━\n${data.content}\n━━━━━━━━━━━━━━━\n🔗 ${data.url}`;
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[BOOST ERROR]", err.message);
          m.reply("Gagal mengakses website Toram!\nError: " + err.message);
        }
        break;
      }

      // ============ TORAM NEWS BY ID ============
      case "toramnews":
      case "tnews": {
        if (!text) return reply(`Gunakan: ${prefix}toramnews <id>\nContoh: ${prefix}toramnews 10194`);
        try {
          progress("⏳");
          const result = await _toramGetNewsById(text.trim(), language);
          if (!result.success) {
            progress("❌");
            return reply(`Gagal mengambil berita ID ${text}\nError: ${result.error}`);
          }
          const caption = `📰 *${result.title}*\n━━━━━━━━━━━━━━━\n${result.content}\n━━━━━━━━━━━━━━━\n🔗 ${result.url}`;
          reply(caption);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[TORAMNEWS ERROR]", err.message);
          m.reply(`Error: ${err.message}`);
        }
        break;
      }

      // ============ TORAM SITE STATUS ============
      case "toramstatus":
      case "tstatus": {
        try {
          progress("⏳");
          const status = await _toramCheckStatus(language);
          if (status.status) {
            reply(`✅ Website Toram Online *UP*\nStatus code: ${status.code}`);
          } else {
            reply(`❌ Website Toram Online *DOWN*\nKode error: ${status.code || status.error}`);
          }
          progress("✔");
        } catch (err) {
          progress("❌");
          m.reply(`Error: ${err.message}`);
        }
        break;
      }

      // ============ LIST AVAILABLE NEWS ============
      case "toramlist":
      case "tlist": {
        try {
          progress("⏳");
          const newsList = await _toramGetAvailableNewsIds(language, 10);
          if (newsList.length === 0) {
            progress("❌");
            return reply("Tidak dapat mengambil daftar berita.");
          }
          let msg = `📋 *10 Berita Terbaru (ID)*\n━━━━━━━━━━━━━━━\n`;
          for (const n of newsList) {
            msg += `• *${n.title}*\n  ID: ${n.id} | ${n.url}\n`;
          }
          msg += `\nGunakan *${prefix}toramnews <id>* untuk baca lengkap.`;
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          m.reply(`Error: ${err.message}`);
        }
        break;
      }

      // ============ BOSS BOOST EVENT ============
      case "bosboost":
      case "boostboss":
      case "bb": {
        try {
          progress("⏳");
          const data = await _toramGetBoostBoss(language);

          if (!data.active) {
            progress("❌");
            if (data.reason === 'expired')
              return reply(`❌ Event Boost Boss sudah berakhir.\n📅 Berakhir pada: ${data.endStr}`);
            else
              return reply(`Tidak ada event Boost Boss yang sedang aktif.`);
          }

          if (!data.bosses || data.bosses.length === 0) {
            progress("❌");
            return reply(`Event: ${data.eventTitle}\n\nGagal mengambil daftar boss. Cek manual:\n${_toramBase(language)}/top/?type_code=event`);
          }

          progress("✔");
          for (const boss of data.bosses) {
            await client.sendMessage(from, {
              image: { url: boss.image },
              caption: boss.fullName
            }, { quoted: mek });
            await new Promise(r => setTimeout(r, 700));
          }

          if (data.endStr) {
            client.sendText(from, `📢 *${data.eventTitle}*\n⏰ Berakhir: ${data.endStr}`, mek);
          }

        } catch (err) {
          progress("❌");
          console.log("[BOSBOOST ERROR]", err.message);
          m.reply(`Gagal mengambil data Boost Boss: ${err.message}`);
        }
        break;
      }

      // ============ LIVE STREAM DETAIL ============
      case "toramlive":
      case "live": {
        try {
          progress("⏳");
          const detail = await _toramGetLiveDetail(language);

          if (!detail) {
            progress("❌");
            return m.reply("Tidak ada info live streaming saat ini.");
          }

          const now = moment().tz("Asia/Jakarta");
          let msgText = `📡 *${detail.title}*\n━━━━━━━━━━━━━━━\n`;
          if (detail.time) msgText += `⏰ Waktu: ${detail.time}\n`;
          if (detail.youtubeUrl) msgText += `▶️ YouTube: ${detail.youtubeUrl}\n`;
          if (detail.programs.length) {
            msgText += `\n📋 Program:\n`;
            detail.programs.forEach((p, i) => msgText += `${i + 1}. ${p}\n`);
          }
          if (detail.presents) msgText += `\n🎁 Viewer Present: Ada!\n`;
          msgText += `\n_${now.format('DD/MM/YYYY HH:mm')} WIB_\n🔗 ${detail.url}`;

          if (detail.thumbnailUrl) {
            await client.sendMessage(from, {
              image: { url: detail.thumbnailUrl },
              caption: msgText
            }, { quoted: mek });
          } else {
            reply(msgText);
          }
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[LIVE ERROR]", err.message);
          m.reply(`Gagal mengambil live stream: ${err.message}`);
        }
        break;
      }

      // ============ LIVE STREAM LIST ============
      case "livelist":
      case "toramlivelist": {
        try {
          progress("⏳");
          const list = await _toramGetLiveList(language, 5);
          if (!list.length) {
            progress("❌");
            return m.reply("Tidak ada live streaming ditemukan.");
          }
          let msg = `📋 *Daftar Live Stream Terbaru*\n━━━━━━━━━━━━━━━\n`;
          list.forEach((l, i) => {
            msg += `\n${i + 1}. ${l.title}\n   📅 ${l.date || '-'}\n   🔗 ${l.url}\n`;
          });
          msg += `\nGunakan *${prefix}live* untuk detail terbaru.`;
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          m.reply(`Error: ${err.message}`);
        }
        break;
      }

      // ============ TORAM SHOP ============
      case "toramshop":
      case "shop": {
        try {
          progress("⏳");
          const shopItems = await _toramGetShopList(language, 5);

          if (!shopItems.length) {
            progress("❌");
            return m.reply("Tidak ada data shop terbaru.");
          }

          let msg = `🛒 *TORAM SHOP TERBARU*\n━━━━━━━━━━━━━━━\n`;
          for (const item of shopItems) {
            msg += `\n📌 *${item.title}*\n`;
            if (item.start) msg += `Mulai: ${item.start}\n`;
            if (item.end) msg += `Selesai: ${item.end}\n`;
          }
          reply(msg);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[SHOP ERROR]", err.message);
          m.reply("Gagal mengakses website Toram!\nError: " + err.message);
        }
        break;
      }

      // ... (kode food buff, sticker, group menu, dll tetap di bawah sini)
      // Karena file lengkap sangat panjang, saya hanya tampilkan bagian Toram yang baru.
      // Semua perintah lain seperti "sticker", "play", "group", dll tetap sama.

      /* ================ Food Buff Commands ================ */
      // (tetap sama seperti file asli, tidak diubah)

      /* ================ Converter Menu ================ */
      // ...

      /* ================ Group Menu ================ */
      // ...
      case "food":
        client.sendText(
          from,
          `
 *List EXP Food Buff*
 lv = Exp Needed
 1 = 1
 2 = 3
 3 = 9
 4 = 21
 5 = 45
 6 = 93
 7 = 189
 8 = 381
 9 = 765
 10 = 1533`,
          mek
        );
        break;

      case "buff": {
        const foodData = require("./lib/foodbuff.json");
        if (!text) {
          const categories = Object.keys(foodData).sort().join(", ");
          return reply(`📋 *Kategori Buff Tersedia*\n${categories}\n\nGunakan *${prefix}buff <kategori>* untuk melihat detail.\nContoh: ${prefix}buff int`);
        }
        const category = text.toLowerCase().trim();
        const items = foodData[category];
        if (!items || items.length === 0) return reply(`❌ Kategori *${category}* tidak ditemukan.`);
        const msg = `*${category}*\n${items.join("\n")}\n────────────`;
        reply(msg);
        break;
      }

      case "addbuff": {
        if (!isOwner) return reply("❌ Hanya owner!");
        if (!text.includes("|")) return reply(`Format: ${prefix}addbuff <kategori>|<teks buff>\nContoh: ${prefix}addbuff int|1234567 + STR`);
        const [cat, ...rest] = text.split("|");
        const item = rest.join("|").trim();
        if (!cat || !item) return reply("Kategori dan isi harus diisi.");
        const foodData = require("./lib/foodbuff.json");
        if (!foodData[cat]) {
          foodData[cat] = [];
        }
        foodData[cat].push(item);
        fs.writeFileSync("./lib/foodbuff.json", JSON.stringify(foodData, null, 2));
        reply(`✅ Berhasil menambahkan ke *${cat}*: ${item}`);
        break;
      }

      case "mqmats":
        mq = lang.mq();
        client.sendText(from, mq, mek);
        break;

      case "maze":
        maze = text;
        if (!maze)
          return reply(
            "masukan query! contoh :\n /maze guide\n/maze build\n/maze drop"
          );
        dbs = await lang.maze(maze);
        client.sendText(from, dbs, mek);
        break;

      case "ailment":
        ail = await lang.ailment();
        client.sendText(from, ail, mek);
        break;

      case "bag":
        bag = await lang.bag();
        client.sendText(from, bag, mek);
        break;
      /* ================ Toram Online Menu ================ */
      /* ================ Converter Menu ================ */
      case "sticker":
      case "s":
      case "stickergif":
      case "sgif":
      case "stiker":
        try {
          ipackName = false;
          iauthor = false;
          if (q.split("|")[0]) {
            ipackName = q.split("|")[0];
          }
          if (q.split("|")[1]) {
            iauthor = q.split("|")[1];
          }
          progress("⏳");
          if (/image/.test(mime)) {
            let media = await client.downloadMediaMessage(qms);
            let encmedia = await client.sendImageAsSticker(
              from,
              media,
              m,
              text.toLowerCase() == "original" ? true : false,
              {
                packname: q.split("|")[0] ? ipackName : global.packName,
                author: q.split("|")[1] ? iauthor : global.author,
              }
            );
            fs.unlinkSync(encmedia);
            progress("✔");
          } else if (/video/.test(mime)) {
            if (qms.seconds > 11) return reply("Max 10 second!");
            let media = await client.downloadMediaMessage(qms);
            let encmedia = await client.sendVideoAsSticker(from, media, m, {
              packname: q.split("|")[0] ? ipackName : global.packName,
              author: q.split("|")[1] ? iauthor : global.author,
            });
            fs.unlinkSync(encmedia);
            progress("✔");
          } else {
            m.reply(lang.unsupported());
          }
        } catch (err) {
          progress("❌");
          console.log(err);
        }

        break;

      case "smeme":
      case "stickmeme":
        try {
          if (!text) return m.reply(lang.format(prefix, command));
          progress("⏳");
          top = encodeURIComponent(q.split("|")[0]);
          bottom = encodeURIComponent(q.split("|")[1]);

          if (
            ((isMedia && !m.message.videoMessage) ||
              isQuotedImage ||
              isQuotedSticker) &&
            args.length > 0
          ) {
            ranp = getRandom("54");
            owgi = await client.downloadAndSaveMediaMessage(qms, ranp);
            options = {
              apiKey: global.imgbb, // MANDATORY

              imagePath: owgi, // OPTIONAL: pass a local file (max 32Mb)

              name: ranp, // OPTIONAL: pass a custom filename to imgBB API

              expiration: 3600 /* OPTIONAL: pass a numeric value in seconds.
  It must be in the 60-15552000 range.
  Enable this to force your image to be deleted after that time. */,
            };

            anu = await imgbb(options);

            teks = `${anu.display_url}`;
            anu1 = `https://api.memegen.link/images/custom/${text.split("|")[1] ? top : " "
              }/${text.split("|")[1] ? bottom : top}.png?background=${teks}`;
            encmedia = await client.sendImageAsSticker(
              from,
              `${anu1}`,
              m,
              false,
              { packname: global.packName, author: global.author }
            );
            fs.unlinkSync(owgi);
            fs.unlinkSync(encmedia);
            progress("✔");
          } else {
            m.reply("please use image/sticker!");
          }
        } catch (err) {
          progress("❌");
          console.log(err);
        }
        break;

      //Proccess MQ
      case "process":
        break;

      /* ================ Media Menu ================ */

      // case "pixiv":
      //   if (!text) return reply(lang.format(prefix, command));
      //   try {
      //     progress("⏳");
      //     res = await axios({
      //       method: "get",
      //       url: `https://api.lolicon.app/setu/v2?keyword=${encodeURIComponent(
      //         text
      //       )}`,
      //       headers: {
      //         DNT: 1,
      //         "Upgrade-Insecure-Request": 1,
      //       },
      //       responseType: "json",
      //     });
      //     if (res.data.error) return progress("❌");
      //     if (res.data.data.length === 0) return reply("Not Found!");
      //     textTemplate = `*Detail:*\n- Title: ${res.data.data[0].title}\n- Author: ${res.data.data[0].author}\nTags:`;
      //     for (let i = 0; i < res.data.data[0].tags.length; i++) {
      //       textTemplate += `\n- ${i + 1}. ${res.data.data[0].tags[i]}`;
      //     }
      //     client.sendImage(
      //       from,
      //       res.data.data[0].urls.original,
      //       textTemplate,
      //       mek
      //     );
      //     progress("✔");
      //   } catch (err) {
      //     progress("❌");
      //     console.log(err);
      //   }
      //   break;

      case "pixiv":
        if (!text) return reply(lang.format(prefix, command));
        try {
          progress("⏳");
          res = await axios({
            method: "get",
            url: `https://api.lolicon.app/setu/v2?keyword=${encodeURIComponent(text)}&r18=0`, // ← hanya non‑R18
            headers: {
              DNT: 1,
              "Upgrade-Insecure-Request": 1,
            },
            responseType: "json",
          });
          if (res.data.error) return progress("❌");
          if (res.data.data.length === 0) return reply("Not Found!");
          const d = res.data.data[0];
          textTemplate = `*Detail:*\n- Title: ${d.title}\n- Author: ${d.author}\nTags:`;
          for (let i = 0; i < d.tags.length; i++) {
            textTemplate += `\n- ${i + 1}. ${d.tags[i]}`;
          }
          client.sendImage(from, d.urls.original, textTemplate, mek);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log(err);
        }
        break;

      case "pokemon": {
        try {
          progress("⏳");
          const pkmn = require("./lib/pokemon-card");
          const card = await pkmn();
          const caption = `${card.name} adalah kartu yang berhasil anda dapat hari ini\n\n🃏 *${card.name}*\n📌 Sumber: ${card.source}\n\n🔗 https://asia.pokemon-card.com/id/deck-build/`;
          await client.sendImage(from, card.imageUrl, caption, mek);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.error(err);
          m.reply("❌ Gagal mengambil kartu Pokemon");
        }
        break;
      }

      case "yugioh": {
        try {
          progress("⏳");
          const ygo = require("./lib/yugioh-card");
          const card = await ygo();
          const desc = card.desc?.length > 200 ? card.desc.substring(0, 200) + "..." : card.desc;
          const caption = `${card.name} adalah kartu yang berhasil anda dapat hari ini\n\n🎴 *${card.name}*\n▸ Tipe: ${card.type}\n▸ Ras: ${card.race}\n▸ Deskripsi: ${desc}\n\n🔗 https://ygoprodeck.com/card-database/?num=100&offset=0`;
          await client.sendImage(from, card.imageUrl, caption, mek);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.error(err);
          m.reply("❌ Gagal mengambil kartu Yugioh");
        }
        break;
      }

      case "pin": {
        if (!text) return reply(`Format: ${prefix}pin <keyword>\nContoh: ${prefix}pin hinata`);
        try {
          progress("⏳");

          let images = [];

          // Coba scraping Pinterest dulu
          try {
            const pinterest = require("./lib/pinterest");
            images = await pinterest(text);
          } catch (e) {
            console.log("[PIN] Pinterest scrape gagal:", e.message);
          }

          // Fallback ke Google Images jika Pinterest gagal
          if (!images || images.length === 0) {
            try {
              const googleImages = require("./lib/google-image");
              images = await googleImages(text);
            } catch (e) {
              console.log("[PIN] Google fallback gagal:", e.message);
            }
          }

          // Fallback ke Unsplash jika masih gagal
          if (!images || images.length === 0) {
            try {
              const unsplash = require("./lib/unsplash");
              images = await unsplash(text);
            } catch (e) {
              console.log("[PIN] Unsplash fallback gagal:", e.message);
            }
          }

          if (!images || images.length === 0) {
            progress("❌");
            return reply("❌ Tidak dapat menemukan gambar untuk kata kunci tersebut.");
          }

          // Pilih gambar random
          const randomImg = images[Math.floor(Math.random() * images.length)];
          await client.sendImage(from, randomImg, `🔍 Pinterest: ${text}`, mek);
          progress("✔");

        } catch (err) {
          progress("❌");
          console.log("[PIN ERROR]", err);
          m.reply("❌ Gagal mengambil gambar, coba lagi nanti.");
        }
        break;
      }

      // case "anime":
      //   try {
      //     progress("⏳");
      //     response = await axios.get(
      //       "https://loli-api.glitch.me/api/v1/twintails"
      //     );
      //     client.sendImage(from, response.data.url, " ", mek);
      //     progress("✔");
      //   } catch (err) {
      //     progress("❌");
      //     console.log(err);
      //   }
      //   break;

      // case "loli":
      //   try {
      //     progress("⏳");
      //     res = await axios({
      //       method: "get",
      //       url: `https://api.lolicon.app/setu/v2?tag=萝莉&r18=${text == "nsfw" ? "1" : "0"
      //         }`,
      //       headers: {
      //         DNT: 1,
      //         "Upgrade-Insecure-Request": 1,
      //       },
      //       responseType: "json",
      //     });
      //     teks = `*Detail:*\n- Title: ${res.data.data[0].title}\n- Author: ${res.data.data[0].author}\nTags:`;
      //     for (let i = 0; i < res.data.data[0].tags.length; i++) {
      //       teks += `\n- ${i + 1}. ${res.data.data[0].tags[i]}`;
      //     }
      //     client.sendImage(from, res.data.data[0].urls.original, teks, mek);
      //     progress("✔");
      //   } catch (err) {
      //     progress("❌");
      //     console.log(err);
      //   }
      //   break;

      case "loli":
        try {
          progress("⏳");
          res = await axios({
            method: "get",
            url: `https://api.lolicon.app/setu/v2?tag=萝莉&r18=0`, // ← selalu non‑R18
            headers: {
              DNT: 1,
              "Upgrade-Insecure-Request": 1,
            },
            responseType: "json",
          });
          if (res.data.error || res.data.data.length === 0) {
            progress("❌");
            return reply("Gambar tidak ditemukan.");
          }
          const d = res.data.data[0];
          teks = `*Detail:*\n- Title: ${d.title}\n- Author: ${d.author}\nTags:`;
          for (let i = 0; i < d.tags.length; i++) {
            teks += `\n- ${i + 1}. ${d.tags[i]}`;
          }
          client.sendImage(from, d.urls.original, teks, mek);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log(err);
        }
        break;

      case "milf":
        try {
          progress("⏳");
          res = await axios({
            method: "get",
            url: `https://api.lolicon.app/setu/v2?tag=milf&r18=0`, // ← selalu non‑R18
            headers: {
              DNT: 1,
              "Upgrade-Insecure-Request": 1,
            },
            responseType: "json",
          });
          if (res.data.error || res.data.data.length === 0) {
            progress("❌");
            return reply("Gambar tidak ditemukan.");
          }
          const d = res.data.data[0];
          teks = `*Detail:*\n- Title: ${d.title}\n- Author: ${d.author}\nTags:`;
          for (let i = 0; i < d.tags.length; i++) {
            teks += `\n- ${i + 1}. ${d.tags[i]}`;
          }
          client.sendImage(from, d.urls.original, teks, mek);
          progress("✔");
        } catch (err) {
          progress("❌");
          console.log(err);
        }
        break;

      // case "milf":
      //   try {
      //     progress("⌛");
      //     let milfs = (
      //       await axios.get(
      //         `https://raw.githubusercontent.com/Arya-was/endak-tau/main/milf.json`
      //       )
      //     ).data;
      //     let milf = milfs[Math.floor(Math.random() * milfs.length)];
      //     let res = await getBuffer(milf);
      //     client.sendImage(from, res, "", mek);
      //     progress("✔");
      //   } catch (err) {
      //     progress("❌");
      //     console.log(err);
      //   }
      //   break;

      case "waifu":
      case "animepic": {
        try {
          progress("⏳");
          const { data } = await axios.get("https://nekos.best/api/v2/waifu", {
            headers: { "User-Agent": "Vertibus (https://github.com/Vertibus-Bot)" }
          });
          if (!data.results?.length) {
            progress("❌");
            return reply("Gagal mengambil gambar waifu.");
          }
          const img = data.results[0];

          // Download dulu jadi buffer
          const imgBuffer = await axios.get(img.url, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Vertibus (https://github.com/Vertibus-Bot)" }
          });

          const caption = `✨ *Waifu*\n` +
            (img.artist_name ? `🎨 Artist: ${img.artist_name}\n` : "") +
            (img.source_url ? `🔗 ${img.source_url}` : "");

          await client.sendMessage(from, {
            image: Buffer.from(imgBuffer.data),
            caption
          }, { quoted: mek });

          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[WAIFU ERROR]", err.message);
          reply("Gagal: " + err.message);
        }
        break;
      }

      case "husbu":
      case "husbando": {
        try {
          progress("⏳");
          const { data } = await axios.get("https://nekos.best/api/v2/husbando", {
            headers: { "User-Agent": "Vertibus (https://github.com/Vertibus-Bot)" }
          });
          if (!data.results?.length) {
            progress("❌");
            return reply("Gagal mengambil gambar husbando.");
          }
          const img = data.results[0];

          const imgBuffer = await axios.get(img.url, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Vertibus (https://github.com/Vertibus-Bot)" }
          });

          const caption = `✨ *Husbando*\n` +
            (img.artist_name ? `🎨 Artist: ${img.artist_name}\n` : "") +
            (img.source_url ? `🔗 ${img.source_url}` : "");

          await client.sendMessage(from, {
            image: Buffer.from(imgBuffer.data),
            caption
          }, { quoted: mek });

          progress("✔");
        } catch (err) {
          progress("❌");
          console.log("[HUSBANDO ERROR]", err.message);
          reply("Gagal: " + err.message);
        }
        break;
      }

      case "brat":
        if (!text) return reply(lang.format(prefix, command));
        try {
          progress("⏳");
          buffer = await getBuffer(
            `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(
              text
            )}&isVideo=false&delay=500`
          );
          client.sendImageAsSticker(from, buffer, mek, false, {
            packname: global.packName,
            author: global.author,
          });
          progress("✔");
        } catch (err) {
          console.error(err);
          progress("❌");
        }
        break;

      case "calculate":
        {
          lvl = parseInt(text.split("|")[0]);
          exp = parseInt(text.split("|")[1].split(" ")[0]);
          startEps = text.split(" ")[1];
          endEps = text.split(" ")[2];
          startMQ = parseInt(startEps.replace("eps", ""));
          endMQ = parseInt(endEps.replace("eps", ""));
          if (isNaN(exp)) return reply(lang.format(prefix, command));
          if (startMQ > endMQ) {
            return reply(
              "can't calculate because the end chapter is too low than the beginning MQ!"
            );
          }
          mqData = JSON.parse(
            fs.readFileSync("./language/Toram-DB/mq-db-eng.json")
          );
          //kondisi !mq 260|38 eps58 eps125
          let lv, percentage;
          [lv, percentage] = calculateMQ(lvl, exp, startMQ, endMQ);
          teksTemplate = `
- *Toram MQ Calculator* -
Start: CH ${mqData[startMQ - 1].chapter}: ${mqData[startMQ - 1].title}
End: CH ${mqData[endMQ - 1].chapter}: ${mqData[endMQ - 1].title}
After doing MQ from *${startEps}* to *${endEps}* you will reach to level ${lv} with ${percentage}%
`;
          reply(teksTemplate);
        }
        break;

      case "mq":
        {
          if (!text) return reply(lang.format(prefix, command));
          lvl = text.split("|")[0];
          if (isNaN(lvl)) return reply(lang.format(prefix, command));
          exp = text.split("|")[1];
          if (!exp) {
            exp = 0;
          }
          MQstart = q.split(" ")[1];
          MQend = q.split(" ")[2];
          let MQmsg;
          let MQcmd = command;
          if (!MQstart) {
            MQmsg = "Select where MQ to *Start*";
          }
          if (MQstart && !MQend) {
            MQmsg = "Select where MQ to *End*";
            MQcmd = "calculate";
          }
          //Hitung kalkulasi exp yang didapat dari start sampai selesai MQ

          const sections = [
            {
              title: `Chapter 1: The Begining of Chaos`,
              highlight_label: `Chapter 1`,
              rows: [
                {
                  title: "EPS1: First Time Visit",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps1`,
                },
                {
                  title: "EPS2: Straye Brother and Sister",
                  description: "Boss: Boss Colon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps2`,
                },
                {
                  title: "EPS3: A Golem on a Rampage",
                  description: "Boss: Excavated Golem",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps3`,
                },
                {
                  title: "EPS4: The Goddess of Wisdom",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps4`,
                },
                {
                  title: "EPS5: The Dragon's Den",
                  description: "Boss: Eerie Crystal",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps5`,
                },
                {
                  title: "EPS6: The Ruined Temple",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps6`,
                },
                {
                  title: "EPS7: The First Magic Stone",
                  description: "Boss: Minotaur",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps7`,
                },
                {
                  title: "EPS8: Purification Incense",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps8`,
                },
                {
                  title: "EPS9: The Dragon and Black Crystal",
                  description: "Boss: Brutal Dragon Decel",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps9`,
                },
              ],
            },
            {
              title: `Chapter 2: Look for Holly Gems!`,
              highlight_label: `Chapter 2`,
              rows: [
                {
                  title: "EPS10: The Merchant Girl",
                  description: "Boss: Mochelo",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps10`,
                },
                {
                  title: "EPS11: Where Are the Gems?",
                  description: "Boss: Flare Volg",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps11`,
                },
                {
                  title: "EPS12: Who is the Black Knight?!",
                  description: "Boss: Ooze",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps12`,
                },
                {
                  title: "EPS13: Trials in the Palace",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps13`,
                },
                {
                  title: "EPS14: The Moon Wizard",
                  description: "Boss: Mauez",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps14`,
                },
                {
                  title: "EPS15: The Follower and Hater",
                  description: "Boss: Ganglef & Demons Gate",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps15`,
                },
                {
                  title: "EPS16: The Wizard's Cave",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps16`,
                },
                {
                  title: "EPS17: The Star Wizard",
                  description: "Boss: Boss Roga",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps17`,
                },
              ],
            },
            {
              title: `Chapter 3: Battle With the Ancient God`,
              highlight_label: `Chapter 3`,
              rows: [
                {
                  title: "EPS18: The Invincible... Enemy??",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps18`,
                },
                {
                  title: "EPS19: The Ancient Empress",
                  description: "Boss: Ancient Empress",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps19`,
                },
                {
                  title: "EPS20: The Culprit",
                  description: "Boss: Masked Warrior",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps20`,
                },
                {
                  title: "EPS21: Fate of the Fortress",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps21`,
                },
                {
                  title: "EPS22: Memory in the Lost Town",
                  description: "Boss: Pillar Golem",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps22`,
                },
                {
                  title: "EPS23: The Stolen Sorcery Gem",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps23`,
                },
                {
                  title: "EPS24: Living with a Dragon",
                  description: "Boss: Grass Dragon Yelb",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps24`,
                },
                {
                  title: "EPS25: Monsters from Outerworld",
                  description: "Boss: Nurethoth",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps25`,
                },
              ],
            },
            {
              title: `Chapter 4: The Creeping Shadows`,
              highlight_label: `Chapter 4`,
              rows: [
                {
                  title: "EPS26: The Mage Diels",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps26`,
                },
                {
                  title: "EPS27: Journey for Reconstruction",
                  description: "Boss: Goldoon (MQ only)",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps27`,
                },
                {
                  title: "EPS28: The Sacred Gem in Akaku",
                  description: "Boss: Goouva",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps28`,
                },
                {
                  title: "EPS29: The King of Darkan",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps29`,
                },
                {
                  title: "EPS30: The Lurking Evil",
                  description: "Boss: Scrader",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps30`,
                },
                {
                  title: "EPS31: Find the False Black Knight!",
                  description: "Boss: Black Knight of Delusion",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps31`,
                },
                {
                  title: "EPS32: Technista's Movement",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps32`,
                },
                {
                  title: "EPS33: The Falling Feather of Death",
                  description: "Boss: Evil Crystal Beast",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps33`,
                },
              ],
            },
            {
              title: `Chapter 5: The Storm in the Darkness`,
              highlight_label: `Chapter 5`,
              rows: [
                {
                  title: "EPS34: In The Unknown Darkness",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps34`,
                },
                {
                  title: "EPS35: The Charm",
                  description: "Boss: Cerberus",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps35`,
                },
                {
                  title: "EPS36: Parching Dark Mirror",
                  description: "Boss: Zolban",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps36`,
                },
                {
                  title: "EPS37: Fierce Battle in the Garden",
                  description: "Boss: Aranea",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps37`,
                },
                {
                  title: "EPS38: A Light in the Darkness",
                  description: "Boss: Bexiz",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps38`,
                },
                {
                  title: "EPS39: The Ones Nesting in the Manor",
                  description: "Boss: Imitator",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps39`,
                },
                {
                  title: "EPS40: The Dark Castle",
                  description: "Boss: Imitacia",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps40`,
                },
                {
                  title: "EPS41: To The Living World",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps41`,
                },
              ],
            },
            {
              title: `Chapter 6: The Two Technistas`,
              highlight_label: `Chapter 6`,
              rows: [
                {
                  title: "EPS42: Demi Machina",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps42`,
                },
                {
                  title: "EPS43: The Town of Pax Faction",
                  description: "Boss: Iconos",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps43`,
                },
                {
                  title: "EPS44: Mechanical Heart",
                  description: "Boss: Ifrid",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps44`,
                },
                {
                  title: "EPS45: Black Knights of Lyark",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps45`,
                },
                {
                  title: "EPS46: The Mysterious Artifact",
                  description: "Boss: Proto Leon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps46`,
                },
                {
                  title: "EPS47: Truth of the Artifact",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps47`,
                },
                {
                  title: "EPS48: The Price of Treachery",
                  description: "Boss: York",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps48`,
                },
                {
                  title: "EPS49: The Blasphemous Factory",
                  description: "Boss: Tyrant Machina",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps49`,
                },
                {
                  title: "EPS50: Mystery of the Black Knights",
                  description: "Boss: Mozto Machina",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps50`,
                },
              ],
            },
            {
              title: `Chapter 7: Upheaval in Ultimea`,
              highlight_label: `Chapter 7`,
              rows: [
                {
                  title: "EPS51: Monster's Forest",
                  description: "Boss: Lalvada",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps51`,
                },
                {
                  title: "EPS52: The Underground Town",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps52`,
                },
                {
                  title: "EPS53: The Elves in Lyark",
                  description: "Boss: Zahhak Machina",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps53`,
                },
                {
                  title: "EPS54: The Mad Laboratory",
                  description: "Boss: Guignol",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps54`,
                },
                {
                  title: "EPS55: Tragedy in the Jail",
                  description: "Boss: Gwaimol",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps55`,
                },
                {
                  title: "EPS56: Calamity in Droma Square",
                  description: "Boss: Ultimate Machina",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps56`,
                },
                {
                  title: "EPS57: Head for Ultimea Palace",
                  description: "Boss: Ornlarf",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps57`,
                },
                {
                  title: "EPS58: The Chaotic Truth",
                  description: "Boss: Venena Coenubia",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps58`,
                },
              ],
            },
            {
              title: `Chapter 8: Road to Eldenbaum`,
              highlight_label: `Chapter 8`,
              rows: [
                {
                  title: "EPS59: The Mine Where Monsters Lurk",
                  description: "Boss: Shampy",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps59`,
                },
                {
                  title: "EPS60: The Mysterious Shadow",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps60`,
                },
                {
                  title: "EPS61: The New Diel Country",
                  description: "Boss: Crystal Titan",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps61`,
                },
                {
                  title: "EPS62: The Ruins of the Gods",
                  description: "Boss: Mom Fluck",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps62`,
                },
                {
                  title: "EPS63: The Former God of Justice",
                  description: "Boss: Zelbuse",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps63`,
                },
                {
                  title: "EPS64: The Remaining Thrones in the Shrine",
                  description: "Boss: Mardula",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps64`,
                },
                {
                  title: "EPS65: Gods' Whereabouts",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps65`,
                },
                {
                  title: "EPS66: The Wait at Specia's Shrine",
                  description: "Boss: Seele Zauga",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps66`,
                },
                {
                  title: "EPS67: The Warden of Ice & Snow",
                  description: "Boss: King Piton",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps67`,
                },
                {
                  title: "EPS68: At Mountains End",
                  description: "Boss: Finstern the Dark Dragon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps68`,
                },
              ],
            },
            {
              title: "Chapter 9: Recapturing Eldenbaum",
              highlight_label: "Chapter 9",
              rows: [
                {
                  title: "EPS69: Deadly Road to Eldenbaum",
                  description: "Boss: Tuscog",
                  id: `${prefix}${MQcmd} ${lvl}|${exp}eps69`,
                },
                {
                  title: "EPS70: Unforseen Trap",
                  description: "Boss: Eroded Pilz",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps70`,
                },
                {
                  title: "EPS71: Traces of Technological Progress",
                  description: "Boss: Pyxtica",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps71`,
                },
                {
                  title: "EPS72: An Unexpected Acquaintance",
                  description: "Boss: Kuzto",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps72`,
                },
                {
                  title: "EPS73: Front Line Base Operation",
                  description: "Boss: Sapphire Roga",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps73`,
                },
                {
                  title: "EPS74: Strategy to Redeem the Treetop Harbor",
                  description: "Boss: Gravicep",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps74`,
                },
                {
                  title: "EPS75: The Teleporter Left Behind",
                  description: "Boss: Repthon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps75`,
                },
                {
                  title: "EPS76: The Man Who Seeks Death",
                  description: "Boss: Vulture",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps76`,
                },
                {
                  title: "EPS77: The Battle to Recapture Eldenbaum",
                  description: "Boss: Venena Meta Coenubia",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps77`,
                },
                {
                  title: "EPS78: A New Beginning",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps78`,
                },
              ],
            },
            {
              title: "Chapter 10: The Lost God's Ship",
              highlight_label: "Chapter 10",
              rows: [
                {
                  title: "EPS79: Off to the Fateful Land",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps79`,
                },
                {
                  title: "EPS80: The Inhabitants Under the Cliff",
                  description: "Boss: Pisteus",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps80`,
                },
                {
                  title: "EPS81: The Nightmare Returns",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps81`,
                },
                {
                  title: "EPS82: The Whereabouts of the Missing Monks",
                  description: "Boss: Arachnidemon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps82`,
                },
                {
                  title: "EPS83: The Goddess of Courage and the Squatters",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps83`,
                },
                {
                  title: "EPS84: Navigator of the Ark",
                  description: "Boss: Black Shadow",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps84`,
                },
                {
                  title: "EPS85: Witch in the Woods",
                  description: "Boss: Hexter",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps85`,
                },
                {
                  title: "EPS86: The Duel in Nov Diela",
                  description: "Boss: Irestida",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps86`,
                },
              ],
            },
            {
              title: "Chapter 11: Off to Toram",
              highlight_label: "Chapter 11",
              rows: [
                {
                  title: "EPS87: Flying the Ark",
                  description: "Boss: Reliza",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps87`,
                },
                {
                  title: "EPS88: Land of the Unknown",
                  description: "Boss: Gemma",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps88`,
                },
                {
                  title: "EPS89: The Strolling Forest",
                  description: "Boss: Ferzen the Rock Dragon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps89`,
                },
                {
                  title: "EPS90: Eumanos the Forest Dwellers",
                  description: "Boss: Junior Dragon Zyvio",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps90`,
                },
                {
                  title: "EPS91: A Sproutling is Born",
                  description: "Boss: War Dragon Turba",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps91`,
                },
                {
                  title: "EPS92: The Blessing-Bearer",
                  description: "Boss: Vlam the Flame Dragon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps92`,
                },
                {
                  title: "EPS93: Intense Battle in Coenubla's Stronghold",
                  description: "Boss: Velum",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps93`,
                },
                {
                  title: "EPS94: The Shadow of a Smoky Mountain",
                  description: "Boss: Oculagsinio",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps94`,
                },
                {
                  title: "EPS95: The Weredragons & the Underground World",
                  description: "Boss: Gordel",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps95`,
                },
              ],
            },
            {
              title: "Chapter 12: The Weredragons' Vital Point",
              highlight_label: "Chapter 12",
              rows: [
                {
                  title: "EPS96: The Sky with a Ceiling",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps96`,
                },
                {
                  title: "EPS97: Rivalry Between Dragons and Weredragons",
                  description: "Boss: Burning Dragon Igneus",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps97`,
                },
                {
                  title: "EPS98: Weredragon Couple and a Baby",
                  description: "Boss: Trickster Dragon Mimyugon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps98`,
                },
                {
                  title: "EPS99: Weredragons Vital Point",
                  description: "Boss: Filrocas",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps99`,
                },
                {
                  title: "EPS100: Intense Battle in Propulsion System",
                  description: "Boss: Wicked Dragon Fazzino",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps100`,
                },
                {
                  title: "EPS101: Discovering a New Technology",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps101`,
                },
                {
                  title: "EPS102: Ark Repair",
                  description: "Boss: Walican",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps102`,
                },
                {
                  title: "EPS103: Weredragon Dispute",
                  description: "Boss: Brass Dragon Reguita",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps103`,
                },
                {
                  title: "EPS104: Cocoon in the Ice Wall",
                  description: "Boss: Dominaredor",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps104`,
                },
              ],
            },
            {
              title: "Chapter 13: The Water Tribe and Coenubia",
              highlight_label: "Chapter 13",
              rows: [
                {
                  title: "EPS105: Underwater Inhabitants",
                  description: "Boss: Zapo",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps105`,
                },
                {
                  title: "EPS106: Water Dome",
                  description: "Boss: Red Ash Dragon Rudish",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps106`,
                },
                {
                  title: "EPS107: Underwater City",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps107`,
                },
                {
                  title: "EPS108: The Thing in the Abandoned District",
                  description: "Boss: Don Profundo",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps108`,
                },
                {
                  title: "EPS109: Shadow from the Abyss",
                  description: "Boss: Vatudo",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps109`,
                },
                {
                  title: "EPS110: The Ruthless Council",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps110`,
                },
                {
                  title: "EPS111: Mysterious Entity in the Little Shrine",
                  description: "Boss: Ragging Dragon Bovinari",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps111`,
                },
                {
                  title: "EPS112: The Great Battle Underwater",
                  description: "Boss: Humida & Torexesa",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps112`,
                },
              ],
            },
            {
              title: "Chapter 14: Mainland Toram",
              highlight_label: "Chapter 14",
              rows: [
                {
                  title: "EPS113: Crisis in the Sky",
                  description: "Boss: Mulgoon",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps113`,
                },
                {
                  title: "EPS114: The Surviving Siblings",
                  description: "Boss: Deformis",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps114`,
                },
                {
                  title: "EPS115: Chaotic Situation",
                  description: "Boss: -",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps115`,
                },
                {
                  title: "EPS116: The Bitter Truth",
                  description: "Boss: Menti",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps116`,
                },
                {
                  title: "EPS117: The Uncouth Rana Prince",
                  description: "Boss: Biskyva",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps117`,
                },
                {
                  title: "EPS118: Mutant Coenubia Village",
                  description: "Boss: Piscruva",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps118`,
                },
                {
                  title: "EPS119: Fierce Battle with Mutant Lixis",
                  description: "Boss: Supreme Evil Crystal Beast",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps119`,
                },
              ],
            },
            {
              title: "Chapter 15: Coenubia's Awakening",
              highlight_label: "Chapter 15",
              rows: [
                {
                  title: "EPS120: Ark Crisis",
                  description: "Boss: Bakuzan",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps120`,
                },
                {
                  title: "EPS121: Coastal Clash",
                  description: "Boss: Rondine",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps121`,
                },
                {
                  title: "EPS122: Unda's Rescue Operation",
                  description: "Boss: Gula the Gourmet",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps122`,
                },
                {
                  title: "EPS123: Unda's Return",
                  description: "Boss: Goudvis",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps123`,
                },
                {
                  title: "EPS124: The Young Man and The Old Tree",
                  description: "Boss: Puiet",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps124`,
                },
                {
                  title: "EPS125: The Village of Lixis",
                  description: "Boss: Gioco",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps125`,
                },
                {
                  title: "EPS126: Visions of a Distant Past",
                  description: "Boss: Baratok",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps126`,
                },
                {
                  title: "EPS127: As the Roots Come to Light",
                  description: "Boss: Doy & Mari",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps127`,
                }
              ],
            },
            {
              title: "Chapter 16: The Royal Dragon Bloodline",
              highlight_label: "Chapter 16",
              rows: [
                {
                  title: "EPS128: Freedos's Thoughts",
                  description: "Boss: Kipina",
                  id: `${prefix}${MQcmd} ${lvl}|${exp} eps128`,
                }
              ],
            },
          ];

          const listMessage = {
            title: "List MQ",
            sections,
          };

          const templateButton = {
            text: MQmsg,
            footer: `_*- ${global.botName} -*_`,
            mentions: [m.sender],
            contextInfo: {
              forwardingScore: 300,
              isForwarded: true,
            },
            buttons: [
              {
                buttonId: "list_button",
                buttonText: {
                  displayText: "List MQ",
                },
                nativeFlowInfo: {
                  name: "single_select",
                  paramsJson: JSON.stringify(listMessage),
                },
                type: 2,
              },
            ],
          };

          await client.sendButtonMsg(from, templateButton, { quoted: m });
        }
        break;

      case "spamadv": {
        // Format: .spamadv <startLevel> <startPercent> <targetLevel> <chapterStart>
        if (!text) return reply(`Format: ${prefix}spamadv <startLv> <start%> <targetLv> <chapterStart>\nContoh: ${prefix}spamadv 120 0 325 10`);
        const args = text.split(" ");
        if (args.length !== 4) return reply("Parameter harus 4: startLv start% targetLv chapterStart");
        let startLv = parseInt(args[0]);
        let startPct = parseInt(args[1]);
        let targetLv = parseInt(args[2]);
        let chapStart = parseInt(args[3]);
        if (isNaN(startLv) || isNaN(startPct) || isNaN(targetLv) || isNaN(chapStart)) return reply("Semua parameter harus angka!");

        const mqData = JSON.parse(fs.readFileSync("./language/Toram-DB/mq-db-eng.json"));
        const costPerEpisode = 500000;

        // Fungsi exp yang diperlukan untuk naik dari level L ke L+1
        const expToNext = (lv) => Math.floor(Math.pow(lv, 4) * 0.025 + lv * 2);

        // Ambil episode mulai dari chapter yang dipilih hingga terakhir
        const episodes = mqData.filter(ep => ep.chapter >= chapStart)
          .sort((a, b) => a.episode - b.episode);
        if (episodes.length === 0) return reply(`Tidak ada episode untuk chapter ≥ ${chapStart}`);

        const totalEpisodes = episodes.length;
        const totalExpPerRun = episodes.reduce((sum, ep) => sum + ep.exp, 0);
        const totalCost = totalEpisodes * costPerEpisode; // bayar sekali untuk seluruh episode

        let currentLv = startLv;
        let currentPct = startPct;
        let runs = 0;
        const progressLines = [];

        // Fungsi menambahkan exp dan mengembalikan level baru
        function addExp(lv, pct, expGain) {
          let expToNextLv = expToNext(lv);
          let expInLevel = Math.floor(expToNextLv * pct / 100);
          let total = expInLevel + expGain;
          while (total >= expToNextLv) {
            total -= expToNextLv;
            lv++;
            expToNextLv = expToNext(lv);
          }
          let newPct = Math.floor((total / expToNextLv) * 100);
          return { lv, pct: newPct };
        }

        while (currentLv < targetLv && runs < 100) {
          runs++;
          let newState = addExp(currentLv, currentPct, totalExpPerRun);
          progressLines.push(`Run ${runs}x → Lv ${newState.lv} (${newState.pct}%)`);
          currentLv = newState.lv;
          currentPct = newState.pct;
        }

        // Hitung cumulative EXP untuk tampilan
        let cumulativeExp = 0;
        for (let i = 1; i < currentLv; i++) {
          cumulativeExp += expToNext(i);
        }
        cumulativeExp += Math.floor(expToNext(currentLv) * currentPct / 100);

        let reached = currentLv >= targetLv ? "Berhasil" : "Gagal";

        let hasil = `Initial State:\n- Start Level : ${startLv} (${startPct}%)\n- Target Level : ${targetLv}\n\n`;
        hasil += `Calculation Result:\n- Runs Needed : ${runs}x\n`;
        hasil += `- Final Level : ${currentLv} (${currentPct}%)\n`;
        hasil += `- Final EXP : ${cumulativeExp.toLocaleString()}\n`;
        hasil += `- Reached : ${reached}\n`;
        hasil += `- Cost skip MQ : ${totalCost.toLocaleString()} spina\n\n`;
        hasil += `Progress Detail:\n${progressLines.join("\n")}\n`;

        reply(hasil);
      }
        break;

      /* ================ Media Menu ================ */
      case "play":
      case "musik":
      case "lagu": {
        if (!text) return m.reply(`Format: ${prefix}play <nama lagu>\nContoh: ${prefix}play Hentikan`);
        try {
          progress("⏳");
          const { exec } = require("child_process");
          const { promisify } = require("util");
          const execAsync = promisify(exec);
          const os = require("os");
          const path = require("path");

          // Search dulu pakai ytsr
          const ytsr = require("ytsr");
          const searchResults = await ytsr(text, { limit: 5 });
          const videos = searchResults.items.filter(i => i.type === "video" && !i.isLive);

          if (videos.length === 0) {
            progress("❌");
            return m.reply(`Lagu *${text}* tidak ditemukan!`);
          }

          const video = videos[0];
          const title = video.title;
          const duration = video.duration;
          const author = video.author?.name || "Unknown";
          const url = video.url;

          // Cek durasi max 10 menit
          if (duration) {
            const parts = duration.split(":").map(Number);
            const totalSeconds = parts.length === 3
              ? parts[0] * 3600 + parts[1] * 60 + parts[2]
              : parts[0] * 60 + parts[1];
            if (totalSeconds > 600) {
              progress("❌");
              return m.reply(`❌ Lagu terlalu panjang!\nMaksimal: *10 menit*\nDurasi *${title}*: ${duration}`);
            }
          }

          // Kirim info dulu
          await client.sendMessage(from, {
            text: `🎵 *Ditemukan!*\n\n*Judul:* ${title}\n*Artis:* ${author}\n*Durasi:* ${duration || "?"}\n\n_Sedang mengunduh..._`
          }, { quoted: mek });

          // Download pakai yt-dlp
          const tmpFile = path.join(os.tmpdir(), `ytdlp_${Date.now()}`);
          const outputFile = `${tmpFile}.mp3`;

          const cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${outputFile}" "${url}"`;

          try {
            await execAsync(cmd, { timeout: 120000 }); // timeout 2 menit
          } catch (dlErr) {
            progress("❌");
            console.log("[YT-DLP ERROR]", dlErr.message);
            return m.reply("❌ Gagal mengunduh. Video mungkin dibatasi atau tidak tersedia.");
          }

          // Cek file ada
          if (!fs.existsSync(outputFile)) {
            progress("❌");
            return m.reply("❌ File audio tidak ditemukan setelah download.");
          }

          // Kirim audio
          const audioBuffer = fs.readFileSync(outputFile);
          await client.sendMessage(from, {
            audio: audioBuffer,
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${title}.mp3`,
          }, { quoted: mek });

          // Hapus file temp
          fs.unlink(outputFile, () => { });
          progress("✔");

        } catch (err) {
          progress("❌");
          console.log("[PLAY ERROR]", err.message);
          m.reply(`❌ Gagal: ${err.message}`);
        }
        break;
      }

      /* ================ Group Menu ================ */
      case "metadata":
        if (!m.isGroup) return reply(lang.onGroup());
        timeUnix = (timeStamp) => {
          months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          date = new Date(timeStamp * 1000);
          year = date.getFullYear();
          month = months[date.getMonth()];
          day = date.getDate();
          hour = date.getHours();
          minute = date.getMinutes();
          second = date.getSeconds();
          time = `${day} ${month} ${year} ${hour}:${minute}:${second}`;
          return time;
        };
        infoGroup = `*- Group Metadata Info -*\n\n*Group ID:* ${groupMetadata.id
          }\n*Group Name:* ${groupName}\n*Name Since:* ${timeUnix(
            groupMetadata.subjectTime
          )}\n*Group Creation:* ${timeUnix(
            groupMetadata.creation
          )}\n*Owner Group:* ${groupMetadata.owner !== undefined
            ? client.getName(groupMetadata.owner)
            : "-"
          }\n*Members:* ${groupMetadata.size} member.\n*Join Approval:* ${groupMetadata.joinApprovalMode ? "Yes" : "No"
          }.\n*Member Add Mode:* ${groupMetadata.memberAddMode ? "Yes" : "No"
          }.\n*Antilink:* ${global.db.groups[groupMetadata.id]?.antilink ? "Yes" : "No"
          }\n*Antilinkgc:* ${global.db.groups[groupMetadata.id]?.antilinkgc ? "Yes" : "No"
          }.\n*Bot open:* ${global.db.groups[groupMetadata.id]?.open ? "Yes" : "No"
          }.\n*Language: ${language == "eng" ? "English" : "Indonesia"}*\n*Disappearing Message:* ${groupMetadata.ephemeralDuration !== undefined
            ? groupMetadata.ephemeralDuration / (24 * 60 * 60) + " Days"
            : "OFF"
          }.\n*Description:*\n${groupMetadata.desc}`;
        reply(infoGroup);
        break;

      case "join":
        if (!isUrl(text))
          return reply(
            "Example:\n\n!join https://chat.whatsapp.com/GhGhNeX8p3MKwc8KsmaWph"
          );
        try {
          progress("⌛");
          groupLink = text.split(" ")[0].split("https://chat.whatsapp.com/")[1];
          await client.groupAcceptInvite(groupLink);
          progress("✔");
        } catch (e) {
          progress("❌");
          console.log(e);
        }
        break;

      case "hidetag":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (!q) return reply(lang.format(prefix, command));
        group = await client.groupMetadata(from);
        members = group.participants;
        mem = [];
        await members.map(async (adm) => {
          mem.push(adm.id.replace("c.us", "s.whatsapp.net"));
        });
        client.sendMessage(from, { text: q, mentions: mem });
        break;

      case "tagall":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        members = groupMetadata.participants;
        mem = [];
        textTemplate = `${text ? text : "Tag all!!"}\n\n`;
        for (let member of members) {
          mem.push(member.id);
          textTemplate += `- @${member.id.split("@")[0]}\n`;
        }
        client.sendMessage(
          from,
          { text: textTemplate, mentions: mem },
          { quoted: m }
        );
        break;

      case "add":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!botAdmin) return reply(lang.botAdmin());
        if (!isGroupAdmins && !groupMetadata.memberAddMode)
          return reply(lang.onAdmin());
        if (!text) return reply(lang.format(prefix, command));
        if (isNaN(text)) return reply("use number!");
        await client.groupParticipantsUpdate(
          from,
          [`${text}@s.whatsapp.net`],
          "add"
        );
        break;

      case "kick":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!botAdmin) return reply(lang.botAdmin());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (m.mentionedJid.length > 0) {
          removePPL = m.mentionedJid;
          await client
            .groupParticipantsUpdate(from, removePPL, "remove")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else if (m.quoted) {
          removePPL = [m.quoted.sender];
          await client
            .groupParticipantsUpdate(from, removePPL, "remove")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else {
          reply("tag/reply member!");
        }
        break;

      case "promote":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!botAdmin) return reply(lang.botAdmin());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (m.mentionedJid.length > 0) {
          promotePPL = m.mentionedJid;
          await client
            .groupParticipantsUpdate(from, promotePPL, "promote")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else if (m.quoted) {
          promotePPL = [m.quoted.sender];
          await client
            .groupParticipantsUpdate(from, promotePPL, "promote")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else {
          reply("tag/reply member!");
        }

        break;

      case "demote":
        if (!m.isGroup) return reply(lang.onGroup());
        if (!botAdmin) return reply(lang.botAdmin());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (m.mentionedJid.length > 0) {
          demotePPL = m.mentionedJid;
          await client
            .groupParticipantsUpdate(from, demotePPL, "demote")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else if (m.quoted) {
          demotePPL = [m.quoted.sender];
          await client
            .groupParticipantsUpdate(from, demotePPL, "demote")
            .then(() => {
              client.sendText(from, "success✔", mek);
            });
        } else {
          reply("tag/reply member!");
        }

        break;

      case "welcome":
        if (!text) return reply("Usage:\n.welcome on\n.welcome off");
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (text.toLowerCase() === "on") {
          if (global.db.groups[groupMetadata.id]?.welcome) return reply("Welcome already on!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { welcome: true };
          } else {
            global.db.groups[groupMetadata.id].welcome = true;
          }
          reply("Welcome message is now ON!");
        }
        if (text.toLowerCase() === "off") {
          if (!global.db.groups[groupMetadata.id]?.welcome) return reply("Welcome already off!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { welcome: false };
          } else {
            global.db.groups[groupMetadata.id].welcome = false;
          }
          reply("Welcome message is now OFF!");
        }
        break;

      case "antilink":
        if (!text) return reply("ON/OFF?");
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (!botAdmin) return reply(lang.botAdmin());
        if (text.toLowerCase() === "on") {
          if (global.db.groups[groupMetadata.id]?.antilink) return reply("Antilink already on!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { antilink: true };
          } else {
            global.db.groups[groupMetadata.id].antilink = true;
          }
          reply("Antilink is now ON!");
        }
        if (text.toLowerCase() === "off") {
          if (!global.db.groups[groupMetadata.id]?.antilink) return reply("Antilink already off!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { antilink: false };
          } else {
            global.db.groups[groupMetadata.id].antilink = false;
          }
          reply("Antilink is now OFF!");
        }
        break;

      case "antilinkgc":
        if (!text) return reply("ON/OFF?");
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());
        if (!botAdmin) return reply(lang.botAdmin());
        if (text.toLowerCase() === "on") {
          if (global.db.groups[groupMetadata.id]?.antilinkgc) return reply("Antilinkgc already on!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { antilinkgc: true };
          } else {
            global.db.groups[groupMetadata.id].antilinkgc = true;
          }
          reply("Antilinkgc is now ON!");
        }
        if (text.toLowerCase() === "off") {
          if (!global.db.groups[groupMetadata.id]?.antilinkgc) return reply("Antilinkgc already off!");
          if (!global.db.groups[groupMetadata.id]) {
            global.db.groups[groupMetadata.id] = { antilinkgc: false };
          } else {
            global.db.groups[groupMetadata.id].antilinkgc = false;
          }
          reply("Antilinkgc is now OFF!");
        }
        break;

      // case "bot": {
      //   if (!m.isGroup) return reply("Perintah ini hanya untuk grup.");
      //   if (!isGroupAdmins) return reply("Hanya admin grup yang bisa mengubah pengaturan bot.");

      //   const groupId = groupMetadata.id;
      //   if (!text) {
      //     const status = global.db.groups[groupId].active ? "✅ ON" : "❌ OFF";
      //     const mode = global.db.groups[groupId].open ? "Public" : "Admin Only";
      //     return reply(
      //       `⚙️ *Status Bot*\n━━━━━━━━━━━━━━━\n` +
      //       `🟢 Aktif: ${status}\n🌐 Mode: ${mode}\n\n` +
      //       `Perintah:\n` +
      //       `${prefix}bot on - Aktifkan bot\n` +
      //       `${prefix}bot off - Nonaktifkan bot\n` +
      //       `${prefix}bot open - Semua member\n` +
      //       `${prefix}bot close - Admin saja`
      //     );
      //   }

      //   const sub = text.toLowerCase().trim();
      //   switch (sub) {
      //     case "on":
      //       global.db.groups[groupId].active = true;
      //       reply("✅ Bot diaktifkan kembali.");
      //       break;
      //     case "off":
      //       global.db.groups[groupId].active = false;
      //       reply("❌ Bot dinonaktifkan. Hanya admin yang bisa mengaktifkan dengan .bot on");
      //       break;
      //     case "open":
      //       global.db.groups[groupId].open = true;
      //       reply("🌐 Bot sekarang bisa digunakan semua member.");
      //       break;
      //     case "close":
      //       global.db.groups[groupId].open = false;
      //       reply("🔒 Bot sekarang hanya bisa digunakan admin grup.");
      //       break;
      //     default:
      //       reply("Subcommand tidak dikenal. Gunakan: on, off, open, close");
      //   }
      //   break;
      // }
      case "bot":
        if (!text) {
          const groupSettings = global.db.groups[groupMetadata.id] || { active: true, open: true };
          return reply(
            `*Status Bot*\n` +
            `━━━━━━━━━━━━━━━\n` +
            `🟢 Aktif: ${groupSettings.active ? "✅ ON" : "❌ OFF"}\n` +
            `🌐 Mode: ${groupSettings.open ? "Public" : "Admin Only"}\n\n` +
            `Perintah:\n` +
            `${prefix}bot on - Aktifkan bot\n` +
            `${prefix}bot off - Nonaktifkan bot\n` +
            `${prefix}bot open - Semua member bisa pakai\n` +
            `${prefix}bot close - Hanya admin`
          );
        }
        if (!m.isGroup) return reply(lang.onGroup());
        if (!isGroupAdmins) return reply(lang.onAdmin());

        const sub = text.toLowerCase().trim();

        if (!global.db.groups[groupMetadata.id]) {
          global.db.groups[groupMetadata.id] = { active: true, open: true };
        }

        if (sub === "on") {
          global.db.groups[groupMetadata.id].active = true;
          reply("✅ Bot diaktifkan di grup ini.");
        } else if (sub === "off") {
          global.db.groups[groupMetadata.id].active = false;
          reply("❌ Bot dinonaktifkan. Ketik /bot on untuk mengaktifkan kembali.");
        } else if (sub === "open") {
          global.db.groups[groupMetadata.id].open = true;
          reply("🌐 Semua member sekarang bisa menggunakan bot.");
        } else if (sub === "close") {
          global.db.groups[groupMetadata.id].open = false;
          reply("🔒 Hanya admin grup yang bisa menggunakan bot.");
        } else {
          reply(`Subcommand tidak dikenal. Gunakan: on, off, open, close`);
        }
        break;
      /* ================ Group Menu ================ */

      /* ================ Other Menu ================ */
      case "owner":
        reply(lang.ownerContact());
        break;

      case "donasi":
      case "donate":
        client.sendImage(
          from,
          fs.readFileSync("./assets/donate-me.jpg"),
          lang.donate(),
          mek
        );
        break;

      case "language":
      case "lang":
      case "bahasa":
        if (!text) return reply(`Your current language is ${global.db.user[user].language}\n\nto change language, use:\n${prefix}language ${global.db.user[user].language == "ind" ? "eng" : global.db.user[user].language == "eng" ? "ind" : "unknow"}\n\nAvailable languages:\n- ind\n- eng\n\nind - indonesia\neng - english`);
        if (["id", "ind", "indonesia", "ind - indonesia"].includes(text.toLowerCase())) {
          global.db.user[user].language = "ind";
        } else if (["en", "eng", "english", "eng - english"].includes(text.toLowerCase())) {
          global.db.user[user].language = "eng";
        } else {
          return reply("Language not found!\n\nAvailable languages:\n- ind\n- eng\n\nind - indonesia\neng - english");
        }
        reply(`Language changed to ${text}`);
        break;

      case "ping":
      case "botstatus":
      case "statusbot":
      case "info":
        const used = process.memoryUsage();
        const cpus = os.cpus().map((cpu) => {
          cpu.total = Object.keys(cpu.times).reduce(
            (last, type) => last + cpu.times[type],
            0
          );
          return cpu;
        });
        const cpu = cpus.reduce(
          (last, cpu, _, { length }) => {
            last.total += cpu.total;
            last.speed += cpu.speed / length;
            last.times.user += cpu.times.user;
            last.times.nice += cpu.times.nice;
            last.times.sys += cpu.times.sys;
            last.times.idle += cpu.times.idle;
            last.times.irq += cpu.times.irq;
            return last;
          },
          {
            speed: 0,
            total: 0,
            times: {
              user: 0,
              nice: 0,
              sys: 0,
              idle: 0,
              irq: 0,
            },
          }
        );
        let timestamp = speed();
        let latensi = speed() - timestamp;
        neww = performance.now();
        oldd = performance.now();
        bio = await client.fetchStatus(botNumber);
        respon = `
  - *${global.botName}* -
  
  _*INFO*_
  *Name:* ${global.botName}.
  *Bio:* ${bio[0].status.status}.
  *last update Bio:* ${moment
            .utc(bio[0].status.setAt)
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DD HH:mm:ss")}.
  *Owner:* ${global.ownerName}.
  *Contact:* wa.me/${global.owner[0]}
  *Private Usage:* ${global.db.private_usage}.
  *Group Usage:* ${global.db.private_usage}.
  *Total usage:* ${global.db.private_usage + global.db.private_usage}.
  *Total user:* ${global.db.user.length}.
  
  Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww
          } _miliseconds_\n\nRuntime : ${runtime(process.uptime())}
  
  💻 Info Server
  RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
  
  _NodeJS Memory Usage_
  ${Object.keys(used)
            .map(
              (key, _, arr) =>
                `${key.padEnd(Math.max(...arr.map((v) => v.length)), " ")}: ${formatp(
                  used[key]
                )}`
            )
            .join("\n")}
  
  ${cpus[0]
            ? `_Total CPU Usage_
  ${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
              .map(
                (type) =>
                  `- *${(type + "*").padEnd(6)}: ${(
                    (100 * cpu.times[type]) /
                    cpu.total
                  ).toFixed(2)}%`
              )
              .join("\n")}
  _CPU Core(s) Usage (${cpus.length} Core CPU)_
  ${cpus
              .map(
                (cpu, i) =>
                  `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(
                    cpu.times
                  )
                    .map(
                      (type) =>
                        `- *${(type + "*").padEnd(6)}: ${(
                          (100 * cpu.times[type]) /
                          cpu.total
                        ).toFixed(2)}%`
                    )
                    .join("\n")}`
              )
              .join("\n\n")}`
            : ""
          }
                  `.trim();
        reply(respon);

        break;

      /* ================ Other Menu ================ */

      /* ================ Owner Menu ================ */
      case "reset":
        {
          if (!isOwner) return reply(lang.owner());
          progress("⏳");
          allDB = global.db.user;
          for (let i = 0; i < allDB.length; i++) {
            allDB[i].latest = false;
          }
          progress("✔");
        }
        break;

      case "clear":
        if (!isOwner) return reply(lang.owner());
        fs.readdir("./tmp", (err, files) => {
          if (err) return console.error(err);
          reply("delete" + files.length + "files.");
          files.forEach((file, index) => {
            fs.unlink(path.join("./tmp", file), (err) => {
              if (err) console.error(err);
              console.log(`File ${file} deleted`);
            });
          });
          progress("✔");
        });
        break;

      default: {
        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith("broadcast")) return;
          if (m.isBaileys) return;
          if (!budy.toLowerCase()) return;
          if (argsLog || (isCmd && !isGroup)) {
            console.log(
              chalk.black(chalk.bgRed("[ ERROR ]")),
              color("command", "turquoise"),
              color(`${prefix}${command}`, "turquoise"),
              color("tidak tersedia", "turquoise")
            );
          } else if (argsLog || (isCmd && isGroup)) {
            console.log(
              chalk.black(chalk.bgRed("[ ERROR ]")),
              color("command", "turquoise"),
              color(`${prefix}${command}`, "turquoise"),
              color("tidak tersedia", "turquoise")
            );
          }
        }
      }
    }

    if (command !== "deleteuser") {
      //Push Database to DB
      if (user === -1) {
        obj = {
          id: senderType,
          language: "ind",
          latest: true,
          date: new Date(),
        };
        global.db.user.push(obj);
        reply(lang.update(pushname));
      } else if (!global.db.user[user].latest) {
        global.db.user[user].latest = true;
        reply(lang.update(pushname));
      }
      if (senderType.includes("s.whatsapp.net")) {
        global.db.private_usage++;
      }
      if (senderType.includes("g.us")) {
        global.db.group_usage++;
      }
    }
  }

  if (budy.startsWith(">")) {
    if (!isOwner) return;
    try {
      console.log("[eval] " + body);
      let evaled = await eval(budy.slice(2));
      if (typeof evalved !== "string") evaled = require("util").inspect(evaled);
      await m.reply(evaled);
    } catch (error) {
      await m.reply(String(error));
    }
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});