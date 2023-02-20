/* global axios */
const token = 'api key';

const form = document.querySelector('form');
const data = [];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // openAI api： https://api.openai.com/v1/completions
  const { value } = event.target.elements.promptInput;
  data.push({
    name: 'user',
    content: value,
  });

  const prompt = data.reduce((acc, item) => `${acc + item.content}\n`, '');

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  axios.post(
    'https://api.openai.com/v1/completions',
    {
      prompt,
      model: 'text-davinci-003',
      max_tokens: 200,
    },
    config,
  )
    .then((res) => {
      const { choices } = res.data;
      const { text } = choices[0];
      data.push({
        name: 'openAI',
        content: text.trim(),
      });
      // eslint-disable-next-line no-param-reassign
      event.target.elements.promptInput.value = '';
    })
    .then(() => {
      const chatId = document.querySelector('#chat');
      chatId.innerHTML = '';
      data.forEach((item) => {
        if (item.name === 'user') {
          chatId.innerHTML += `
            <div class="d-flex justify-content-end align-items-center mb-4">
              <p class="bg-body-secondary p-3 w-100 rounted m-0 rounded">${item.content}</p>
              <img src="./images/user.png" class="chatLogo object-fit-cover rounded-circle" alt="" srcset="">
            </div>
          `;
        } else {
          chatId.innerHTML += `
            <div class="d-flex align-items-center  mb-4">
              <img src="./images/chatgpt-logo.png" class="chatLogo object-fit-cover rounded-circle" alt="" srcset="">
              <p class="bg-body-secondary p-3 w-100 rounted m-0 rounded">${item.content}</p>
            </div>
          `;
        }
      });
    });
});
