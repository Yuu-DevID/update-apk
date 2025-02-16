const WebSocket = require('ws');
const axios = require('axios');
const debug = require('debug')('copilot-edge');
const FormData = require('form-data')
const fs = require('fs')

const userAgent = 'CopilotNative/30.0.421224001 (Android 9; google; G011A)';

// Constants for WebSocket messages
const H = JSON.stringify({
  event: 'setOptions',
  ads: {
    supportedTypes: ['text', 'propertyPromotion', 'tourActivity', 'product', 'multimedia']
  }
});

class CopilotEdgeClient {
  constructor() {
    this.axios = axios.create({
      headers: {
        'accept-language': 'en-US,en;q=0.9',
        'origin': 'https://copilot.microsoft.com',
        'user-agent': userAgent,
        'referer': 'https://copilot.microsoft.com/chats',
        'x-search-uilang': 'en-us'
      }
    });
  }

  async deleteConversation(conversationId, accessToken) {
    debug('Deleting conversation:', conversationId);
    try {
      const headers = this._getAuthHeaders(accessToken);
      await this.axios.delete(
        `https://copilot.microsoft.com/c/api/conversations/${conversationId}`,
        { headers }
      );
      debug('Conversation deleted successfully');
      return true;
    } catch (error) {
      debug('Error deleting conversation:', error.message);
      throw error;
    }
  }

  async createConversation(accessToken) {
    debug('Creating new conversation');
    try {
      let headers = this._getAuthHeaders(accessToken);
      const response = await this.axios.post(
        'https://copilot.microsoft.com/c/api/conversations',
        {},
        { headers }
      );
      debug('Conversation created with ID:', response.data.id);
      return response.data.id;
    } catch (error) {
      debug('Error creating conversation:', error.message);
      throw error;
    }
  }

  async _readImage(imagePath) {
    try {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Mengunduh file dari URL
        const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
      } else {
        // Membaca file lokal
        return fs.readFileSync(imagePath);
      }
    } catch (error) {
      throw new Error(`Error reading image: ${error.message}`);
    }
  }

  // Fungsi untuk mengunggah gambar ke server
  async attachment(accessToken, image) {
    try {
      const authtoken = this._getAuthHeaders(accessToken);
      const imageBuffer = await this._readImage(image);

      const response = await axios.post('https://copilot.microsoft.com/c/api/attachments', imageBuffer, {
        headers: {
          Authorization: authtoken.Authorization,
          Origin: 'https://copilot.microsoft.com',
          'User-Agent': userAgent,
          'Content-Length': imageBuffer.length,
          'Content-Type': 'image/jpeg',
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error; // Agar error dapat ditangani di tempat pemanggilan
    }
  }

  // Fungsi utama untuk chat
  async chat(accessToken, conversationId, query, image = '') {
    debug('Starting chat with query:', query);
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(
        `wss://copilot.microsoft.com/c/api/chat?api-version=2${accessToken ? `&accessToken=${accessToken}` : ''}`,
        {
          headers: {
            Origin: 'https://copilot.microsoft.com',
            'User-Agent': userAgent,
          },
        }
      );

      const messages = [];

      ws.on('open', async () => {
        try {
          debug('WebSocket connection opened');
          // Send initial options
          ws.send(H);

          let imageAttach = image ? await this.attachment(accessToken, image) : null;
          const messageContent = imageAttach
            ? [{ type: 'image', url: imageAttach }, { type: 'text', text: query }]
            : [{ type: 'text', text: query }];

          const message = {
            event: 'send',
            mode: 'chat',
            conversationId,
            content: messageContent,
          };

          ws.send(JSON.stringify(message));
        } catch (error) {
          debug('Error during WebSocket open:', error.message);
          ws.close();
          reject(error);
        }
      });

      ws.on('message', (data) => {
        const message = data.toString();
        debug('Received message:', message);

        if (message.includes('"event":"done"')) {
          debug('Chat completed');
          ws.close();
          resolve(messages);
          return;
        }

        if (message.includes('"event":"error"')) {
          debug('Error in chat:', message);
          messages.push({ error: true, message });
        } else {
          messages.push({ error: false, message });
        }
      });

      ws.on('error', (error) => {
        debug('WebSocket error:', error.message);
        reject(error);
      });

      ws.on('close', () => {
        debug('WebSocket connection closed');
      });
    });
  }

  _getAuthHeaders(accessToken) {
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return headers;
  }
}

async function example() {
  try {
    const client = new CopilotEdgeClient();
    let accessToken = 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhDQkMtSFMyNTYiLCJ4NXQiOiJlX1lNbkc3dXNVbXJWVEhPSnhFQ1hKVW12eGsiLCJ6aXAiOiJERUYifQ.N7Nnf-ubAP3zMgu4K3ZeGJjSaAh6X1Bxr81HtOP5A1JEX2ZVQohKsV4AjYXlqu2JY-Z1FlLvs56YzFQbmD-IQnOqktURRy6PWQ6MsrcZemG-7C8d5LNeW-bHj_1RH4QxhCUPikn8vJQzt2sxYsV_Kp83ThTRSBcFji5ZNkqmVRI3vBRXFq2vgLw11oqcUppT-sPsSggD9oW76g5LSEKuoVpaedOwjauA81VVPC0PSBP7UY-D8iMt1Q--qALQwXA-kg-BfSSP0nEro3uLMClyelrrykWEEc8SXPSahHoW2FVawhN7m450y4HCMWoX_Pmy-1pMucMtY_ftY0r5KvvIUQ.rhPbujyJP_L-mlN_u0iFiA.url26oxXnW_S51N2nDkmcVXp69Mp6zohfZd--WA5xsAilPD-V6-9ZTzY6CqwDuJZ_cmOhEWnGwzcmVB9apGSwJd3TjAyQqKv9kyeA8qSu4lvdqaqqF1TsFBxHEJ20xuRibGSlTtWK5swVxJev0Wq8q-CSMOFDkJPPqBDOOd7Z5_LK8_EzJiz_HBnjij6VrRHGzR7aOppvuMKpMzg5eBPDzTR-HrEfK3q3A0fYJPFBOOK0WLTzlFlnX668XPxUyLdJ8beTcUUfZcvtU9Vsdr11-a2h_jvLhzMx4FD6IFCjrIwkvsvS7AxQmKXkZm7a3czigjo1F-bOpruMaLTxHK9rmHZg0EDzvkaOgDu06hqE1XWJKCWY8rp_UDWdkXNDyuhPPk7rrzkv1S5bCMZ_kosgRC243-bSdZsGlSMfHp4mxQkVSb8kntcOAgC1fRU3k-905IT9U2uz3cnaXGN3ctF_BVFPWuNK2Ro-ONIGHQUGREDkxncKVVyTP6NcynUhuH_2ULh2FWTB8N15SRRpSKoKdZobkYAPZph8eYT9Utm5oCWHgTIaoKP7MSEsXJKsXp-g-3tHXRd3Bu4C1TeZ8jKjvJyoA0_hqjdA0U8GuOurcpqUvWL482mxCFoEC67fbPtrHkzsCokUCcFD5loAJ0nhZvWvf2W-wuiDZT1mldvD9NNy_Q8lxteYbx-YoxBsSMU8klOVl43LOkYPay1tKdb8VZy_nMVRVZ3buGS_inQSR9Kk0Zm4y8IxlBoCoprtv1uvJsDkPvcMddelPnLx0GWpqNLQw2GmOtOXvp4WDdNXjiCw_m1_xKoUlHAWlTL-QkMBe2aBv7kAy3zyaoM1emVbEQLN-QB3su81UiG1GbZdm9phS5ZiaIsP3rav4aNrI-1wsVJLuaZJp57RvqZ8a2AK60e9qKKQtX3OiEm7FH8PhLv8wn-wfCBDO4UIogGxPDZ9h7txooU3s7nBENCZDQuxxalA0LZHGRrAKFy56GBtaZzP9q5iy3I9IqpPumBOijo-v-Gm8rVvUYhj_O5pCzpinBXoNyCpCpH_7eKfkEzZ00oL8adazEDG9Ngu_aLDO_RlGBbZjWvwuGbkklcP4RIKcRCufbV8wVgyALuVdOMtMtCMoEj8-jHu8f12Dhy2QrpNXjJJytXKjevZYD3CnGE9oFj0TT2MGN1yfDx7WWwUqJEZj0g7qyQPzFhWT1kfLEIstbSg0vscJWn_-K5VviAAg5KgW5XVax9sCv1TZ1WRrFrAE7zzHFsW3JFqAc3kdclJf72B_Cyh6Vpha_ls8FB-1s8ZqeHEOxyMuovYb-sA4r2fBO7YsPmk-q-NXTXT9RXkDDA8eY9-4Po9Uj5PS0odREYz0Qp8ymxU_BBiP7jg-RqjgtnLi9p_vaWrqrBLHKT.pzk_QXK3CnXQQRD_yu24lw'
    // Create a new conversation
    const conversationId = await client.createConversation(accessToken);
    console.log('Created conversation:', conversationId);

    // Send a message and get response
    const messages = await client.chat(accessToken, conversationId, 'tahukah kamu karakter yang pada gambar?', 'https://i.pinimg.com/736x/7e/4e/94/7e4e948b57b6153f3c16e9c583ec6115.jpg');
    let finalres = messages.map(item => JSON.parse(item.message)) // Parse each `message` string into an object
      .filter(parsed => parsed.event === "appendText") // Filter messages with `event: "appendText"`
      .map(parsed => parsed.text) // Extract the `text` field
      .join(""); // Combine all text into a single string
    console.log('Received messages:', finalres);

    // Delete the conversation
    await client.deleteConversation(conversationId, accessToken);
    console.log('Deleted conversation');
  } catch (error) {
    console.error('Error:', error);
  }
}

example();