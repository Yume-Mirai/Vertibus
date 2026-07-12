const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function getPinterestCookie() {
  try {
    // Request ke halaman utama Pinterest untuk mendapatkan cookie
    const res = await axios.get("https://www.pinterest.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
      },
      maxRedirects: 5,
      withCredentials: true,
    });

    // Ambil cookie dari header
    const setCookies = res.headers["set-cookie"];
    if (!setCookies || setCookies.length === 0) {
      throw new Error("Tidak ada cookie dari Pinterest");
    }

    let csrftoken = "";
    let pinterestSess = "";

    for (const c of setCookies) {
      const part = c.split(";")[0].trim();
      if (part.startsWith("csrftoken=")) {
        csrftoken = part.split("=")[1];
      } else if (part.startsWith("_pinterest_sess=")) {
        pinterestSess = part.split("=")[1];
      }
    }

    if (!csrftoken || !pinterestSess) {
      throw new Error("Cookie tidak lengkap");
    }

    const cookieString = `csrftoken=${csrftoken}; _pinterest_sess=${pinterestSess};`;

    // Simpan ke file JSON di folder lib
    const filePath = path.join(__dirname, "pinterestCookie.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          cookie: cookieString,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log("[PINTEREST] Cookie updated:", cookieString.substring(0, 30) + "...");
    return cookieString;
  } catch (err) {
    console.error("[PINTEREST] Gagal ambil cookie:", err.message);
    // Fallback ke file cache jika ada
    try {
      const cachePath = path.join(__dirname, "pinterestCookie.json");
      if (fs.existsSync(cachePath)) {
        const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
        console.log("[PINTEREST] Pakai cookie cache dari:", cache.updatedAt);
        return cache.cookie;
      }
    } catch (_) {}
    return null;
  }
}

module.exports = getPinterestCookie;

// Jika dijalankan langsung
if (require.main === module) {
  getPinterestCookie().then(console.log).catch(console.error);
}