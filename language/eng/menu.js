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
 ╰•${prefix}mqmats
 

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
 ╰•${prefix}earthres

 ❏ *Media Menu*
 │•${prefix}play
 │•${prefix}sticker
 │•${prefix}smeme
 │•${prefix}pixiv
 │•${prefix}loli
 │•${prefix}milf
 │•${prefix}anime
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

 💰 *Donate me on :*

 💳 Dana : 085187238716
 💳 GoPay : 085187238716
 💳 ShopeePay : 085187238716
 `
}

exports.ownerContact = () => {
    return `
*Ownner Contact:*

*WhatsApp:* wa.me/${global.owner[0]}
*Facebook:* ${global.facebook}
*Instagram:* ${global.instagram}
`
}

exports.pricing = () => {
    return `
*price list ${global.botName}*

- rent : 3k/month
- premium : 3k/month
- script : pm owner
- donate

> Payment: Qris, Dana, Gopay, Shopeepay
`
}

exports.donate = () => {
    return `
💰 *Donate me on :*

💳 Dana : 085187238716
💳 GoPay : 085187238716
💳 ShopeePay : 085187238716
`
}

exports.update = (pushname) => {
    return `
*New Update V. 5.4.4a*
Hi ${pushname}.

\`!welcome\` feature has been added this feature is used to enable/disable welcome message in group.

*bot is still under development*
Please understand if there are still many errors🙏

*Report if there is an error feature to the owner*
For questions, please PM the owner by typing:
*!owner*
`
}