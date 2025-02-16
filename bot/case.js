require("./config")
const { getGroupAdmins, runtime, fetchJson, getBuffer, jsonformat, delay, sleep } = require('./lib/myfunction')
const { addExif, imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif } = require('./lib/exif')
const { downloadContentFromMessage, generateWAMessageFromContent, proto, toNumber, getMessageFromStore, generateWAMessageContent } = require('baileys')
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const {
  TelegraPh
} = require('./lib/uploader')
const {
  createThumb,
  isUrl,
  fetchBuffer,
  parseCookie,
  metaAudio,
  texted,
  example,
  igFixed,
  ttFixed,
  toTime,
  readTime,
  filename,
  uuid,
  random,
  randomInt,
  formatter,
  formatNumber,
  h2k,
  formatSize,
  getSize,
  isReadableStream,
  getFile,
  color,
  mtype,
  sizeLimit,
  generateLink,
  reload,
  jsonFormat,
  ucword,
  arrayJoin,
  removeItem,
  Styles,
  hitstat,
  socmed,
  matcher,
  toDate,
  timeFormat,
  makeId,
  timeReverse,
  greeting,
  jsonRandom,
  level,
  role,
  filter,
  randomString,
  removeEmojis,
  reSize,
  chatGpt4,
} = require('./lib/functions')
const util = require('util')
const fetch = require('node-fetch')
const { spawn: spawn, exec } = require('child_process')
const colors = require('@colors/colors/safe')
const yts = require("yt-search")


//DATABASE JSON
const MENU_FILE = path.resolve(__dirname + '/database/', 'menu-type.json');






//  Base
module.exports = async (client, m) => {
  try {
    const from = m.key.remoteJid
    const quoted = m.quoted ? m.quoted : m
    const body = (m.mtype === 'conversation' ? m.message.conversation : m.mtype === 'imageMessage' ? m.message.imageMessage.caption : m.mtype === 'videoMessage' ? m.message.videoMessage.caption : m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text : m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype === 'InteractiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id : m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId : m.mtype === 'messageContextInfo' ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.message.InteractiveResponseMessage.NativeFlowResponseMessage || m.text : '');
    var budy = (typeof m.text == 'string' ? m.text : '')
    const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const text = q = args.join(" ")
    const { type } = m
    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    const botNumber = await client.decodeJid(client.user.id)
    const senderNumber = sender.split('@')[0]
    const isCreator = ["6285770017326@s.whatsapp.net", "6283162498175@s.whatsapp.net", botNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    const pushname = m.pushName || `${senderNumber}`
    const isBot = botNumber.includes(senderNumber)

    const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || quoted?.header?.imageMessage?.mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime)
    const qmsg = (quoted.msg || quoted)
    // Group
    const mentionByReply = m.mtype == 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || '' : ''

    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => { }) : ''
    const groupName = m.isGroup ? groupMetadata?.subject : ''
    const participants = m.isGroup ? await groupMetadata.participants : await groupMetadata.participants ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? getGroupAdmins(participants) : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isGroup = m.key.remoteJid.endsWith('@g.us')
    const isChannel = m.key.remoteJid.endsWith('@newsletter')
    const groupOwner = m.isGroup ? groupMetadata.owner : ''
    const isGroupOwner = m.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false
    const isImage = (type === 'imageMessage')
    const isVideo = (type === 'videoMessage')
    const isSticker = (type == 'stickerMessage')
    const isAudio = (type == 'audioMessage')
    const isViewOnce = (type == 'viewOnceMessage')
    const isText = (type === 'conversation' || type === 'extendedTextMessage')
    const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
    const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQuotedViewOnce = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2 ? true : false;
    //Ini Waktu | Waktu adalah emas,maka dari itu sentuh lah rumput.dan jangan nolep dikamar terus,usahakan tu kontol jangan dikocok terus.Lutut ama sikut lu kopong nanti
    const moment = require('moment-timezone')
    const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss")
    if (time2 < "19:00:00") {
      var ucapanWaktu = "Selamat Malam🌃"
    }
    if (time2 < "15:00:00") {
      var ucapanWaktu = "Selamat Sore🌄"
    }
    if (time2 < "11:00:00") {
      var ucapanWaktu = "Selamat Siang🏞️"
    }
    if (time2 < "06:00:00") {
      var ucapanWaktu = "Selamat Pagi🏙️ "
    }
    if (time2 < "23:59:00") {
      var ucapanWaktu = "Selamat Subuh🌆"
    }
    const tanggal = moment().tz("Asia/Jakarta").format("ll")
    const wib = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("HH:mm:ss z")
    const wita = moment(Date.now()).tz("Asia/Makassar").locale("id").format("HH:mm:ss z")
    const wit = moment(Date.now()).tz("Asia/Jayapura").locale("id").format("HH:mm:ss z")
    const salam2 = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a")

    // FUNCTION SEND MESSAGESS
    const sendTextAsButton = (m, text, footer, buttons) => {
      const message = {
        text: text,
        caption: "Shen",
        footer: footer,
        buttons: buttons,
        viewOnce: true,
        headerType: 6,
      };

      client.sendMessage(m.chat, message, { quoted: m });
    };


    const sendImageAsButton = async (image, bodyText, buttonText, buttonCmd) => {
      let imageData;

      if (Buffer.isBuffer(image)) {
        // Jika `image` adalah Buffer
        imageData = { image: image };
      } else if (typeof image === "string" && /^https?:\/\//.test(image)) {
        // Jika `image` adalah URL (string yang diawali dengan http:// atau https://)
        imageData = { image: { url: image } };
      } else {
        throw new Error("Invalid image format. Must be a URL or Buffer.");
      }

      const { imageMessage } = await generateWAMessageContent(imageData, {
        upload: client.waUploadToServer
      });

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: '© Shen - BY: @dev.kyuu' }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: true,
                imageMessage: imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: buttonText,
                      id: buttonCmd
                    })
                  },
                ]
              })
            })
          }
        }
      }, {});

      await client.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id,
        quoted: m
      });
    };

    // Contoh penggunaan
    // generateInteractiveMessage(client, m);



    //FUNCTION
    const getCase = (cases) => {
      return "case  " + `'${cases}'` + fs.readFileSync("./case.js").toString().split('case \'' + cases + '\'')[1].split("break")[0] + "break"
    }
    const loadMenus = () => {
      if (!fs.existsSync(MENU_FILE)) {
        fs.writeFileSync(MENU_FILE, JSON.stringify({ downloader: [], random: [], tools: [], ai: [], group: [], owner: [], sticker: [], main: [] }, null, 2));
      }
      return JSON.parse(fs.readFileSync(MENU_FILE, 'utf-8'));
    };
    const saveMenus = (menus) => {
      fs.writeFileSync(MENU_FILE, JSON.stringify(menus, null, 2));
    };
    let menus = loadMenus();
    const addToMenu = (menuType, command) => {
      if (!menus[menuType]) return false; // Pastikan menuType valid
      if (!menus[menuType].includes(command)) {
        menus[menuType].push(command); // Tambahkan command jika belum ada
        saveMenus(menus); // Simpan ke file
      }
    };
    const showMenu = () => {
      let menuText = ``;

      const formatMenu = (menu) => {
        const totalItems = menu.length;
        return menu
          .map((cmd, index) => {
            if (index === 0) return ` ┌ ◦ .${cmd}`;
            if (index === totalItems - 1) return ` └ ◦ .${cmd}`;
            return ` │ ◦ .${cmd}`;
          })
          .join('\n');
      };

      // Format setiap menu
      const sortedMenus = {}; // Buat objek untuk menyimpan menu yang sudah diurutkan

      // Urutkan setiap kategori menu
      for (const category in menus) {
        sortedMenus[category] = [...menus[category]].sort((a, b) => a.localeCompare(b));
      }

      // Format setiap menu yang sudah diurutkan
      if (sortedMenus.main.length) {
        menuText += `> _*MAIN MENU*_\n`;
        menuText += formatMenu(sortedMenus.main);
      }
      if (sortedMenus.downloader.length) {
        menuText += `\n\n` + `> _*DOWNLOAD MENU*_\n`;
        menuText += formatMenu(sortedMenus.downloader);
      }
      if (sortedMenus.random.length) {
        menuText += `\n\n` + `> _*RANDOM MENU*_\n`;
        menuText += formatMenu(sortedMenus.random);
      }
      if (sortedMenus.tools.length) {
        menuText += `\n\n` + `> _*TOOLS MENU*_\n`;
        menuText += formatMenu(sortedMenus.tools);
      }
      if (sortedMenus.ai.length) {
        menuText += `\n\n` + `> _*AI MENU*_\n`;
        menuText += formatMenu(sortedMenus.ai);
      }
      if (sortedMenus.group.length) {
        menuText += `\n\n` + `> _*GROUP MENU*_\n`;
        menuText += formatMenu(sortedMenus.group);
      }
      if (sortedMenus.owner.length) {
        menuText += `\n\n` + `> _*OWNER MENU*_\n`;
        menuText += formatMenu(sortedMenus.owner);
      }
      if (sortedMenus.sticker.length) {
        menuText += `\n\n` + `> _*STICKER MENU*_\n`;
        menuText += formatMenu(sortedMenus.sticker);
      }

      return menuText.trim();
    }


    //Public dan Self
    if (!client.public) {
      if (!isCreator && !m.key.fromMe) return
    }
    const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));
    const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');
    // Response Addlist
    if (m.isGroup && isAlreadyResponList(m.chat, body.toLowerCase(), db_respon_list)) {
      var get_data_respon = getDataResponList(m.chat, body.toLowerCase(), db_respon_list)
      if (get_data_respon.isImage === false) {
        client.sendMessage(m.chat, { text: sendResponList(m.chat, body.toLowerCase(), db_respon_list) }, {
          quoted: m
        })
      } else {
        client.sendMessage(m.chat, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
          quoted: m
        })
      }
    }

    function rumus(tMatch, tWr, wrReq) {
      let tWin = tMatch * (tWr / 100);
      let tLose = tMatch - tWin;
      let sisaWr = 100 - wrReq;
      let wrResult = 100 / sisaWr;
      let seratusPersen = tLose * wrResult;
      let final = seratusPersen - tMatch;
      return Math.round(final);
    }

    function rumusLose(tMatch, tWr, wrReq) {
      let persen = tWr - wrReq;
      let final = tMatch * (persen / 100);
      return Math.round(final);
    }
    async function dellCase(filePath, caseNameToRemove) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Terjadi kesalahan:', err);
          return;
        }

        const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
        const modifiedData = data.replace(regex, '');

        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
          if (err) {
            console.error('Terjadi kesalahan saat menulis file:', err);
            return;
          }

          console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`);
        });
      });
    }
    const {
      addPremiumUser,
      getPremiumExpired,
      getPremiumPosition,
      expiredPremiumCheck,
      checkPremiumUser,
      getAllPremiumUser,
    } = require('./lib/premiun')
    let premium = JSON.parse(fs.readFileSync('./database/premium.json'))
    const isPremium = isCreator || checkPremiumUser(m.sender, premium)
    expiredPremiumCheck(client, m, premium)

    const rafaelbut = (anu) => {
      const { message, key } = generateWAMessageFromContent(m.chat, {
        interactiveMessage: {
          body: { text: anu },
          footer: { text: `Jenitaa-Autoai` },
          nativeFlowMessage: {
            buttons: [{ text: "Jenitaa" }
            ],
          }
        },
      }, { quoted: { key: { participant: '0@s.whatsapp.net', remoteJid: "0@s.whatsapp.net" }, message: { conversation: `${body}` } } })
      client.relayMessage(m.chat, { viewOnceMessage: { message } }, { messageId: key.id })
    }
    // Console
    if (isGroup && isCmd) {
      console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time2,) + " " + colors.yellow(body) + " " + colors.green("from") + " " + colors.blue(m.chat));
    }

    if (!isGroup && !isChannel && isCmd) {
      console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time2,) + " " + colors.yellow(body) + " " + colors.green("from") + " " + colors.blue(m.chat));
    }
    if (!isGroup && isChannel && isCmd) {
      console.log(colors.green.bold("[Channel]") + " " + colors.brightCyan(time2,) + " " + colors.yellow(body) + " " + colors.green("from") + " " + colors.blue(m.chat));
    }

    //
    const downloadMp3 = async (Link) => {
      try {
        // let yutub = await ytPlayMp3(Link)
        //if (yutub.size < 62914560) {
        await client.sendMessage(m.chat, {
          audio: { url: yutub.audio["128"].url }, mimetype: 'audio/mpeg', contextInfo: {
            forwardingScore: 9999999,
            isForwarded: true,
            externalAdReply: {
              title: "YOUTUBE - PLAY",
              body: yutub.title,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true,
              thumbnailUrl: yutub.thumbnail,
              sourceUrl: Link
            }
          }
        }, { quoted: m })
        /*} else {
        await m.reply(`File audio ( ${bytesToSize(yutub.size)} ), telah melebihi batas maksimum!`)
        }*/
      } catch (err) {
        console.log(colors.red(err))
      }
    }
    const downloadMp4 = async (Link) => {
      try {
        let yutub = await y2matemp4(Link)
        //if (yutub.size < 104857600) {
        const Cap = `*${yutub.title}*\n\nID: ${yutub.vid}`;
        await client.sendMessage(m.chat, { video: { url: yutub.video["360"].url }, caption: Cap, gifPlayback: false }, { quoted: m })
        /*} else {
        await nw(`File video ( ${bytesToSize(yutub.size)} ), telah melebihi batas maksimum!`)
        }*/
      } catch (err) {
        m.reply(`${err}`)
      }
    }

    const fVerif = {
      key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net'
      },
      message: { conversation: `_KyuuDEV Terverifikasi Oleh WhatsApp_` }
    }
    const reply = async (teks) => {
      client.sendMessage(
        from,
        {
          text:
            teks,
          contextInfo:
          {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo:
            {
              newsletterName: 'Jenitaa - Maid',
              newsletterJid: "120363307170529595@g.us",
            }
          }
        },
        { quoted: fVerif }
      )
    }
    const Reply = async (teks) => {
      client.sendMessage(
        from,
        {
          text:
            teks,
          contextInfo:
          {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo:
            {
              newsletterName: 'Jenitaa - Maid',
              newsletterJid: "120363307170529595@g.us",
            }
          }
        },
        { quoted: fVerif }
      )
    }



    const tag = `@${m.sender.split('@')[0]}`
    const totalFitur = () => {
      var mytext = fs.readFileSync("./case.js").toString()
      var numUpper = (mytext.match(/case '/g) || []).length;
      return numUpper
    }

    if (mek.key.id.startsWith('3EB0')) return

    switch (command) {

      case 'menu': {
        addToMenu('main', command)
        let text = `[ *DASHBOARD* ]
⛩️ NameBot: Jenitaa - Maid
⛩️ NameOwner: KyuuDEV
⛩️ TotalFitur: ${totalFitur()}
⛩️ Prefix: [ . ]\n
${showMenu()}`
        client.sendMessage(m.chat, {
          text,
          contextInfo: {
            isForwarded: true,
            mentionedJid: [m.sender],
            businessMessageForwardInfo: {
              businessOwnerJid: global.owner
            },
            forwardedNewsletterMessageInfo: {
              newsletterName: `Jenitaa - Maid`,
              newsletterJid: global.idsal
            },
            externalAdReply: {
              title: `KyuuDEV`,
              body: `Online On ${runtime(process.uptime())}`,
              thumbnailUrl: "https://i.pinimg.com/736x/60/0a/c8/600ac8a1ca02663c9c269b7a11054226.jpg",
              sourceUrl: `api.yuudev.my.id`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
          { quoted: fVerif })
      }
        break
      // DOWNLOADER MENU
      case 'play': case 'play2': {
        addToMenu('downloader', command)
        if (!text) return reply(`*Example :* ${prefix + command} Drunk Text`)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let search = await yts(text)
        let getVidData = search.all[0]

        let buttons = [
          {
            buttonId: `.ytmp3 ${getVidData.url}`,
            buttonText: {
              displayText: 'Download Mp3'
            }
          }
        ]
        let message = {
          image: { url: getVidData.thumbnail },
          caption: `📍 *Title:* ${getVidData.title}\n📖 *Deskripsi:* ${getVidData.description ? getVidData.description : "(Tidak ada deskripsi)"}\n⌛ *Durasi:* ${getVidData.timestamp}`,
          footer: `🌟 *Creator:* ${getVidData.author.name}\n> *KLIK TOMBOL DIBAWAH UNTUK MEMULAI UNDUHAN*`,
          buttons: buttons,
          viewOnce: true,
          headerType: 6,
        };

        await client.sendMessage(m.chat, message, { quoted: m });
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      }
        break
      case 'ytmp3': case 'ytdl': {
        addToMenu('downloader', command)
        if (!text) return reply(`*Example :* ${prefix + command} https://youtu.be/Q49pnA4jsp8?si=u0GPgVXosP0sBYWh`)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let data = await yts(text)
        let duration = data.videos[0]?.seconds;
        if (duration > 330) {
          m.reply('Durasi Audio Terlalu Panjang');
        }

        let getRawAudioData = await fetchJson(`https://rayhanzuck-ytdl.hf.space/yt?query=${text}`)
        let result = getRawAudioData.result
        await client.sendMessage(m.chat, { audio: { url: result.download.audio }, mimetype: 'audio/mpeg' }, { quoted: m })
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

      }
        break
      case 'instagram': case 'ig': case 'igdl': {
        addToMenu('downloader', command)
        if (!text) return m.reply("Mana URL-nya?");
        let regex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|stories|tv|reel)\/([^\/?#&]+)/i;
        if (regex.test(text)) {
          client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

          try {
            let response = await fetchJson('https://api.yuudev.my.id/api/v1/instagram?url=' + text)
            // let response = await igdl(text);
            //  m.reply(response.reply)
            var urls = [];
            for (var item of response.result.url) {
              urls.push(item);
            }

            let totalCount = urls.length; // Mendapatkan jumlah total media
            let i = 0; // Inisialisasi i di luar loop
            m.reply("Checking Mime Type");
            for (var url of urls) {
              // Menentukan tipe konten dan mengirim pesan dengan caption yang benar
              await client.sendFile(m.chat, url, '', '', quoted)
              client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
              i++; // Inkrementasi i setelah setiap iterasi
            }

          } catch (e) {

            console.error(e)

          }

        } else {
          await m.reply('URL yang diberikan bukan URL Instagram.');
        }
      }
        break
      case 'tiktok': case 'tiktokslide': case 'tt': case 'ttdl': {
        addToMenu('downloader', command)
        if (!text) return m.reply(`Mana URL-nya??\nContoh: .tt https://vt.tiktok.com/ZSjHYHwcg/`);
        let tiktokRegex = /^(?:https?:\/\/)?(?:www\.)?(?:vt|tiktok\.com\/)/;
        if (!tiktokRegex.test(text)) {
          return m.reply("URL yang Anda berikan bukan URL Tiktok.");
        }

        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        try {
          let { ttsaveapp } = require('./lib/tiktok')
          let response = await ttsaveapp(text)
          // console.log(response)
          let result = response

          let caption = `${result.caption}

*Author Name: ${result.creator_name}*
*Author Username: ${result.creator_username}*
*Music Name: ${result.music_name}* 
`

          if (response.video) {
            let videoUrl = response.video[0].download_no_wm;
            if (videoUrl) {
              await client.sendFile(m.chat, videoUrl, '', caption, m);
            }
          } else if (response.image && response.image.length > 0) {
            // Kirim pesan gambar
            for (let i = 0; i < response.image.length; i++) {
              let imageUrl = response.image[i];
              await client.sendFile(m.chat, imageUrl, '', caption, m);
            }
          }
          //           let nowmURL = result.data.find(item => item.type === "nowatermark_hd");
          //           if (nowmURL) {
          //             await client.sendFile(m.chat, nowmURL.url, '', caption, m)
          //             client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          //           } else {
          //             for (let i = 0; i < result.data.length; i++) {
          //               if (result.data[i]?.type === 'photo' && result.data[i]?.url) {
          //                 await client.sendFile(m.chat, result.data[i].url, '', caption, m);
          //                 client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
          //               }
          //             }
          //           }
          // for (let i = 0; i < result_url.length; i++) {
          //   await client.sendFile(m.chat, result_url[i].url, '', caption, m)

          // }


        } catch (e) {
          console.error(e)
          reply(`Ada masalah pada server atau *DURASI VIDEO TERLALU PANJANG*`)
        }
      }
        break
      case 'pinterest': case 'pin': {
        addToMenu('downloader', command)
        if (!text) return m.reply(`Petunjuk Penggunaan:
.${command} Hu Tao
.${command} https://id.pinterest.com/pin/291045194689908082/ <video>
.${command} https://id.pinterest.com/pin/154952043424714205 <image>
            `)
        if (/^https?:\/\/.*pin/i.test(text)) {
          let response = await fetchJson('https://api.yuudev.my.id/api/v1/pinterest?url=' + text)
          let result = response.result?.video
            ? response.result?.video
            : response.result?.image;
          let caption = `*Quality:* ${result.quality}\n*Size:* ${result.formattedSize}`
          client.sendFile(m.chat, result.url, '', caption, m)
        } else {
          let response = await fetchJson('https://api.yuudev.my.id/api/v1/pinterest?search=' + text)
          let result = response.result
          client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

          let pinimg = result.map(item => ({
            image: item.image,
            caption: item.caption
          }));
          let getRandomItem = (array) => {
            let randomIndex = Math.floor(Math.random() * array.length); // Pilih indeks acak
            return array[randomIndex]; // Kembalikan elemen acak
          };

          // Mendapatkan item acak
          let randomPin = getRandomItem(pinimg);
          console.log(randomPin)
          await sendImageAsButton(randomPin.image, randomPin.caption, 'Next', `${prefix + command + ' ' + text}`)


          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }
      }
        break
      case 'spotify': case 'spotifydl': case 'sptfydl': {
        addToMenu('downloader', command)
        if (!text) return reply(`Masukkan Link Lagu Spotify Yang Ingin Di Download. Contoh:
.${command} https://open.spotify.com/track/6dOtVTDdiauQNBQEDOtlAB?si=b4d115fbcd734a38 `)
        if (!/^https?:\/\/.*spotify/.test(text)) return reply('URL nya Mana Kak??')
        let response = await fetchJson('https://api.yuudev.my.id/api/v1/spotify?url=' + text)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        await client.sendMessage(m.chat, { audio: { url: response.result.url }, mimetype: 'audio/mpeg', fileName: command + '.mp3' }, quoted)
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      }
        break
      case 'fasebook': case 'facebook': case 'fbdl': case 'fb': {
        addToMenu('downloader', command)
        if (!text) return m.reply("Mana URL-nya?");
        const facebookRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/)/;
        if (!facebookRegex.test(text)) {
          return m.reply("URL yang Anda berikan bukan URL Facebook.");
        }
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        try {
          let response = await fetchJson('https://api.vreden.my.id/api/fbdl?url=' + text)
          let result = response.data.links.hd ? response.data.links.hd : response.data.links.sd
          await client.sendMessage(m.chat, { video: { url: result }, caption: global.mess.success, mimetype: 'video/mp4' }, { quoted: m })
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } catch (e) {
          m.reply(util.format(e));
        }
      }
        break
      // ========================================================================================        
      case 'listcase': {
        addToMenu('main', command)
        let { listCase } = require('./lib/scrapelistCase.js')
        reply(listCase())
      }
        break
      case "get":
        addToMenu('tools', command)
        if (!/^https?:\/\//.test(text))
          return reply("Awali *URL* dengan http:// atau https://");
        const ajg = await fetch(text);
        if (ajg.headers.get("content-length") > 100 * 1024 * 1024 * 1024) {
          throw `Content-Length: ${ajg.headers.get("content-length")}`;
        }
        const contentType = ajg.headers.get("content-type");
        if (contentType.startsWith("image/")) {
          return client.sendMessage(
            m.chat,
            { image: { url: text } },
            "imageMessage",
            text,
            m,
          );
        }
        if (contentType.startsWith("video/")) {
          return client.sendMessage(
            m.chat,
            { video: { url: text } },
            "videoMessage",
            text,
            m,
          );
        }
        if (contentType.startsWith("audio/")) {
          return client.sendMessage(
            m.chat,
            { audio: { url: text } },
            "audioMessage",
            text,
            m,
          );
        }
        let alak = await ajg.buffer();
        try {
          alak = util.format(JSON.parse(alak + ""));
        } catch (e) {
          alak = alak + "";
        } finally {
          reply(alak.slice(0, 65536));
        }
        break;
      case 'public': {
        if (!isCreator) return reply(global.mess.owner)
        client.public = true
        m.reply('*Berhasil Mengubah Ke Penggunaan Publik*')
      }
        break
      case 'self': {
        if (!isCreator) return reply(global.mess.owner)
        client.public = false
        m.reply('*Sukses Berubah Menjadi Pemakaian Sendiri*')
      }
        break
      case 'backup':
        if (!isCreator) return reply(global.mess.owner)
        if (m.isGroup) return reply(global.mess.private)
        addToMenu('owner', command)
        reply(mess.wait)
        await new Promise((resolve, reject) => {
          exec('zip -r backup.zip . -x tmp/\\* session/\\* node_modules/\\* "[0-9]*/\\*"', (error, stdout, stderr) => {
            if (error) {
              console.error('Error during backup:', stderr);
              reject(error);
            }
            console.log('Backup complete:', stdout);
            resolve();
          });
        });
        let malas = await fs.readFileSync('./backup.zip')
        await client.sendMessage(m.chat, {
          document: malas,
          mimetype: 'application/zip',
          fileName: 'backup.zip'
        }, {
          quoted: m
        })
        break
      case 'delcase': {
        addToMenu('owner', command)
        if (!isCreator) return reply(`*Access Denied ❎*\n\n*Owners only*`)
        if (!q) return reply('*Masukan nama case yang akan di hapus*')

        dellCase('./case.js', q)
        reply('*Dellcase Successfully*\n\n© Dellcase By KyuuDEV')
      }
        break
      case 'getcaze':
      case 'getcase':
        try {
          if (!m.key.fromMe && !isCreator) return m.reply(global.mess.owner)
          if (!text) return m.reply("*Mau nyari Case apa kak*")
          if (text.startsWith(prefix)) return m.reply("Query tidak boleh menggunakan prefix")
          let nana = await getCase(text)
          m.reply(nana)
        } catch (err) {
          console.log(err)
          m.reply(`Case ${q} tidak di temukan`)
        }
        break
      // ===============< sticker >=============== //
      case 'sticker': case 'stiker': case 's': {
        addToMenu('sticker', command)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        if (!quoted) return m.reply(`Balas Video/Image Dengan Caption ${prefix + command}`)
        if (/image/.test(mime)) {
          let media = await quoted.download()
          await client.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.namebot })
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
          // await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return m.reply('Maksimal 10 detik!')
          let media = await quoted.download()
          await client.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.namebot })
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
          // await fs.unlinkSync(encmedia)
        } else {
          return m.reply(`Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`)
        }
      }
        break
      // ===================================== //
      case 'smeme': {
        addToMenu('sticker', command)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let respond = `Kirim/m.reply image/sticker dengan caption ${prefix + command} text1|text2`
        if (!/image/.test(mime)) return m.reply(respond)
        if (!text) return m.reply(respond)


        let q = m.quoted ? m.quoted : m
        atas = text.split('|')[0] ? text.split('|')[0] : '-'
        bawah = text.split('|')[1] ? text.split('|')[1] : '-'
        let name = quoted?.fileName

        let dwnld = await client.downloadAndSaveMediaMessage(q, name)
        let fatGans = await TelegraPh(dwnld)

        let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(bawah)}/${encodeURIComponent(atas)}.png?background=${fatGans}`
        console.log(smeme)
        await client.sendImageAsSticker(m.chat, smeme, m, { packname: global.packname, author: global.auhor })

        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

      }
        break
      // ===================================== //
      case 'swm': case 'colong': case 'wm': {
        addToMenu('sticker', command)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let [teks1, teks2] = text.split('|').length > 1 ? text.split('|') : [text, '-'];
        if (!text) return m.reply(`Kirim/m.reply image/video dengan caption ${prefix + command} teks1|teks2`)
        if (/image/.test(mime)) {
          let media = await client.downloadMediaMessage(qmsg)
          await client.sendImageAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
          // await fs.unlinkSync(encmedia)
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11) return m.reply('Maksimal 10 detik!')
          let media = await client.downloadMediaMessage(qmsg)
          await client.sendVideoAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
          // await fs.unlinkSync(encmedia)
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
          return m.reply(`Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`)
        }
      }
        break
      // ===================================== //
      case 'addcase': {
        addToMenu('owner', command)
        if (!isCreator) return reply('lu sapa asu')
        if (!text) return reply('Mana case nya');
        const fs = require('fs');
        const namaFile = 'case.js';
        const caseBaru = `${text}`;
        fs.readFile(namaFile, 'utf8', (err, data) => {
          if (err) {
            console.error('Terjadi kesalahan saat membaca file:', err);
            return;
          }
          const posisiAwalGimage = data.indexOf("case 'addcase':");

          if (posisiAwalGimage !== -1) {
            const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
            fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
              if (err) {
                reply('Terjadi kesalahan saat menulis file:', err);
              } else {
                reply('Case baru berhasil ditambahkan.');
              }
            });
          } else {
            reply('Tidak dapat menambahkan case dalam file.');
          }
        });

      }
        break
      case 'totalfitur':
      case 'totalfeature': {
        addToMenu('main', command)
        let fitur = `
*TOTAL FEATURE*

• BerJumlah ${totalFitur()} Fitur\n*Tipe :* Case

Silahkan ketik *.menu* untuk
Menampilkan menu utama`
        reply(fitur)
      }
        break
      //========================================//
      // TOOLS MENU //
      case 'q': case 'quoted': {
        addToMenu('tools', command)
        if (!m.quoted) return m.reply('Reply the Message!!')
        let quotx = await client.serializeM(await m.getQuotedObj())
        console.log(quotx)
        if (!quotx.quoted) return reply('Pesan yang Anda balas tidak dikirim oleh bot')
        await quotx.quoted.copyNForward(m.chat, true)
      }
        break
      case 'rvo': case 'readvo': case 'readviewonce': {
        addToMenu('tools', command)
        if (!m.quoted) return reply(`_Reply to Any ViewOnce._`)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let msg = m.quoted
        if (msg.viewOnce) {
          let media = await client.downloadMediaMessage(qmsg)
          await client.sendFile(m.chat, media, '', msg.text || '', m)
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
          await sleep(2000)
          client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
          m.reply('_Maaf Kak, itu bukan Pesan Sekalii lihat/ViewOnce_')
        }
      }
        break
      case 'toimg': case 'toimage': {
        addToMenu('tools', command)
        let getRandom = (ext) => {
          return `${Math.floor(Math.random() * 10000)}${ext}`
        }
        if (!m.quoted) return reply(`_Reply to Any Sticker._`)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let mime = m.quoted.mtype
        if (mime == "imageMessage" || mime == "stickerMessage") {
          let media = await client.downloadAndSaveMediaMessage(m.quoted)

          let name = getRandom('.png')
          exec(`ffmpeg -i ${media} ${name}`, (err) => {
            fs.unlinkSync(media)
            let buffer = fs.readFileSync(name)
            client.sendMessage(m.chat, { image: buffer }, { quoted: m })
            client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            fs.unlinkSync(name)
          })

        } else return reply(`Please reply to non animated sticker`)
      }
        break
      case 'txt2img': {
        addToMenu('tools', command)
        if (!text) return reply('Example: .txt2img Prompt')
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let anu = `https://api.vreden.my.id/api/text2img?query=${text}`
        await client.sendMessage(m.chat, { image: { url: anu }, caption: `*< Success >*\n\n*Prompt :* ${text}` }, { quoted: fVerif })
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }
        break
      case 'nobg': case 'removebg': {
        addToMenu('tools', command)
        if (!quoted) return m.reply(`Balas Image Dengan Caption ${prefix + command}`)
        if (!/image/.test(mime)) return m.reply('hanya support gambar')
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let getMedia = await client.downloadAndSaveMediaMessage(quoted)
        let getURLMedia = await TelegraPh(getMedia)
        let response = await fetchJson('https://api.yuudev.my.id/api/v1/removebg?image=' + getURLMedia)
        // await sleep(4000)
        let imageURL = response.result.url
        client.sendMessage(m.chat, { image: { url: imageURL }, caption: global.mess.success })
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }
        break
      case 'up': case 'tourl': case 'upload': {
        addToMenu('tools', command)
        if (!quoted) return m.reply(`Balas Dengan Caption ${prefix + command}`)
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let getMedia = await client.downloadAndSaveMediaMessage(quoted)
        let getURLMedia = await TelegraPh(getMedia)
        m.reply(getURLMedia)
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }
        break
      case 'reducesize': case 'reduce': case 'reducevideo': {
        addToMenu('tools', command)
        if (!quoted) return m.reply(`Balas Image Dengan Caption ${prefix + command}`)
        if (!/video/.test(mime)) return m.reply('hanya support video')
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let getMedia = await client.downloadAndSaveMediaMessage(quoted)
        let getURLMedia = await TelegraPh(getMedia)
        let { getInputJobsQueue } = require('./lib/online-convert')
        let response = await getInputJobsQueue(getURLMedia)
        await client.sendFile(m.chat, response, '', '', m)
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }
        break
      case 'remini': case 'hd': {
        addToMenu('tools', command)
        if (!quoted) return m.reply(`Balas Image Dengan Caption ${prefix + command}`)
        if (!/image/.test(mime)) return m.reply('hanya support gambar')
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
        let getMedia = await client.downloadAndSaveMediaMessage(quoted)
        let getURLMedia = await TelegraPh(getMedia)
        let response = await fetchJson('https://api.yuudev.my.id/api/v1/remini?image=' + getURLMedia + '&method=enhance')
        // console.log(response.result)
        await sleep(2000)
        let image = Buffer.from(response.result.data)
        await sendImageAsButton(image, global.mess.success, 'Tingkatkan lagi', `${prefix + command}`)
        // await client.sendMessage(m.chat, { image: image, caption: global.mess.success })
        client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      }
        break
      //========================================//
      case 'gantifile': case "gfl": {
        addToMenu('owner', command)
        if (!isCreator) return reply(global.mess.owner)
        if (!text.includes("./")) return reply(`*• Example* : ${prefix + command} ./package.json`)
        let files = fs.readdirSync(text.split(m.quoted.fileName)[0])
        if (!files.includes(m.quoted.fileName)) return reply("File not found")
        let media = await downloadContentFromMessage(m.quoted, "document")
        let buffer = Buffer.from([])
        for await (const chunk of media) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(text, buffer)
        reply(`Mengupload`)
        await sleep(2000)
        reply(`Berhasil mengganti file ${q}`)
      }
        break
      case 'del':
        addToMenu('group', command)
        if (!mentionByReply) return m.reply("Reply pesan")
        if (mentionByReply == botNumber) {
          client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
          client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: mentionByReply } })
          await new Promise(resolve => setTimeout(resolve, 1000));
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else if (mentionByReply !== botNumber && isBotAdmins) {
          client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
          client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: mentionByReply } })
          await new Promise(resolve => setTimeout(resolve, 1000));
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        }
        break
      case 'linkgroup': case 'linkgc': case 'link': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) reply(mess.botAdmin)
        let response = await client.groupInviteCode(m.chat)
        reply(`https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`, m, { detectLink: true })
      }
        break
      case 'kick': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) return reply(mess.botAdmin)
        if (!isAdmins) return reply(mess.admin)
        let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
        await client.groupParticipantsUpdate(m.chat, users, 'remove').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
        reply('*_Success ✅_*')
      }
        break
      case 'add': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) return reply(mess.botAdmin)
        if (!isAdmins) return reply(mess.admin)
        let input = m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : args[0] ? `${args[0].replace(/ /g, '')}@s.whatsapp.net` : false;
        if (!input) return m.reply('Silahkan tag / reply target')
        const p = await client.onWhatsApp(input.trim())
        if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp')
        const jid = client.decodeJid(p[0].jid)
        const meta = await client.groupMetadata(m.chat)
        const member = meta.participants.find(u => u.id == jid)
        if (member?.id) return m.reply('Target sudah masuk di grup!!')
        const resp = await client.groupParticipantsUpdate(
          m.chat,
          [jid],
          'add',
        );
        for (let res of resp) {
          if (res.status == 421) {
            m.reply(res.content.content[0].tag)
          }
          if (res.status == 408) {
            await m.reply(`Link grup berhasil dikirim ke @${parseInt(
              res.jid,
            )} karena baru saja keluar grup!!`, {
              mentions: [res.jid],
            });
            await client.sendMessage(res.jid, {
              text:
                "https://chat.whatsapp.com/" +
                (await client.groupInviteCode(m.chat)),
            });
          }
          if (res.status == 403) {
            await m.reply(`Pesan invite grup telah dikirim ke @${parseInt(res.jid)}`);
            const { code, expiration } = res.content.content[0].attrs;
            const pp = await client.profilePictureUrl(m.chat).catch(() => null);
            const gp = await client.getFile(pp)
            const msgs = generateWAMessageFromContent(
              res.jid,
              proto.Message.fromObject({
                groupInviteMessage: {
                  groupJid: m.chat,
                  inviteCode: code,
                  inviteExpiration: toNumber(expiration),
                  groupName: await client.getName(m.chat),
                  jpegThumbnail: gp ? gp.data : null,
                  caption: "Invitation to join my WhatsApp group",
                },
              }),
              { userJid: client.user.jid },
            );
            await client.sendMessage(res.jid, { forward: msgs });
          }
        }
        reply('*_Success ✅_*')
      }
        break
      case 'promote': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) return reply(mess.botAdmin)
        if (!isAdmins) return reply(mess.admin)
        let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
        await client.groupParticipantsUpdate(m.chat, users, 'promote').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
        reply('*_Success ✅_*')
      }
        break
      case 'demote': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) return reply(mess.botAdmin)
        if (!isAdmins) return reply(mess.admin)
        let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
        await client.groupParticipantsUpdate(m.chat, users, 'demote').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
        reply('*_Success ✅_*')
      }
        break
      case 'tagall': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isBotAdmins) return reply(mess.botAdmin)
        if (!isAdmins) return reply(mess.admin)
        let teks = `══✪〘 *👥 Tag All* 〙✪══
 
➲ *Pesan : ${q ? q : 'kosong'}*\n\n`
        for (let mem of participants) {
          teks += `⭔ @${mem.id.split('@')[0]}\n`
        }
        client.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
      }
        break
      // ===================================================== //
      // AI MENU //        
      case 'autoai': {
        addToMenu('ai', command)
        if (!text) throw `*• Example:* .autoai *[on/off]*`;
        if (text == "on") {
          client.elxyz[m.chat] = {
            pesan: []
          }
          m.reply("[ ✓ ] Success create session chat")
        } else if (text == "off") {
          delete client.elxyz[m.chat]
          m.reply("[ ✓ ] Success delete session chat")
        }
      }
        break
      case 'copilot': case 'bingai': case 'microsoftai': {
        addToMenu('ai', command)
        let qwery = text + ' ' + (m.quoted && m.quoted.text ? m.quoted.text : '');
        if (!qwery) return m.reply('Mau cari apa kak??')
        const isImageReply = m.quoted && m.quoted.mimetype && m.quoted.mimetype.startsWith('image/');
        let url = `https://api-v2.yuudev.my.id/api/v1/ai/copilot?text=${encodeURIComponent(qwery)}`;
        if (isImageReply) {
          // Jika reply berisi gambar, proses URL dengan image
          const getMedia = await client.downloadAndSaveMediaMessage(m.quoted);
          const getURLMedia = await TelegraPh(getMedia);
          url += `&image=${encodeURIComponent(getURLMedia)}`;
        }

        try {
          const response = await fetchJson(url);
          m.reply(response.result);
        } catch (error) {
          console.error('Error:', error);
          m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
      }
        break

      case 'ai': case 'gpt4': case 'chatgpt': {
        addToMenu('ai', command);
        let qwery = q + ' ' + (m.quoted && m.quoted.text ? m.quoted.text : '');
        if (qwery.trim().length === 0) return reply(`Teksnya?\nExample: ${prefix + command} apa itu rumah`);
        client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

        try {
          let thinking = qwery.includes("--thinking");
          let search = qwery.includes("--search");

          // Hapus flag dari query agar tidak dikirim sebagai teks ke API
          qwery = qwery.replace("--thinking", "").replace("--search", "").trim();

          let imageUrl = null;

          // Jika ada quoted image, upload ke TelegraPh
          if (m.quoted && /image/.test(m.quoted.mimetype)) {
            let getMedia = await client.downloadAndSaveMediaMessage(m.quoted); // Simpan media
            imageUrl = await TelegraPh(getMedia); // Upload ke TelegraPh
          }

          // Fungsi untuk melakukan request dengan retry
          let fetchWithRetry = async (url, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
              try {
                let response = await fetchJson(url);
                if (response.result !== "Unexpected response format") {
                  return response; // Jika response valid, kembalikan response
                }
                console.log(`Attempt ${i + 1}: Unexpected response format. Retrying...`);
              } catch (err) {
                console.error(`Attempt ${i + 1}: Error fetching data:`, err);
              }
              await new Promise(resolve => setTimeout(resolve, delay)); // Tunggu sebelum retry
            }
            throw new Error("Max retries reached. Unable to get a valid response.");
          };

          // Panggil API YUUDEV dengan retry
          let apiUrl = `https://api-v2.yuudev.my.id/api/ai/deepseek?message=${encodeURIComponent(qwery)}&thinking=${thinking}&search=${search}`;
          if (imageUrl) apiUrl += `&image=${imageUrl}`;

          let response = await fetchWithRetry(apiUrl); // Gunakan fetchWithRetry
          console.log(qwery);
          rafaelbut(response.result); // Kirim balasan
          client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } catch (err) {
          console.error("Terjadi kesalahan:", err);
          m.reply("Terjadi kesalahan saat memproses pesan.");
        }
      }
        break;
      // ======================================== //        
      case 'hidetag': {
        addToMenu('group', command)
        if (!m.isGroup) return reply(mess.group)
        if (!isCreator) return reply(mess.owner)
        client.sendMessage(m.chat, { text: q ? q : '', mentions: participants.map(a => a.id) }, { quoted: m })
      }
        break
      case 'speed': case 'ping': {
        addToMenu('main', command)
        let { performance } = (await import('perf_hooks')).default;
        let v8 = (await import('v8')).default;
        let os = (await import('os')).default;
        let eold = performance.now()
        const used = process.memoryUsage()
        const cpus = os.cpus().map(cpu => {
          cpu.total = Object.keys(cpu.times).reduce(
            (last, type) => last + cpu.times[type],
            0
          )
          return cpu
        })
        const cpu = cpus.reduce(
          (last, cpu, _, { length }) => {
            last.total += cpu.total
            last.speed += cpu.speed / length
            last.times.user += cpu.times.user
            last.times.nice += cpu.times.nice
            last.times.sys += cpu.times.sys
            last.times.idle += cpu.times.idle
            last.times.irq += cpu.times.irq
            return last
          },
          {
            speed: 0,
            total: 0,
            times: {
              user: 0,
              nice: 0,
              sys: 0,
              idle: 0,
              irq: 0
            }
          }
        )
        let heapStat = v8.getHeapStatistics()
        let neow = performance.now()
        const x = "`"
        const myip = await fetchJson("https://ipinfo.io/json")
        function hideIp(ip) {
          const ipSegments = ip.split(".")
          if (ipSegments.length === 4) {
            ipSegments[2] = "***"
            ipSegments[3] = "***"
            return ipSegments.join(".")
          } else {
            throw new Error("Invalid IP address")
          }
        }
        const ips = hideIp(myip.ip)
        let teks = `${x}INFO SERVER${x}
- Speed Respons: _${Number(neow - eold).toFixed(2)} Milisecond(s)_
- Hostname: _KyuuHOST_
- CPU Core: _${cpus.length}_
- Platform : _${os.platform()}_
- OS : _${os.version()} / ${os.release()}_
- Arch: _${os.arch()}_
- Ram: _${formatSize(
          os.totalmem() - os.freemem()
        )}_ / _${formatSize(os.totalmem())}_

${x}PROVIDER INFO${x}
- IP: ${ips}
- Region : _${myip.region} ${myip.country}_
- ISP : _${myip.org}_

${x}RUNTIME OS${x}
- _${runtime(os.uptime())}_

${x}RUNTIME BOT${x}
- _${runtime(process.uptime())}_

${x}NODE MEMORY USAGE${x}
${Object.keys(used)
            .map(
              (key, _, arr) =>
                `*- ${key.padEnd(
                  Math.max(...arr.map(v => v.length)),
                  " "
                )} :* ${formatSize(used[key])}`
            )
            .join("\n")}
*- Heap Executable :* ${formatSize(heapStat?.total_heap_size_executable)}
*- Physical Size :* ${formatSize(heapStat?.total_physical_size)}
*- Available Size :* ${formatSize(heapStat?.total_available_size)}
*- Heap Limit :* ${formatSize(heapStat?.heap_size_limit)}
*- Malloced Memory :* ${formatSize(heapStat?.malloced_memory)}
*- Peak Malloced Memory :* ${formatSize(heapStat?.peak_malloced_memory)}
*- Does Zap Garbage :* ${formatSize(heapStat?.does_zap_garbage)}
*- Native Contexts :* ${formatSize(heapStat?.number_of_native_contexts)}
*- Detached Contexts :* ${formatSize(
              heapStat?.number_of_detached_contexts
            )}
*- Total Global Handles :* ${formatSize(
              heapStat?.total_global_handles_size
            )}
*- Used Global Handles :* ${formatSize(heapStat?.used_global_handles_size)}
${cpus[0]
            ? `

*_Total CPU Usage_*
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
              .map(
                type =>
                  `*- ${(type + "*").padEnd(6)}: ${(
                    (100 * cpu.times[type]) /
                    cpu.total
                  ).toFixed(2)}%`
              )
              .join("\n")}

*_CPU Core(s) Usage (${cpus.length} Core CPU)_*
${cpus
              .map(
                (cpu, i) =>
                  `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(
                    cpu.times
                  )
                    .map(
                      type =>
                        `*- ${(type + "*").padEnd(6)}: ${(
                          (100 * cpu.times[type]) /
                          cpu.total
                        ).toFixed(2)}%`
                    )
                    .join("\n")}`
              )
              .join("\n\n")}`
            : ""
          }
`.trim()
        m.reply(teks)
      }
        break
      default:
        if (body.startsWith('>')) {
          if (m.fromMe) return
          if (!isCreator && !isChannel) return reply(`*[ System Notice ]* cannot access`)
          try {
            let evaled = await eval(body.slice(2))
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            await reply(evaled)
          } catch (err) {
            reply(String(err))
          }
        }
        if (body.startsWith('$')) {
          if (!isCreator) return reply(`*[ System Notice ]* cannot access`)
          if (m.fromMe) return
          qur = body.slice(2)
          exec(qur, (err, stdout) => {
            if (err) return reply(`${err}`)
            if (stdout) {
              reply(stdout)
            }
          })
        }
        // if (budy.includes('@6285179840140')) {
        //   const q = budy.replace('@6285179840140', '').trim();
        //   console.log(body)

        //   try {
        //     if (!text) return reply("Halo kak, ada yang bisa aku bantu?");
        //     let a = proto.WebMessageInfo.fromObject({
        //       key: {
        //         remoteJid: m.chat,
        //         fromMe: m.fromMe,
        //         id: m.id
        //       },
        //       message: m.message,
        //       ...(m.isGroup ? { participant: m.sender } : {})
        //     })
        //     // let copilot = "18772241042@s.whatsapp.net"
        //     let copilot = "6285770017326@s.whatsapp.net"
        //     await client.sendMessage(copilot, {
        //       forward: a
        //     });
        //     m.reply("Pesan berhasil diteruskan. Mohon tunggu balasan.");
        //     if (global.responseListener) {
        //       client.ev.off('messages.upsert', global.responseListener);
        //     }
        //     global.responseListener = async (msg) => {
        //       if (
        //         msg.messages[0].key.remoteJid === result &&
        //         msg.messages[0].message?.conversation
        //       ) {
        //         const response = msg.messages[0].message.conversation;
        //         await Rifky.sendMessage(m.chat, {
        //         text: `*Balasan Bot:*\n\n${response}`
        //         });
        //       }
        //     };
        //     client.ev.on('messages.upsert', global.responseListener);
        //   } catch (e) {
        //     return e
        //   }
        // }


        if (budy.includes('@6285179840140')) {
          const q = budy.replace('@6285179840140', '').trim(); // Menghapus tag bot dari pesan
          try {
            if (!q) return reply("Halo kak, ada yang bisa aku bantu?");
            if (m.fromMe) return
            // Fungsi untuk mengganti nomor dalam string atau objek
            function replaceNumberInJson(obj, targetNumber, replacement) {
              if (typeof obj === "string") {
                return obj.replace(new RegExp(targetNumber, "g"), replacement);
              } else if (typeof obj === "object" && obj !== null) {
                Object.keys(obj).forEach(key => {
                  obj[key] = replaceNumberInJson(obj[key], targetNumber, replacement);
                });
              }
              return obj;
            }

            const targetNumber = "@6285179840140"; // Nomor yang ingin dihapus
            const replacement = ""; // Ganti dengan string kosong

            // Salin objek m.message untuk memastikan data asli tidak terpengaruh
            let modifiedMessage = JSON.parse(JSON.stringify(m.message));

            // Ganti nomor dalam struktur JSON
            replaceNumberInJson(modifiedMessage, targetNumber, replacement);

            // Menentukan pesan yang akan diteruskan
            let forwardData = {};

            if (m.message?.imageMessage || m.message?.videoMessage || m.message?.documentMessage) {
              // Jika ada media (gambar, video, atau dokumen), gunakan forward
              forwardData = {
                forward: proto.WebMessageInfo.fromObject({
                  key: {
                    remoteJid: m.chat,
                    fromMe: m.fromMe,
                    id: m.id
                  },
                  message: modifiedMessage,
                  ...(m.isGroup ? { participant: m.sender } : {})
                })
              };
            } else {
              // Jika hanya teks, gunakan text
              forwardData = { text: q };
            }

            console.log(modifiedMessage); // Cek hasil modifikasi

            // Nomor tujuan yang akan menerima pesan
            let copilot = "18772241042@s.whatsapp.net";

            // Meneruskan pesan sesuai tipe (media atau teks)
            await client.sendMessage(copilot, forwardData);

            // Balasan untuk user yang menandai bot
            client.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
            // Listener untuk balasan dari copilot
            if (global.responseListener) {
              client.ev.off('messages.upsert', global.responseListener); // Menghapus listener sebelumnya jika ada
            }
            global.responseListener = async (msg) => {
              const incomingMessage = msg.messages[0];

              // Mengabaikan pesan dari bot sendiri
              if (incomingMessage.key.fromMe) return;

              // Mengecek apakah balasan berasal dari copilot
              if (
                incomingMessage.key.remoteJid === copilot &&
                incomingMessage.message?.conversation
              ) {
                const response = incomingMessage.message.conversation;

                // Mengirim balasan ke chat asli
                await client.sendMessage(m.chat, {
                  text: `*Balasan dari Copilot:*\n\n${response}`
                });
                client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
              }
            };
            client.ev.on('messages.upsert', global.responseListener);
          } catch (e) {
            console.error(e);
            return reply("Terjadi kesalahan saat meneruskan pesan.");
          }
        }


        client.elxyz = client.elxyz ? client.elxyz : {};
        if (m.fromMe) return;
        if (!m.text) return
        if (!client.elxyz[m.chat]) return;
        const prompt = m.text;
        let sessions = {};
        let aiStatus = {};
        let qwery = q + ' ' + (m.quoted && m.quoted.text ? m.quoted.text : '');
        if (qwery <= 0) return reply(`Teksnya?\nExample: ${prefix + command} apa itu rumah`)
        if (!prompt || prompt.startsWith('/'))
          if (!client.elxyz[m.chat]) return;

        console.log(`[${moment().format('HH:mm')}] from @${pushname}: ${prompt}`);

        try {
          // Jika ada pesan yang di-quoted
          if (m.quoted && /image/.test(m.quoted.mimetype)) {
            let getMedia = await client.downloadAndSaveMediaMessage(m.quoted); // Simpan media quoted
            let media = await fs.promises.readFile(getMedia); // Baca file media
            if (media) {
              let response = await chatGpt4(qwery, media); // Kirim media ke fungsi chatGpt4
              rafaelbut(response.reply); // Balas dengan hasil dari GPT-4
              return; // Keluar setelah memproses gambar
            }
          }

          // Jika pesan langsung adalah gambar
          if (/image/.test(mime)) {
            let getMedia = await client.downloadAndSaveMediaMessage(m); // Simpan media pesan langsung
            let media = await fs.promises.readFile(getMedia); // Baca file media
            if (media) {
              let response = await chatGpt4(qwery, media); // Kirim media ke fungsi chatGpt4
              rafaelbut(response.reply); // Balas dengan hasil dari GPT-4
              return; // Keluar setelah memproses gambar
            }
          }

          // Jika bukan quoted atau gambar, proses sebagai teks
          let response = await chatGpt4(qwery); // Kirim teks ke fungsi chatGpt4
          rafaelbut(response.reply); // Balas dengan hasil dari GPT-4
        } catch (err) {
          console.error("Terjadi kesalahan:", err);
          m.reply("Terjadi kesalahan saat memproses pesan.");
        }




    }
  } catch (err) {
    client.sendMessage(global.owner + '@s.whatsapp.net', { text: 'Hai sayang sepetinya ada yang eror, Harap di perbaiki ya!\n\n' + util.format(err) }, { quoted: m })
    await sleep(200)
    client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    console.error(err)
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})
