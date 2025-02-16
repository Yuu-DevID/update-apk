
    //General Settings 
global.prefa = ['','!','.',',','🐤','🗿']
global.owner = "6285770017326"
global.ownNumb = "6285770017326"
global.namebot = "Jenitaa - Maid"
global.botname = "Jenitaa - Maid"
global.namaowner = "Kyuu"
global.web = "https://api.rafaellzy.xyz"
global.idsal = "120363346755996902@newsletter"
global.packname = "KyuuBot"
global.media = "https://i.pinimg.com/736x/7e/4e/94/7e4e948b57b6153f3c16e9c583ec6115.jpg"


global.mess = {
    success: 'Success ✓',
    done: 'Success ✓',
    admin: 'Fitur Khusus Admin Group!',
    botAdmin: 'botz Harus Menjadi Admin Terlebih Dahulu!',
    owner: 'Fitur Khusus Owner',
    group: 'Fitur Khusus Group Chat',
    private: 'Fitur Khusus Private Chat!',
    bot: 'Fitur Khusus Nomor Owner',
    wait: 'Sabar ya sedang proses',
    band: 'kamu telah di banned oleh owner\nminta unbanned ke owner agar bisa menggunakan fitur bot lagi',
    notregist: 'Kamu belum terdaftar di database bot silahkan daftar terlebih dahulu',
    premium: 'Kamu Bukan User Premium, Beli Sana Ke Owner Bot',
    error: "*Maaf fitur sedang Error*",
    endLimit: 'Limit Harian Anda Telah Habis, Limit Akan Direset Setiap Pukul 00:00 WIB.',
}
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})