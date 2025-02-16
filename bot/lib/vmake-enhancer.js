const axios = require('axios')

async function vmakeSubmit() {
    let payload = {
        "tool_type":"quality-enhancer",
        "url":"https://v1.pinimg.com/videos/mc/hevcMp4V2/7a/f1/a4/7af1a4de98a10358daf334266d5e6309_t4.mp4",
        "title":"download.mp4"
    }
    let response = await axios.post('https://vmake.ai/api/vm/tool/submit.json', payload)
    console.log(response.data)
}
vmakeSubmit();