const axios = require('axios');
const cheerio = require('cheerio');

async function ttsaveapp(url) {
    try {
        const ttsave = "https://ttsave.app/download";
        const payload = {
            query: url,
            language_id: "2"
        };

        // Mengirim POST request ke ttsave.app
        const response = await axios.post(ttsave, payload);
        const $ = cheerio.load(response.data);

        // Ekstraksi informasi kreator
        const creator_name = $('h2.font-extrabold.text-xl.text-center').text().trim();
        const creator_username = $('a.font-extrabold.text-blue-400.text-xl.mb-2').text().trim();
        const creator_profile_url = $('a.flex.flex-col.justify-center.items-center img').attr('src') || "-";

        // Ekstraksi caption
        const caption = $('p').text().trim() || "-";

        // Ekstraksi nama musik
        const music_name = $('div.flex.flex-row.items-center.justify-center.gap-1 > span').text().trim() || "-";

        // Ekstraksi analytics secara dinamis
        const analyticsSpans = $('div.flex.flex-row.items-center.justify-center > div > span.text-gray-500');
        const analyticsLabels = ['views', 'likes', 'comments', 'saves', 'shares'];
        const analytics = {};

        analyticsSpans.each((index, element) => {
            if (analyticsLabels[index]) {
                analytics[analyticsLabels[index]] = $(element).text().trim();
            }
        });

        // Ekstraksi download links dan klasifikasikan menjadi video dan image
        const downloadLinks = $('#button-download-ready a');
        const video = [];
        const image = [];

        downloadLinks.each((index, element) => {
            const type = $(element).attr('type');
            const href = $(element).attr('href');
        
            if (type === "watermark") {
                video.push({
                    download_with_wm: href,
                });
            } else if (type === "no-watermark") {
                video.push({
                    download_no_wm: href,
                });
            } else if (type === "slide") {
                image.push(href);
            }
        });
        
     

        // Menghapus duplikasi dalam video array
        const uniqueVideo = video.reduce((acc, current) => {
            const existing = acc.find(item => item.download_with_wm === current.download_with_wm || item.download_no_wm === current.download_no_wm);
            if (!existing) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Ekstraksi music URL
        const music_url = downloadLinks.filter((i, el) => $(el).attr('type') === 'audio').attr('href') || "-";

        // Persiapkan objek JSON
        const result = {
            creator_name,
            creator_username,
            creator_profile_url,
            caption,
            music_name,
            analytics,
            video: uniqueVideo.length > 0 ? uniqueVideo : null,
            image: image.length > 0 ? image : null,
            music_url
        };

        return result;
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return { error: error.message };
    }
}

module.exports = {ttsaveapp}