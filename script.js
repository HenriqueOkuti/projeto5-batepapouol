/*========================
    GLOBAL VARIABLES
========================*/

/*========================
    AUXILIAR FUNCTIONS
========================*/

function load_messages() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(messagelog);
}

/*========================
    MAIN FUNCTIONS
========================*/

function chat_start() {
  load_messages();

  setInterval(load_messages, 3000);
}

function messagelog(resposta) {
  const messages_box = document.querySelector(".messages_box");

  messages_box.innerHTML = "";

  for (let i = 0; i < resposta.data.length; i++) {
    const message = resposta.data[i];

    if (message.type == "message") {
      messages_box.innerHTML += `
                <div class="public-chat">
                <span class="time">(${message.time})</span>
                <strong>${message.from}</strong>
                <span> para </span>
                <strong>${message.to}: </strong>
                <span>${message.text}</span>
                </div>
                `;
    }
  }
}
