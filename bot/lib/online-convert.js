const axios = require("axios");

async function getIDJobs() {
    try {
        let payload = {
            "operation": "toolcompressmp4",
            "fail_on_conversion_error": false,
            "fail_on_input_error": false
        }
        let response = await axios.post('https://dragon.online-convert.com/api/jobs?async=true', JSON.stringify(payload), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
            }
        })
        return response.data.sat.id_job
    } catch (error) {
        console.log(error)
        return error
    }
}
async function getIDJobsInput() {
    try {
        let idJobs = await getIDJobs()
        const maxAttempts = 7; // Maksimum jumlah percobaan (misalnya, 30 kali)
        let attempts = 0;


        console.log('ID JOB:' + idJobs)
        while (attempts < maxAttempts) {
            let response = await axios.get(`https://dragon.online-convert.com/api/jobs/${idJobs}?async=true`)
            if (response.data.id) {
                console.log('respon id:' + response.data.id)
                return response.data.id
            }
            attempts++;
            console.log(`Attempt ${attempts}: Waiting for response...`);
            await delay(1000); // Tunggu 1 detik sebelum mencoba lagi
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getInputJobsQueue(url) {
    try {
        let payloadInput = {
            "type": "remote",
            "source": url,
            "engine": "auto"
        }
        let payloadConversation = { "category": "video", "options": { "allow_multiple_outputs": true }, "target": "mp4" }
        let IDJobsInput = await getIDJobsInput()
        console.log(IDJobsInput)
        await axios.post(`https://dragon.online-convert.com/api/jobs/${IDJobsInput}/input`, JSON.stringify(payloadInput), {
            headers: {
                Host: 'dragon.online-convert.com',
                // Cookie: await getInputCookie(),
                // Cookie: '_ga=GA1.2.790417640.1731808348; qg_locale_suggest=true; QGID=840dfc79-e42e-4f3a-aa04-8c9488e8851e; _pk_ref.1.7d7a=%5B%22%22%2C%22%22%2C1735400198%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_id.1.7d7a=e21eade2ef3b09fd.1735400198.; _pk_ses.1.7d7a=1; qgrole=unregistered; qg_consent=true; qgExtension=true; hint_creator_studio=7; __gads=ID=a0b6478bf8ab9150:T=1735400198:RT=1735401301:S=ALNI_MbscE27LJTZS_nr-vbqQ31HTi4AbQ; __gpi=UID=00000fbf0549e402:T=1735400198:RT=1735401301:S=ALNI_Mb4VzisvbUSgMsBzaHJrcIcHWeuQQ; __eoi=ID=df2ed24960d23ca4:T=1735400198:RT=1735401301:S=AA-AfjaVUWf65-uugndZZ6d5h7kD; _ga_HJQSZ9Y8DY=GS1.2.1735400198.2.1.1735401302.39.0.0; FCNEC=%5B%5B%22AKsRol9XIpFarv8bM0jIH5cXAcLZpIgmbJldrEe1uIBa5-d-zlhBHgREblqKAo_CSJ8m33jwVqiZDkcb1KNg0h_SpIXVxPKi06pG1JCLIDlF2j51OiPlGsb6YpN3T6EnPzNuPJMZGZCepKwDsH2qLP0oFku6kg3iyg%3D%3D%22%5D%5D; x-oc-download-password=8f56de47d7f018e9227a191c9c412b5fb0907b9c1cdc5ab26424b018e200ff74',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.100 Safari/537.36',
            }
        })
        await axios.post(`https://dragon.online-convert.com/api/jobs/${IDJobsInput}/conversions`, JSON.stringify(payloadConversation), {
            headers: {
                Host: 'dragon.online-convert.com',
                // Cookie: await getInputCookie(),
                // Cookie: '_ga=GA1.2.790417640.1731808348; qg_locale_suggest=true; QGID=840dfc79-e42e-4f3a-aa04-8c9488e8851e; _pk_ref.1.7d7a=%5B%22%22%2C%22%22%2C1735400198%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_id.1.7d7a=e21eade2ef3b09fd.1735400198.; _pk_ses.1.7d7a=1; qgrole=unregistered; qg_consent=true; qgExtension=true; hint_creator_studio=7; __gads=ID=a0b6478bf8ab9150:T=1735400198:RT=1735401301:S=ALNI_MbscE27LJTZS_nr-vbqQ31HTi4AbQ; __gpi=UID=00000fbf0549e402:T=1735400198:RT=1735401301:S=ALNI_Mb4VzisvbUSgMsBzaHJrcIcHWeuQQ; __eoi=ID=df2ed24960d23ca4:T=1735400198:RT=1735401301:S=AA-AfjaVUWf65-uugndZZ6d5h7kD; _ga_HJQSZ9Y8DY=GS1.2.1735400198.2.1.1735401302.39.0.0; FCNEC=%5B%5B%22AKsRol9XIpFarv8bM0jIH5cXAcLZpIgmbJldrEe1uIBa5-d-zlhBHgREblqKAo_CSJ8m33jwVqiZDkcb1KNg0h_SpIXVxPKi06pG1JCLIDlF2j51OiPlGsb6YpN3T6EnPzNuPJMZGZCepKwDsH2qLP0oFku6kg3iyg%3D%3D%22%5D%5D; x-oc-download-password=8f56de47d7f018e9227a191c9c412b5fb0907b9c1cdc5ab26424b018e200ff74',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.100 Safari/537.36',
            }
        })
        await delay(2000)
        while (true) {
            let responseJob = await axios.get(`https://dragon.online-convert.com/api/jobs/${IDJobsInput}`, {
                headers: {
                    Host: 'dragon.online-convert.com',
                    // Cookie: await getInputCookie(),
                    // Cookie: '_ga=GA1.2.790417640.1731808348; qg_locale_suggest=true; QGID=840dfc79-e42e-4f3a-aa04-8c9488e8851e; _pk_ref.1.7d7a=%5B%22%22%2C%22%22%2C1735400198%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_id.1.7d7a=e21eade2ef3b09fd.1735400198.; _pk_ses.1.7d7a=1; qgrole=unregistered; qg_consent=true; qgExtension=true; hint_creator_studio=7; __gads=ID=a0b6478bf8ab9150:T=1735400198:RT=1735401301:S=ALNI_MbscE27LJTZS_nr-vbqQ31HTi4AbQ; __gpi=UID=00000fbf0549e402:T=1735400198:RT=1735401301:S=ALNI_Mb4VzisvbUSgMsBzaHJrcIcHWeuQQ; __eoi=ID=df2ed24960d23ca4:T=1735400198:RT=1735401301:S=AA-AfjaVUWf65-uugndZZ6d5h7kD; _ga_HJQSZ9Y8DY=GS1.2.1735400198.2.1.1735401302.39.0.0; FCNEC=%5B%5B%22AKsRol9XIpFarv8bM0jIH5cXAcLZpIgmbJldrEe1uIBa5-d-zlhBHgREblqKAo_CSJ8m33jwVqiZDkcb1KNg0h_SpIXVxPKi06pG1JCLIDlF2j51OiPlGsb6YpN3T6EnPzNuPJMZGZCepKwDsH2qLP0oFku6kg3iyg%3D%3D%22%5D%5D; x-oc-download-password=8f56de47d7f018e9227a191c9c412b5fb0907b9c1cdc5ab26424b018e200ff74',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.100 Safari/537.36',
                }
            })
            let statusCode = responseJob.data?.status?.code;

            console.log(`Status: ${statusCode}`);
            if (statusCode === 'completed') {
                console.log('Job completed!');
            let downloaduri = responseJob.data.output[0].uri ? responseJob.data.output[0].uri : responseJob.data.output[0].download_uri 
                return downloaduri
            }

            // Jika status masih incomplete, tunggu 1 detik sebelum mencoba lagi
            await delay(1000);
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = { getInputJobsQueue }