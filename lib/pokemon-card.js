const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async () => {
  // 1. Coba scrape halaman deck-build
  try {
    const { data } = await axios.get("https://asia.pokemon-card.com/id/deck-build/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const $ = cheerio.load(data);
    const imgs = [];
    $("img").each((i, el) => {
      const src = $(el).attr("src");
      if (src && src.includes("pokemon-card.com")) imgs.push(src);
    });
    if (imgs.length > 0) {
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      const name = img.split("/").pop().split(".")[0] || "Pokemon Card";
      return { name, imageUrl: img, source: "Deck Build" };
    }
  } catch (_) {}

  // 2. Fallback ke Pokemon TCG API
  const sets = await axios.get("https://api.pokemontcg.io/v2/sets", {
    headers: { "X-Api-Key": "demo" }
  });
  const set = sets.data.data[Math.floor(Math.random() * sets.data.data.length)];
  const cards = await axios.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${set.id}&pageSize=10`, {
    headers: { "X-Api-Key": "demo" }
  });
  const card = cards.data.data[Math.floor(Math.random() * cards.data.data.length)];
  return {
    name: card.name,
    imageUrl: card.images?.large || card.images?.small,
    source: "API"
  };
};