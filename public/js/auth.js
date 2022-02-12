const btnSignOut = document.querySelector('#google-sign-out');
const form = document.querySelector('form');

function handleCredentialResponse(response) {

  const body = { idToken: response.credential }
  const dataSend = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  fetch('http://localhost:8081/api/v1/auth/login-google', dataSend)
    .then(res => res.json())
    .then(res => {

      const token = {
        tokenType: res.tokenType,
        accessToken: res.accessToken
      }

      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('google-email', res.user.email);
      btnSignOut.style.display = 'block';
    })
    .catch(console.warn);
}

const email = localStorage.getItem('google-email');

if (email === null) {
  btnSignOut.style.display = 'none';
} else {
  btnSignOut.style.display = 'block';
}

btnSignOut.addEventListener('click', () => {
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(email, done => {
    localStorage.clear();
    location.reload();
  });
});

form.addEventListener('submit', evt => {
  evt.preventDefault();

  let data = {};

  for (let element of form.elements) {
    if (element.name.length > 0) {
      data[element.name] = element.value
    }
  }

  const dataSend = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('http://localhost:8081/api/v1/auth/login', dataSend)
    .then(res => res.json())
    .then(res => {
      
      const token = {
        tokenType: res.tokenType,
        accessToken: res.accessToken
      }

      localStorage.setItem('token', JSON.stringify(token));

    })
    .catch(error => console.log(error))
});
