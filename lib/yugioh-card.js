const axios = require("axios");

module.exports = async () => {
  const { data } = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=100&offset=0");
  const card = data.data[Math.floor(Math.random() * data.data.length)];
  return {
    name: card.name,
    type: card.type,
    race: card.race,
    desc: card.desc,
    imageUrl: card.card_images[0]?.image_url
  };
};