//Only added this line to push right version to github

/*========================
    GLOBAL VARIABLES
========================*/

let name;
let msg_buffer = [];

let global_aux = 0;

/*========================
    AUXILIAR FUNCTIONS
========================*/

//Loads messages from the server
function load_messages() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promise.then(messagelog);
  promise.catch(reset);
}

//Reloads page
function reset() {
  window.location.reload();
}

//Logically verifies if message is private or not
function private_msg_check(message) {
  if (message.to === 'Todos' || message.to !== name) {
    return false;
  }
  return true;
}

//Logs user in the chat
function login_user() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    { name: name }
  );

  //If error then resets login
  promise.catch(reset_login);
}

//Recieves an error code, if duplicated user then restarts the procedure via chat_start()
function reset_login(error) {
  error_code = (error.response.status);
  if (error_code == 400) {
    alert(`Usuário já presente! Tente novamente com um nome diferente de ${name}`);
    name = undefined;
    chat_start();
  }
}

//Keeps user logged in
function keep_online() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    { name: name }
  );
}

/*========================
    MAIN FUNCTIONS
========================*/

function chat_start() {
  while (name == undefined || name == "") {
    name = prompt("Qual o seu nome?");
  }

  login_user();
  load_messages();

  //Keeps updating the messages
  setInterval(load_messages, 3000);

  //Keeps user online
  setInterval(keep_online, 5000);
}

function messagelog(resposta) {
  const messages_box = document.querySelector(".messages_box");

  messages_box.innerHTML = "";

  for (let i = 0; i < resposta.data.length; i++) {
    const message = resposta.data[i];


    //Public messages
    if (message.type == "message" && !private_msg_check(message)) {
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

    //Status messages
    if (message.type == "status") {
      messages_box.innerHTML += `
        <div class="status chat">
        <span class="time">(${message.time})</span>
        <strong>${message.from}</strong>
        <span>${message.text}</span>
        </div>
        `;
    }

    //Private messages
      //if TRUE then user is able to view private message
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

  //message buffer for scroll into view
  const last_msg = document.querySelector(".messages_box .chat:last-child");
  if (global_aux == 0) {
    msg_buffer.push(last_msg);
    msg_buffer.push(last_msg);  //Somehow it works when i do a double push, witchcraft perhaps?
    global_aux++;
  }
  msg_buffer.push(last_msg);

  let penultimate_message = msg_buffer[msg_buffer.length - 2];
  let last_message = msg_buffer[msg_buffer.length - 1];

  //Actual buffer comparison
  if (last_message.innerHTML !== penultimate_message.innerHTML) {
    last_msg.scrollIntoView();
  }

  //Buffer reset so that i does not grow into infinity
  if (msg_buffer.length > 3) {
    msg_buffer = [];

    msg_buffer.push(penultimate_message);
    msg_buffer.push(last_message);
  }
}

function send_message() {
  const text = document.querySelector(".text_message").value;

  //Prevents error with blank message
  if (text == "") {
    return;
  }

  //Writes message as an object, without ability to select a person to send or type of message (private or public)
  const text_obj = {
    from: name,
    to: "Todos",
    text: text,
    type: "message",
  };

  //Sends the message object to the server and resets the previous text from the screen
  document.querySelector(".text_message").value = "";
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    text_obj
  );

  //loads messages from server
  promise.then(load_messages);
  promise.catch(reset);
}
