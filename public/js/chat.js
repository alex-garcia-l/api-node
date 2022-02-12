const txtUID = document.querySelector('#txtUID');
const txtMessage = document.querySelector('#txtMessage');
const usersOnline = document.querySelector('#usersOnline');
const allMessages = document.querySelector('#allMessages');
const btnSignOut = document.querySelector('#btnSignOut');

let user = null,
  socket = null;

const validarJWT = async () => {
  const token = localStorage.getItem('token') || '';

  if (!token && token.accessToken.length <= 10) {
    window.location = 'index.html';
    throw new Error('Need token valid');
  }

  const { accessToken, tokenType } = JSON.parse(token);

  const response = await fetch('http://localhost:8081/api/v1/auth/renovate-token', {
    method: 'GET',
    headers: {
      'Authorization': `${tokenType} ${accessToken}`,
      'Content-Type': 'application/json'
    },
  });

  const { user: userDB, tokenType: tokenTypeDB, accessToken: accessTokenDB } = await response.json();
  const newToken = {
    tokenType: tokenTypeDB,
    accessToken: accessTokenDB
  }

  localStorage.setItem('token', JSON.stringify(newToken));
  user = userDB;

  await connectSocket();
}

const connectSocket = async () => {

  const { accessToken, tokenType } = JSON.parse(localStorage.getItem('token'));

  socket = await io({
    'extraHeaders': {
      'authorization': `${tokenType} ${accessToken}`,
    }
  });

  socket.on('user-actives', (users) => {
    let html = '';
    users.forEach(({ name, uid }) => {
      html += `
      <div class="list-group-item ${user.uid === uid ? 'list-group-item-success' : ''}">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${name}</h5>
        </div>
        <p class="mb-1">${uid}</p>
      </div>
      `
    })

    usersOnline.innerHTML = html;
  });

  socket.on('chat-list', (messages) => {
    let html = '';
    messages.forEach(({ uid, message, name }) => {
      html += `
      <div class="list-group-item ${user.uid === uid ? 'list-group-item-success' : ''}">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${name}</h5>
        </div>
        <p class="mb-1">${message}</p>
      </div>
      `
    })

    allMessages.innerHTML = html;
  });

  socket.on('send-message-private', payload => {
    console.log(payload);
  });

  txtMessage.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode !== 13) {
      return;
    }

    uid = txtUID.value;
    message = txtMessage.value;
    if (message.trim !== '') {
      socket.emit('send-message', { uid, message });
    }
  });
}

const main = async () => {
  await validarJWT();
}

main();
