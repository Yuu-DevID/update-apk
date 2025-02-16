require("./config");
const { useMongoAuthState } = require("session")
const { default: makeWASocket, jidNormalizedUser, delay, DisconnectReason, makeCacheableSignalKeyStore, makeInMemoryStore, jidDecode, proto, getContentType, useMultiFileAuthState, extractMessageContent, downloadContentFromMessage, generateForwardMessageContent, generateWAMessageFromContent } = require("baileys");
const pino = require('pino');
const path = require('path');
const moment = require('moment-timezone');
const { Boom } = require('@hapi/boom');
const NodeCache = require("node-cache");
const fs = require('fs');
const chalk = require('chalk');
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber');
const figlet = require('figlet');
const FileType = require('file-type');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, sleep, reSize } = require('./lib/myfunc');
const fetch = require('node-fetch');
const { smsg } = require('./lib/function');
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const { toAudio, toPTT, toVideo, ffmpeg } = require('./lib/converter');

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => { rl.question(text, resolve) });
};

const sessionID = process.argv[2]?.split("--pairing=")[1];
if (!sessionID) {
  console.error("Error: Argumen '--pairing=' harus disertakan.");
  process.exit(1); // Keluar dari proses dengan kode error
}
console.log(sessionID);

console.log(color(figlet.textSync("KyuuDEV", {
  font: 'DOS Rebel',
  horizontalLayout: 'default',
  vertivalLayout: 'default',
  width: 100,
  whitespaceBreak: false
}), 'pink'));

console.log(chalk.white.bold(`${chalk.green.bold("📃  Informasi :")}         
✉️  Script Base - Simple
✉️  Author : Jenitaa
✉️  Gmail : ryuumantaro@gmail.com
✉️  Instagram : https://www.instagram.com/dev.kyuu

${chalk.green.bold("Script Made By Kyuu (Rename By KyuuDEV) :D")}\n`));


async function startBotz() {
  const { state, saveCreds, clear, removeCreds, query } = await useMongoAuthState("mongodb+srv://ryuumantaro:G2PybiRSwgwoKaH2@cluster0.uc9pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "sessions", "user-"+sessionID)
  const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
  const client = makeWASocket({
    logger: pino({ level: "silent" }),
    version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
    printQRInTerminal: false,
    browser: [ 'Ubuntu', 'Safari', '10.15.7' ],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    msgRetryCounterCache, // Resolve waiting messages
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
          message.buttonsMessage 
          || message.templateMessage
          || message.listMessage
      );
      if (requiresPatch) {
          message = {
              viewOnceMessage: {
                  message: {
                      messageContextInfo: {
                          deviceListMetadataVersion: 2,
                          deviceListMetadata: {},
                      },
                      ...message,
                  },
              },
          };
      }
  
      return message;
  },
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid)
      let msg = await store.loadMessage(jid, key.id)
      return msg?.message || ""
    },
  });

  if (!client.authState.creds.registered) {
    setTimeout(async () => {
      let code = await client.requestPairingCode(sessionID);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(chalk.green.bold(`Pairing Code :`, code));
    }, 3000);

  }

  store.bind(client.ev)

  client.ev.on('messages.upsert', async chatUpdate => {
    try {
      mek = chatUpdate.messages[0]
      if (!mek.message) return
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return
      if (!client.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
      if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
      m = smsg(client, mek, store)
      require("./case")(client, m, chatUpdate, store)
    } catch (err) {
      console.log(err)
    }
  })

  /** group partisipasi apdet **/
  client.ev.on('group-participants.update', async (anu) => {
    console.log(anu)
    try {
      let metadata = await client.groupMetadata(anu.id)
      let participants = anu.participants
      for (let num of participants) {
        try {
          ppuser = await client.profilePictureUrl(num, 'image')
        } catch (err) {
          ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
        }
        try {
          ppgroup = await client.profilePictureUrl(anu.id, 'image')
        } catch (err) {
          ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
        }

        /** welcome **/
        const memb = metadata.participants.length
        const yumiWlcm = await getBuffer(ppuser)
        const yumiLft = await getBuffer(ppuser)

        if (anu.action == 'add') {
          const yumiName = num
          const xtime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
          const xdate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
          const xmembers = metadata.participants.length
          const wel = `╭─❖「 ${metadata.subject} 」
│❐ Welcome: @${yumiName.split("@")[0]}
│❐ Member: ${xmembers}th
│❐ Date: ${xdate}
╰───────────────┈ ⳹`
          client.sendMessage(anu.id, {
            image: yumiWlcm, caption: wel, contextInfo: {
              mentionedJid: [num]
            }
          }, {
            quoted: {
              key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                ...({ remoteJid: 'status@broadcast' })
              },
              "message": {
                "pollCreationMessage": {
                  "name": `Powered by client`,
                  "options": [
                    {
                      "optionName": "KATANYA SEPUH"
                    },
                    {
                      "optionName": "BERANI VOTE GA"
                    },
                    {
                      "optionName": "VOTE LAH SEMUA"
                    },
                    {
                      "optionName": "KATANYA SEPUH"
                    },
                    {
                      "optionName": "SALAM DARI YUMI BOT"
                    }
                  ],
                  "selectableOptionsCount": 5
                }
              }
            }
          })
          /** leave **/
        } else if (anu.action == 'remove') {
          const yumiName = num
          const yumiTime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
          const yumiDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
          const yumimembers = metadata.participants.length
          const say = `╭─❖「 ${metadata.subject} 」
│❐ Goodbye: @${yumiName.split("@")[0]}
│❐ Member: ${yumimembers}Th
│❐ Date: ${yumiDate}
╰───────────────┈ ⳹`
          client.sendMessage(anu.id, {
            image: yumiLft, caption: say, contextInfo: {
              mentionedJid: [num]
            }
          }, {
            quoted: {
              key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                ...({ remoteJid: 'status@broadcast' })
              },
              "message": {
                "pollCreationMessage": {
                  "name": `Powered by client`,
                  "options": [
                    {
                      "optionName": "KATANYA SEPUH"
                    },
                    {
                      "optionName": "BERANI VOTE GA"
                    },
                    {
                      "optionName": "VOTE LAH SEMUA"
                    },
                    {
                      "optionName": "KATANYA SEPUH"
                    },
                    {
                      "optionName": "SALAM DARI YUMI BOT"
                    }
                  ],
                  "selectableOptionsCount": 5
                }
              }
            }
          })
          /** promote **/
        } else if (anu.action == 'promote') {
          const yumiBuffer = await getBuffer(ppuser)
          const yumiTime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
          const yumiDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
          let yumiName = num
          yumiBody = `Selamat @${yumiName.split("@")[0]} telah menjadi admin`
          client.sendMessage(anu.id, {
            text: yumiBody,
            contextInfo: {
              mentionedJid: [num],
              "externalAdReply": {
                "showAdAttribution": true,
                "containsAutoReply": true,
                "title": global.botname,
                "body": '',
                "previewType": "PHOTO",
                "thumbnailUrl": '',
                "thumbnail": yumiBuffer,
                "sourceUrl": global.media
              }
            }
          })
          /** demote **/
        } else if (anu.action == 'demote') {
          const yumiBuffer = await getBuffer(ppuser)
          const yumiTime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
          const yumiDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
          let yumiName = num
          yumiBody = `Yahh @${yumiName.split("@")[0]} bukan admin lagi`
          // client.sendMessage(anu.id, {
          //   text: yumiBody,
          //   contextInfo: {
          //     mentionedJid: [num],
          //     "externalAdReply": {
          //       "showAdAttribution": true,
          //       "containsAutoReply": true,
          //       "title": global.botname,
          //       "body": '',
          //       "previewType": "PHOTO",
          //       "thumbnailUrl": '',
          //       "thumbnail": yumiBuffer,
          //       "sourceUrl": global.media
          //     }
          //   }
          // })
        }
      }
    } catch (err) {
      console.log(err)
    }
  })

  // Setting
  client.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }
  client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp(buff)
    }
    await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
      .then(response => {
        fs.unlinkSync(buffer)
        return response
      })
  }
  client.getName = (jid, withoutContact = false) => {
    id = client.decodeJid(jid)
    withoutContact = client.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
      v = store.contacts[id] || {}
      if (!(v.name || v.subject)) v = client.groupMetadata(id) || {}
      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? {
      id,
      name: 'WhatsApp'
    } : id === client.decodeJid(client.user.id) ?
      client.user :
      (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
  }

  client.public = true

  client.serializeM = (m) => smsg(client, m, store);
  client.ev.on('connection.update', async (update) => {
    	const { connection, lastDisconnect } = update
    	try {
    	if (connection === 'close') {
    		let reason = new Boom(lastDisconnect?.error)?.output.statusCode
    			if (reason === DisconnectReason.badSession) {
    				console.log(`Bad Session File, Please Delete Session and Scan Again`);
    				startBotz()
    			} else if (reason === DisconnectReason.connectionClosed) {
    				console.log("Connection closed, reconnecting....");
    				startBotz();
    			} else if (reason === DisconnectReason.connectionLost) {
    				console.log("Connection Lost from Server, reconnecting...");
    				startBotz();
    			} else if (reason === DisconnectReason.connectionReplaced) {
    				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
    				startBotz()
    			} else if (reason === DisconnectReason.loggedOut) {
    				console.log(`Device Logged Out, Please Scan Again And Run.`);
    				startBotz();
    			} else if (reason === DisconnectReason.restartRequired) {
    				console.log("Restart Required, Restarting...");
    				startBotz();
    			} else if (reason === DisconnectReason.timedOut) {
    				console.log("Connection TimedOut, Reconnecting...");
    				startBotz();
    			} else client.end(`Unknown DisconnectReason: ${reason}|${connection}`)
    		}
    		if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
    			console.log(`[ Connecting... ]`)
    		}
    		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
    			console.log(`[ Connected ✓ ] ` + JSON.stringify(client.user, null, 2))
          client.sendMessage(`120363204296060200@newsletter`, { text: `Hai Sayang KyuuBotz On Kembali` })
    		}
    	} catch (err) {
    		console.log('Error di connection update ' + err)
    		startBotz();
    	}
    })
    
    client.ev.on("creds.update", saveCreds);

  // client.ev.on('creds.update', saveCreds)

  client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, { text: text, ...options }, { quoted })

  client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    // Memastikan quoted memeriksa message.msg dan message.header.imageMessage jika ada
    let quoted = message.msg || message.header?.imageMessage || message;

    // Lanjutkan dengan kode lainnya
    let mime = quoted.mimetype || '';
    let messageType = quoted.mtype ? quoted.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    
    const stream = await downloadContentFromMessage(quoted, messageType);

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName;

    if (filename == undefined) {
      trueFileName = `${filename}.${type.ext}`;
    } else if (typeof filename === 'string' && filename.includes('.') && filename.split('.').pop()) {
      trueFileName = filename;
    }

    let savePath = path.join(__dirname, 'tmp', trueFileName); // Simpan ke folder 'tmp'
    await fs.writeFileSync(savePath, buffer);
    return savePath;
};



  client.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = []
    for (let i of kon) {
      list.push({
        displayName: await client.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(i + '@s.whatsapp.net')}\nFN:${await client.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      })
    }
  }
  client.getFile = async (PATH, returnAsFilename) => {
    let res, filename
    const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    const type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    }
    if (data && returnAsFilename && !filename) (filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
    return {
      res,
      filename,
      ...type,
      data,
      deleteFile() {
        return filename && fs.promises.unlink(filename)
      }
    }
  }
  client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
      vtype = Object.keys(message.message.viewOnceMessage.message)[0]
      delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
      delete message.message.viewOnceMessage.message[vtype].viewOnce
      message.message = {
        ...message.message.viewOnceMessage.message
      }
    }

    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await client.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id
    })
    return waMessage
  }
  client.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    let type = await client.getFile(path, true)
    let { res, data: file, filename: pathFile } = type
    if (res && res.status !== 200 || file.length <= 65536) {
      try { throw { json: JSON.parse(file.toString()) } }
      catch (e) { if (e.json) throw e.json }
    }
    let opt = { filename }
    if (quoted) opt.quoted = quoted
    if (!type) options.asDocument = true
    let mtype = '', mimetype = type.mime, convert
    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
    else if (/video/.test(type.mime)) mtype = 'video'
    else if (/audio/.test(type.mime)) (
      convert = await (ptt ? toPTT : toAudio)(file, type.ext),
      file = convert.data,
      pathFile = convert.filename,
      mtype = 'audio',
      mimetype = 'audio/ogg; codecs=opus'
    )
    else mtype = 'document'
    if (options.asDocument) mtype = 'document'

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: { url: pathFile },
      mimetype
    }
    let m
    try {
      m = await client.sendMessage(jid, message, { ...opt, ...options })
    } catch (e) {
      console.error(e)
      m = null
    } finally {
      if (!m) m = await client.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
      return m
    }
  }

  client.downloadMediaMessage = async (message) => {
    let quoted = message.msg || message.header?.imageMessage || message;

    // Lanjutkan dengan kode lainnya
    let mime = quoted.mimetype || '';
    let messageType = quoted.mtype ? quoted.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }

  return client
}

startBotz()
// function parseMessage(content) {
//   content = extractMessageContent(content);

//   if (content && content.viewOnceMessageV2Extension) {
//     content = content.viewOnceMessageV2Extension.message;
//   }
//   if (content && content.protocolMessage && content.protocolMessage.type == 14) {
//     let type = getContentType(content.protocolMessage);
//     content = content.protocolMessage[type];
//   }
//   if (content && content.message) {
//     let type = getContentType(content.message);
//     content = content.message[type];
//   }

//   return content;
// }
// function smsg(client, m, store) {
//   if (!m) return m
//   m.message = parseMessage(m.message);
//   let M = proto.WebMessageInfo
//   if (m.key) {
//     m.id = m.key.id
//     m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
//     m.chat = m.key.remoteJid
//     m.fromMe = m.key.fromMe
//     m.isGroup = m.chat.endsWith('@g.us')
//     m.sender = client.decodeJid(m.fromMe && client.user.id || m.participant || m.key.participant || m.chat || '')
//     if (m.isGroup) m.participant = client.decodeJid(m.key.participant) || ''
//   }
//   if (m.message) {
//     m.mtype = getContentType(m.message)
//     m.msg = parseMessage(m.message[m.mtype]) || m.message[m.mtype];
//     m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
//     m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
//     let quoted = m.quoted = parseMessage(m.msg?.contextInfo?.quotedMessage);
//     m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
//     if (m.quoted) {
//       let type = getContentType(quoted)
//       m.quoted = m.quoted[type]
//       if (['productMessage'].includes(type)) {
//         type = getContentType(m.quoted)
//         m.quoted = m.quoted[type]
//       }
//       if (typeof m.quoted === 'string') m.quoted = {
//         text: m.quoted
//       }
//       m.quoted.mtype = type
//       m.quoted.id = m.msg.contextInfo.stanzaId
//       m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
//       m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
//       m.quoted.sender = client.decodeJid(m.msg.contextInfo.participant)
//       m.quoted.fromMe = m.quoted.sender === client.decodeJid(client.user.id)
//       m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
//       m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
//       m.getQuotedObj = m.getQuotedMessage = async () => {
//         if (!m.quoted.id) return false
//         let q = await store.loadMessage(m.chat, m.quoted.id, conn)
//         return exports.smsg(conn, q, store)
//       }
//       let vM = m.quoted.fakeObj = M.fromObject({
//         key: {
//           remoteJid: m.quoted.chat,
//           fromMe: m.quoted.fromMe,
//           id: m.quoted.id
//         },
//         message: quoted,
//         ...(m.isGroup ? { participant: m.quoted.sender } : {})
//       })
//       m.quoted.delete = () => client.sendMessage(m.quoted.chat, { delete: vM.key })
//       m.quoted.copyNForward = (jid, forceForward = false, options = {}) => client.copyNForward(jid, vM, forceForward, options)
//       m.quoted.download = () => client.downloadMediaMessage(m.quoted)
//     }
//   }
//   if (m.msg.url) m.download = () => client.downloadMediaMessage(m.msg)
//   m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
//   m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? client.sendMedia(chatId, text, 'file', '', m, { ...options }) : client.sendText(chatId, text, m, { ...options })
//   m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)))
//   m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => client.copyNForward(jid, m, forceForward, options)

//   return m
// }

// Fungsi untuk menghapus semua file dan folder dalam direktori
function clearDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        clearDirectory(filePath); // Hapus isi folder secara rekursif
        fs.rmdirSync(filePath); // Hapus folder setelah kosong
      } else {
        fs.unlinkSync(filePath); // Hapus file
      }
    }
    console.log(`Directory ${directory} cleaned successfully!`);
  } catch (err) {
    console.error(`Error cleaning directory ${directory}:`, err.message);
  }
}

// Path yang ingin dibersihkan
const tmpPaths = [path.join(__dirname, 'tmp')];

// Fungsi untuk membersihkan semua folder yang ditentukan
function cleanTmpFolders() {
  tmpPaths.forEach(clearDirectory);
}

// Jalankan setiap 1 jam (3600000 milidetik)
setInterval(cleanTmpFolders, 3600000);

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})
