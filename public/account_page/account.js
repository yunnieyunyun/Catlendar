const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const indicator = document.getElementById('indicator');
const formWrapper = document.getElementById('formWrapper');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  indicator.classList.remove('signup');
  formWrapper.classList.remove('show-signup');
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  indicator.classList.add('signup');
  formWrapper.classList.add('show-signup');
});

function logIn(email, password) {
  fetch('/logIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Signed in successfully');
        sessionStorage.setItem('loggedIn', true);
        console.log(sessionStorage.getItem('loggedIn'));
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('name', data.name);
        window.location.replace('../index.html');
      }
    })
    .catch((error) => {
      alert('An error occurred while signing in');
      console.error('Error:', error.message);
    });
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Login submitted');

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  logIn(email, password);
});

// Create account
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Signup submitted');

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  fetch('/createAccount', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log('Account created successfully');
        logIn(email, password);
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
});
