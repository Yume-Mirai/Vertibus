exports.menu = (prefix) => {
    return `
❏ *${global.botName} Menu* ❏

 ❏ *Toram Online Menu*
 │•${prefix}lvling
 │•${prefix}mq
 │•${prefix}maze
 │•${prefix}bag
 │•${prefix}ailment
 │•${prefix}cwatk
 │•${prefix}cdmg
 │•${prefix}food
 │•${prefix}monster
 │•${prefix}item
 │•${prefix}piercer
 │•${prefix}ability
 ╰•${prefix}mqmats

 ❏ *Toram News*
 │•${prefix}torammt
 │•${prefix}toramava
 │•${prefix}toramboost
 │•${prefix}toramlive
 ╰•${prefix}toramshop
 

 ❏ *Toram Buff Menu*
 │•${prefix}buff
 │•${prefix}watk
 │•${prefix}waterres
 │•${prefix}maxmp
 │•${prefix}pres
 │•${prefix}aggro
 │•${prefix}dtefire
 │•${prefix}dtelight
 │•${prefix}mbarrier
 │•${prefix}windres
 │•${prefix}pbarrier
 │•${prefix}maxhp
 │•${prefix}dex
 │•${prefix}matk
 │•${prefix}dodge
 │•${prefix}cr
 │•${prefix}vit
 │•${prefix}int
 │•${prefix}str
 │•${prefix}ampr
 │•${prefix}exp
 │•${prefix}drop
 │•${prefix}dteearth
 │•${prefix}fracbarrier
 │•${prefix}neutralres
 │•${prefix}dtedark
 │•${prefix}fireres
 │•${prefix}lightres
 │•${prefix}dtewater
 │•${prefix}acc
 │•${prefix}darkres
 ╰•${prefix}earthres

 ❏ *Media Menu*
 │•${prefix}play
 │•${prefix}sticker
 │•${prefix}smeme
 │•${prefix}pixiv
 │•${prefix}loli
 │•${prefix}milf
 │•${prefix}anime
 │•${prefix}waifu
 │•${prefix}husbu
 │•${prefix}pinterest
 ╰•${prefix}brat

 ❏ *Group Menu*
 │•${prefix}metadata
 │•${prefix}hidetag
 │•${prefix}tagall
 │•${prefix}bot
 │•${prefix}add
 │•${prefix}kick
 │•${prefix}promote
 │•${prefix}demote
 │•${prefix}welcome
 │•${prefix}antilink
 ╰•${prefix}antilinkgc

 ❏ *Bot Menu*
 │•${prefix}owner
 │•${prefix}info
 ╰•${prefix}donate

 💰 *Bantu donasi di :*

 💳 Dana : 085187238716
 💳 GoPay : 085187238716
 💳 ShopeePay : 085187238716
 `
}

exports.ownerContact = () => {
    return `
*Kontak Owner:*

*WhatsApp:* wa.me/${global.owner[0]}
*Facebook:* ${global.facebook}
*Instagram:* ${global.instagram}
`
}

exports.donate = () => {
    return `
💰 *Bantu donasi di :*

💳 Dana : 085187238716
💳 GoPay : 085187238716
💳 ShopeePay : 085187238716
`
}

exports.pricing = () => {
    return `
*List Harga ${global.botName}*

- Sewa : 3k/bulan
- premium : 3k/bulan
- script : pm owner

> Payment: Qris, Dana, Gopay, Shopeepay
`
}

exports.update = (pushname) => {
    return `
*New Update V. 5.4.4a*
Hi ${pushname}.

fitur \`!welcome\` telah ditambahkan fitur tersebut digunakan untuk mengaktifkan/menonaktifkan pesan selamat datang di grup.

*bot masih dalam pengembangan*
harap maklumi jika masih banyak error🙏

*laporkan jika ada fitur error kepada owner*
tanya tanya silahkan pm owner dengan mengetik:
*!owner*
`
}