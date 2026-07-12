const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (query) => {
  const userAgents = [
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ];

  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    const { data } = await axios.get(
      `https://in.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": randomUA,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        timeout: 15000,
      }
    );

    const $ = cheerio.load(data);

    // Pinterest sering menyimpan data gambar di dalam tag <script> JSON
    let images = [];
    
    // Cari di tag <script> yang berisi JSON data
    $("script").each((i, el) => {
      const text = $(el).html();
      if (text && text.includes('"images":')) {
        try {
          // Parse JSON yang ada di dalam tag script
          const jsonData = JSON.parse(text);
          const extractImages = (obj) => {
            if (Array.isArray(obj)) {
              obj.forEach(item => extractImages(item));
            } else if (obj && typeof obj === "object") {
              if (obj.images && obj.images.orig && obj.images.orig.url) {
                images.push(obj.images.orig.url);
              }
              Object.values(obj).forEach(val => extractImages(val));
            }
          };
          extractImages(jsonData);
        } catch (e) {}
      }
    });

    // Jika tidak dapat dari JSON, coba cari di tag img biasa
    if (images.length === 0) {
      $('img[src*="pinimg.com"]').each((i, el) => {
        const src = $(el).attr("src");
        if (src && !src.includes("avatar") && !src.includes("75x75")) {
          // Ubah URL thumbnail ke original jika memungkinkan
          const origSrc = src.replace(/\/\d+x\//, "/originals/");
          images.push(origSrc || src);
        }
      });
    }

    // Hapus duplikat
    images = [...new Set(images)];

    if (images.length === 0) {
      throw new Error("Tidak ada gambar ditemukan");
    }

    return images;
  } catch (err) {
    console.error("[PINTEREST SCRAPE] Error:", err.message);
    throw err;
  }
};