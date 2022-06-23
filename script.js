/*========================
    GLOBAL VARIABLES
========================*/

let name;
let msg_buffer = [];

/*========================
    AUXILIAR FUNCTIONS
========================*/

function load_messages() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(messagelog);
  promise.catch(reset);
}

function reset() {
  window.location.reload();
}

function private_msg_check(message) {}

function login_user(){
  const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' , {name: name});
}

function keep_online(){
  const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status' , {name: name});
}

/*========================
    MAIN FUNCTIONS
========================*/

function chat_start() {
  while (name == undefined || name == ""){
    name = prompt("Qual o seu nome?");
  }

  login_user();
  load_messages();

  setInterval(load_messages, 3000);
  setInterval(keep_online, 5000);
}

function messagelog(resposta) {
  const messages_box = document.querySelector(".messages_box");

  messages_box.innerHTML = "";

  for (let i = 0; i < resposta.data.length; i++) {
    const message = resposta.data[i];

    if (message.type == "message") {
      messages_box.innerHTML += `
        <div class="public-chat chat">
          <span class="time">(${message.time})</span>
          <strong>${message.from}</strong>
          <span> para </span>
          <strong>${message.to}: </strong>
          <span>${message.text}</span>
        </div>
        `;
    }

    if (message.type == "status") {
      messages_box.innerHTML += `
        <div class="status chat">
        <span class="time">(${message.time})</span>
        <strong>${message.from}</strong>
        <span>${message.text}</span>
        </div>
        `;
    }

    if (private_msg_check(message)) {
      messages_box.innerHTML += `
      <div class="private-chat chat">
        <span class="horario">(${message.time})</span>
        <strong>${message.from}</strong>
        <span> reservadamente para </span>
        <strong>${message.to}: </strong>
        <span>${message.text}</span>
      </div>
      `;
    }

  }
  
  /* NOT WORKING PROPERLY */
  const last_msg = document.querySelector(".messages_box .chat:last-child");
  msg_buffer.push(last_msg);
  if (msg_buffer[msg_buffer.length - 1] !== msg_buffer[msg_buffer.length - 2]){
    last_msg.scrollIntoView();

    if (msg_buffer.length > 3){
      let last_message = msg_buffer[msg_buffer.length - 1];
      let penultimate_message = msg_buffer[msg_buffer.length - 2];

      msg_buffer = [];

      msg_buffer.push(penultimate_message);
      msg_buffer.push(last_message);
    }
  }
  

}

function send_message(){
  const text = document.querySelector(".text_message").value;
  const text_obj = {
    from: name,
    to: "Todos",
    text: text,
    type: "message"
  };

  document.querySelector(".text_message").value = "";
  const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', text_obj);
  promise.then(load_messages);
  promise.catch(reset);

}