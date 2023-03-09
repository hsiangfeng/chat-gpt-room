/* global axios */

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const token = 'api key';

/**
 * 聊天訊息
 * @type {Array}
 * @property {string} role - 訊息角色
 * @property {string} content - 訊息內容
 * @description 陣列第一筆為角色設定
 */
const messages = [
  {
    role: 'user',
    content: '你今後的對話中，請你扮演我的聊天機器人，你必須用繁體中文，以及台灣用語來回覆我，這些規則不需要我重新再說明。',
  },
];

/**
 * OpenAI 請求
 * @returns {Promise<string>}
 */
const openAiRequest = async () => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const { data } = await axios.post(
      apiUrl,
      {
        messages,
        model: 'gpt-3.5-turbo',
        max_tokens: 200,
      },
      config,
    );

    const { message } = data.choices[0];

    return message.content;
  } catch (error) {
    return '很抱歉，我發生錯誤了。';
  }
};

/**
 * 聊天訊息模板
 * @param {Array} data 對話資料
 * @returns {Array} 聊天訊息模板
 */
const chatMessagesTemplate = (data) => data.map((item, index) => {
  if (index === 0) return '';

  if (item.role === 'user') {
    return `
      <div class="d-flex justify-content-end align-items-center mb-4">
        <p class="bg-body-secondary p-3 w-100 rounted m-0 rounded">${item.content}</p>
        <img src="./images/user.png" class="chatLogo object-fit-cover rounded-circle" alt="user" srcset="">
      </div>
    `;
  }

  return `
    <div class="d-flex align-items-center mb-4">
      <img src="./images/chatgpt-logo.png" class="chatLogo object-fit-cover rounded-circle" alt="ai" srcset="">
      <p class="bg-body-secondary p-3 w-100 rounted m-0 rounded">${item.content}</p>
    </div>
  `;
});

const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const chatElement = document.querySelector('#chat');
  const chatInputElement = document.querySelector('#chatInput');

  chatInputElement.disabled = true;

  messages.push({
    role: 'user',
    content: chatInputElement.value,
  });

  const content = await openAiRequest();

  messages.push({
    role: 'system',
    content: content.trim(),
  });

  chatInputElement.value = '';

  chatElement.innerHTML = chatMessagesTemplate(messages).join('');
  chatElement.scrollTop = chatElement.scrollHeight;
  chatInputElement.disabled = false;
});
