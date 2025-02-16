const WebSocket = require('ws');
const puppeteer = require('puppeteer-core');
const cron = require('node-cron');

// WebSocket headers
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
    "Origin": "https://www.cybercoder.ai",
    "Sec-WebSocket-Protocol": "vite-hmr",
};

// WebSocket function to connect and handle messages
const connectWebSocket = (url) => {
    const ws = new WebSocket(url, { headers });

    ws.on('open', () => console.log(`Connected to ${url}`));
    ws.on('message', data => console.log(`Received: ${data}`));
    ws.on('close', () => {
        console.log(`Disconnected from ${url}`);
        setTimeout(() => connectWebSocket(url), 5000);
    });
    ws.on('error', err => console.error(`Error: ${err.message}`));
};

// Scrape function to extract WebSocket URLs from a page
const scrapeSandbox = async (url) => {
    const browser = await puppeteer.launch({
        headless: true, // Ubah ke false jika perlu debugging
        executablePath: '/usr/bin/chromium', // Path ke Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    try {
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('body');

        
    } catch (error) {
        console.error('Error during scraping:', error.message);
    } finally {
        await browser.close();
    }
};

// WebSocket URLs to check
const urls = [
   "wss://45c4wp.csb.app/stable-f1a4fb101478ce6ec82fe9627c43efbf9e98c813?reconnectionToken=efdce00c-1798-48d9-b86b-a21adaab59e8&reconnection=false&skipWebSocketFrames=false",
];

// Cron job to check WebSocket connections every minute
cron.schedule('*/1 * * * *', () => {
    console.log('Running WebSocket connection check...');
    urls.forEach(connectWebSocket); // Connect to all WebSocket URLs
    scrapeSandbox('https://www.cybercoder.ai/?sandbox=45c4wp'); // Scrape and connect to WebSocket URLs found
});
