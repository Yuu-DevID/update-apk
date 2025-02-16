const WebSocket = require('ws');
const axios = require('axios')
const cron = require('node-cron');

// Fungsi untuk koneksi WebSocket dan kirim pesan
function connectWebSocket() {
    const headers = {
        Host: 'www.cybercoder.ai',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Origin: 'https://www.cybercoder.ai',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': 'lPTt+73tt6Ida0nqDr3/Aw==',
        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        // 'Sec-WebSocket-Protocol': 'vite-hmr',
    };

    const ws = new WebSocket('wss://www.cybercoder.ai/', {
        headers
    });

    ws.on('open', () => {
        console.log('WebSocket connection opened');
        // Kirim pesan ping
        ws.send(JSON.stringify({ type: 'ping' }));
        console.log('Ping message sent');
        ws.close(); // Tutup koneksi setelah pesan dikirim
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
    });
}

async function keepOn() {
    let response = await axios.get('https://m6hpk3-3030.csb.app/')
    console.log(response.status)
    if (response.status == 200) {
        console.log('Server Di Ping!')
    }
}

// Jadwalkan tugas setiap 1 menit
cron.schedule('*/1 * * * *', async () => {
    console.log('Running cron job at:', new Date().toLocaleString());
    connectWebSocket();
    await keepOn()
});
